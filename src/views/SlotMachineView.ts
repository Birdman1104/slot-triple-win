import { lego } from "@armathai/lego";
import anime from "animejs";
import { Container, Graphics, Rectangle } from "pixi.js";
import { reelShadowConfig } from "../configs/spritesConfig";
import { ReelViewEvents, SlotMachineViewEvents, UIEvents } from "../events/MainEvents";
import { ReelModelEvents, SlotMachineModelEvents } from "../events/ModelEvents";
import { CONFIGS } from "../GameConfig";
import { ElementModel } from "../models/ElementModel";
import { SlotMachineModel, SlotMachineState } from "../models/SlotMachineModel";
import { makeSprite } from "../utils/Utils";
import { Element } from "./ElementView";
import type { Ice } from "./IceView";
import { Reel } from "./ReelView";
import { SlotForeground } from "./SlotForeground";

type AnimationConfig = {
  elements: Element[];
  ice: Ice[];
};
const SHADOWS_X = [131, 375, 630];

export class SlotMachineView extends Container {
  private reels!: Reel[];
  private reelsContainer!: Container;
  private reelsMask!: Graphics;
  private result!: SpinResult;
  private foreground!: SlotForeground;

  private slotState: SlotMachineState = SlotMachineState.Unknown;

  private winAnimations: any[] = [];

  constructor(private config: SlotMachineModel) {
    super();

    this.build();

    lego.event
      .on(SlotMachineModelEvents.StateUpdate, this.onStateUpdate, this)
      .on(UIEvents.SpinButtonClick, this.onSpinButtonClick, this)
      .on(SlotMachineModelEvents.SpinResultUpdate, this.onSpinResultUpdate, this)
      .on(ReelModelEvents.ElementsUpdate, this.onReelElementsUpdate, this);
  }

  public destroy(): void {
    lego.event.off(SlotMachineModelEvents.StateUpdate, this.onStateUpdate, this);
    lego.event.off(UIEvents.SpinButtonClick, this.onSpinButtonClick, this);
    lego.event.off(SlotMachineModelEvents.SpinResultUpdate, this.onSpinResultUpdate, this);
    lego.event.off(ReelModelEvents.ElementsUpdate, this.onReelElementsUpdate, this);
    super.destroy();
  }
  public getBounds(): Rectangle {
    return new Rectangle(0, -10, 2.9 * CONFIGS.elementWidth, 2.9 * CONFIGS.elementHeight);
  }

  public getReelByUUID(uuid: string): Reel | undefined {
    return this.reels.find((reel) => reel.uuid === uuid) as Reel;
  }

  private build(): void {
    this.buildReels();
    this.addMask();
    this.addShadows();
    this.buildForeground();
  }

  private buildForeground(): void {
    this.foreground = new SlotForeground();
    this.foreground.hideEverything();
    this.foreground.on("winBoardShowComplete", () => lego.event.emit(SlotMachineViewEvents.WinningsShowComplete));
    this.addChild(this.foreground);
  }

  private buildReels(): void {
    const { reels } = this.config;
    this.reelsContainer = new Container();
    this.reels = reels.map((model, i) => {
      const reel = new Reel(model, i);
      reel.on(ReelViewEvents.OldElementsDropComplete, this.onReelOldElementsDropComplete, this);
      reel.on(ReelViewEvents.NewElementsDropComplete, this.onReelNewElementsDropComplete, this);
      reel.position.set(reel.width * i + (i == 0 ? 0 : CONFIGS.elementOffsetX), 0);
      this.reelsContainer.addChild(reel);
      return reel;
    });
    this.reelsContainer.scale.set(0.95);
    this.addChild(this.reelsContainer);
  }

  private addShadows(): void {
    SHADOWS_X.forEach((x) => {
      const shadow = makeSprite(reelShadowConfig(x));
      this.addChild(shadow);
    });
  }

  private addMask(): void {
    this.reelsMask = new Graphics();
    this.reelsMask.beginFill(0xff0000, 0.5);
    this.reelsMask.alpha = 0;
    this.reelsMask.drawRect(
      this.reelsContainer.x - 13,
      this.reelsContainer.y - 6,
      3 * CONFIGS.elementWidth,
      2.9 * CONFIGS.elementHeight - 20,
    );
    this.reelsMask.endFill();
    this.addChild(this.reelsMask);

    this.reelsContainer.mask = this.reelsMask;
  }

  private onStateUpdate(newState: SlotMachineState): void {
    this.slotState = newState;
    switch (newState) {
      case SlotMachineState.DropOld:
        this.dropOldElements();
        break;
      case SlotMachineState.DropNew:
        this.dropNewElements();
        break;
      case SlotMachineState.ShowWinLines:
        this.reelsContainer.mask = null;
        this.showWinLines();
        break;
      case SlotMachineState.ShowWinnings:
        this.showWinnings();
        break;
      case SlotMachineState.Idle:
        this.reelsContainer.mask = this.reelsMask;
        break;
      default:
    }
  }

  private onReelElementsUpdate(newValue: ElementModel[], _oldValue: ElementModel[], uuid: string): void {
    const reel = this.getReelByUUID(uuid);
    if (!reel) return;
    reel.setNewElements(newValue);
  }

  private onSpinResultUpdate(result: SpinResult): void {
    this.result = result;
  }

  private onSpinButtonClick(): void {
    // Animation skip depending on state
    switch (this.slotState) {
      case SlotMachineState.DropNew:
        this.reels.forEach((r) => r.forceStop());
        break;
      case SlotMachineState.ShowWinLines:
        this.removeWinAnimations();
        break;
      case SlotMachineState.ShowWinnings:
        this.foreground.skipWinnings();
        break;
      default:
        break;
    }
  }

  private dropOldElements(): void {
    this.reels.forEach((r, i) => r.dropOldElements(CONFIGS.dropOldElementsDelay * i));
  }

  private dropNewElements(): void {
    this.reels.forEach((r, i) => r.dropNewElements(CONFIGS.dropNewElementsDelay * i));
  }

  private onReelOldElementsDropComplete(uuid: string): void {
    if (this.getReelIndexByUUID(uuid) === this.reels.length - 1) {
      lego.event.emit(SlotMachineViewEvents.OldElementsDropComplete);
    }
  }

  private onReelNewElementsDropComplete(uuid: string): void {
    if (this.getReelIndexByUUID(uuid) === this.reels.length - 1) {
      lego.event.emit(SlotMachineViewEvents.NewElementsDropComplete);
    }
  }

  private showWinnings(): void {
    if (this.result.totalWin === 0) {
      setTimeout(() => {
        // Hardcoded fix. need a frame update in order to change the state and emit the event
        lego.event.emit(SlotMachineViewEvents.WinningsShowComplete);
      });
      return;
    }

    this.foreground.showWin(this.result);
  }

  private showWinLines(): void {
    const lines = this.result.winningInfo.filter((info) => info.line);
    if (lines.length === 0) {
      setTimeout(() => {
        // Hardcoded fix. need a frame update in order to change the state and emit the event
        lego.event.emit(SlotMachineViewEvents.WinLinesShowComplete);
      });
      return;
    }

    this.animateLines(this.getLinesData(lines));
  }

  private getLinesData(lines: WinningInfo[]): { line: WinningLine; winningItemType: string }[] {
    return lines.map((r) => {
      if (!r.line) {
        return { line: [], winningItemType: r.id };
      }
      return { line: r.line, winningItemType: r.id };
    });
  }

  private animateLines(lines: { line: WinningLine; winningItemType: string }[]): void {
    const animationConfig: AnimationConfig[] = lines.map(({ line }) => {
      return { elements: this.getElements(line), ice: this.getIce(line) };
    });

    if (animationConfig.length === 0) return;

    this.winAnimations = [];
    const playNextAnimation = (index: number, animations: any[]): void => {
      if (!animations[index]) {
        lego.event.emit(SlotMachineViewEvents.WinLinesShowComplete);
        return;
      }
      animations[index].play();
      animations[index].complete = () => playNextAnimation(index + 1, animations);
    };

    animationConfig.forEach(({ elements, ice }) => {
      const timeline = anime.timeline(CONFIGS.winLinesTimelineConfig);
      elements.forEach((e) => timeline.add(CONFIGS.winElementAnimationConfig(e), 0));
      ice.forEach((e) => timeline.add(CONFIGS.winIceAnimationConfig(e), 0));
      this.winAnimations.push(timeline);
    });

    playNextAnimation(0, this.winAnimations);
  }

  private removeWinAnimations(): void {
    this.winAnimations.forEach((a) => {
      a.pause();
      a.remove();
    });

    const animationConfig = this.getAnimationConfig();

    animationConfig.forEach(({ elements, ice }) => {
      [...elements, ...ice].forEach((e) => e.reset());
    });

    lego.event.emit(SlotMachineViewEvents.WinLinesShowComplete);
  }

  private getAnimationConfig(): AnimationConfig[] {
    return this.result.winningInfo.map(({ line }) => ({ elements: this.getElements(line), ice: this.getIce(line) }));
  }
  private getElements(line: WinningLine | undefined): Element[] {
    return line ? line.map((pos, i) => this.reels[i].getElementByIndex(pos)) : [];
  }
  private getIce(line: WinningLine | undefined): Ice[] {
    return line ? line.map((pos: any, i: number) => this.reels[i].getIceByIndex(pos)) : [];
  }
  private getReelIndexByUUID(uuid: string): number {
    return this.reels.findIndex((reel) => reel.uuid === uuid);
  }
}

import { lego } from "@armathai/lego";
import anime from "animejs";
import { Container, Graphics, Rectangle, Sprite, Texture } from "pixi.js";
import { HEIGHT, OFFSET_X, WIDTH } from "../config";
import { reelShadowConfig } from "../configs/spritesConfig";
import { ReelViewEvents, SlotMachineViewEvents, UIEvents } from "../events/MainEvents";
import { ReelModelEvents, SlotMachineModelEvents } from "../events/ModelEvents";
import { ElementModel } from "../models/ElementModel";
import { SlotMachineModel, SlotMachineState } from "../models/SlotMachineModel";
import { LINES } from "../slotLogic";
import { makeSprite } from "../utils/Utils";
import { Element } from "./ElementView";
import { Reel } from "./ReelView";
import { SlotForeground } from "./SlotForeground";

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
    return new Rectangle(0, -10, 2.9 * WIDTH, 2.9 * HEIGHT);
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

    this.foreground.on("winBoardShowComplete", () => {
      lego.event.emit(SlotMachineViewEvents.WinningsShowComplete);
    });
    this.addChild(this.foreground);
  }

  private buildReels(): void {
    const { reels } = this.config;
    this.reelsContainer = new Container();
    this.reels = reels.map((model, i) => {
      const reel = new Reel(model, i);
      reel.on(ReelViewEvents.OldElementsDropComplete, this.onReelOldElementsDropComplete, this);
      reel.on(ReelViewEvents.NewElementsDropComplete, this.onReelNewElementsDropComplete, this);
      reel.position.set(reel.width * i + (i == 0 ? 0 : OFFSET_X), 0);
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
    this.reelsMask.drawRect(this.reelsContainer.x - 13, this.reelsContainer.y - 6, 3 * WIDTH, 2.9 * HEIGHT - 20);
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
    this.reels.forEach((r, i) => r.dropOldElements(i * 100));
  }

  private dropNewElements(): void {
    this.reels.forEach((r, i) => r.dropNewElements(i * 100));
  }

  private onReelOldElementsDropComplete(uuid: string): void {
    const reel = this.getReelByUUID(uuid);
    if (!reel) return;
    const reelIndex = this.reels.indexOf(reel);
    if (reelIndex === this.reels.length - 1) {
      lego.event.emit(SlotMachineViewEvents.OldElementsDropComplete);
    }
  }

  private onReelNewElementsDropComplete(uuid: string): void {
    const reel = this.getReelByUUID(uuid);
    if (!reel) return;
    const reelIndex = this.reels.indexOf(reel);
    if (reelIndex === this.reels.length - 1) {
      lego.event.emit(SlotMachineViewEvents.NewElementsDropComplete);
    }
  }

  private showWinnings(): void {
    if (this.result.totalWin === 0) {
      setTimeout(() => {
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
        lego.event.emit(SlotMachineViewEvents.WinLinesShowComplete);
      });
      return;
    }

    const linesData: { line: WinningLine; winningItemType: string }[] = lines.map((r) => {
      if (!r.line) {
        return { line: [], winningItemType: r.id };
      }
      return { line: r.line, winningItemType: r.id };
    });

    this.animateLines(linesData);
  }

  private animateLines(lines: { line: WinningLine; winningItemType: string }[]): void {
    const animationConfig: { elements: Element[]; ice: Sprite[] }[] = lines.map(({ line }) => {
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

    animationConfig.forEach(({ elements, ice }, lineNumber) => {
      const timeline = anime.timeline({
        duration: 800,
        easing: "easeInBack",
        direction: "alternate",
        autoplay: false,
      });
      elements.forEach((e) => {
        timeline.add(
          {
            targets: e.scale,
            x: 1.35,
            y: 1.35,
            complete: () => e.endAnimation(),
          },
          0,
        );
      });

      ice.forEach((e, i) => {
        const isTwo = (lines[lineNumber].line[i] + i) % 2 === 0;
        const winTexture = isTwo ? "ice_win_1.png" : "ice_win_2.png";
        const basicTexture = isTwo ? "ice_1.png" : "ice_2.png";
        timeline.add(
          {
            targets: e.scale,
            x: 1.35,
            y: 1.35,
            begin: () => {
              e.texture = Texture.from(winTexture);
            },
            complete: () => {
              e.texture = Texture.from(basicTexture);
            },
          },
          0,
        );
      });
      this.winAnimations.push(timeline);
    });

    playNextAnimation(0, this.winAnimations);
  }

  private removeWinAnimations(): void {
    this.winAnimations.forEach((a) => {
      a.pause();
      a.remove();
    });

    const animationConfig: { elements: Element[]; ice: Sprite[] }[] = LINES.map((line) => {
      return { elements: this.getElements(line), ice: this.getIce(line) };
    });

    animationConfig.forEach(({ elements, ice }, lineNumber) => {
      elements.forEach((e) => {
        e.scale.set(1);
      });

      ice.forEach((e, i) => {
        e.scale.set(1);
        const isTwo = (LINES[lineNumber][i] + i) % 2 === 0;
        const basicTexture = isTwo ? "ice_1.png" : "ice_2.png";
        e.texture = Texture.from(basicTexture);
      });
    });

    lego.event.emit(SlotMachineViewEvents.WinLinesShowComplete);
  }

  private getElements(line: WinningLine): Element[] {
    return line.map((pos, i) => this.reels[i].getElementByIndex(pos));
  }
  private getIce(line: any): Sprite[] {
    return line.map((pos: any, i: number) => this.reels[i].getIceByIndex(pos));
  }
}

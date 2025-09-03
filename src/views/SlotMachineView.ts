import { lego } from "@armathai/lego";
import anime from "animejs";
import { Container, Graphics, Rectangle, Sprite } from "pixi.js";
import { HEIGHT, OFFSET_X, WIDTH } from "../config";
import { dockSpriteConfig, reelShadowConfig } from "../configs/spritesConfig";
import { ReelViewEvents, SlotMachineViewEvents } from "../events/MainEvents";
import { ReelModelEvents, SlotMachineModelEvents } from "../events/ModelEvents";
import { ElementModel } from "../models/ElementModel";
import type { ReelModel } from "../models/ReelModel";
import { SlotMachineModel, SlotMachineState } from "../models/SlotMachineModel";
import { makeSprite } from "../utils/Utils";
import { Element } from "./ElementView";
import { Reel } from "./ReelView";
import { SlotForeground } from "./SlotForeground";

export class SlotMachineView extends Container {
  private dock!: Sprite;
  private reels!: Reel[];
  private reelsContainer!: Container;
  private reelsMask!: Graphics;
  private result!: SpinResult;
  private foreground!: SlotForeground;

  constructor(private config: SlotMachineModel) {
    super();

    this.build();

    lego.event
      .on(SlotMachineModelEvents.StateUpdate, this.onStateUpdate, this)
      .on(SlotMachineModelEvents.ReelsUpdate, this.onReelsUpdate, this)
      .on(SlotMachineModelEvents.SpinResultUpdate, this.onSpinResultUpdate, this)
      .on(ReelModelEvents.ElementsUpdate, this.onReelElementsUpdate, this);
  }

  public getBounds(): Rectangle {
    return new Rectangle(0, -10, 2.9 * WIDTH, 2.9 * HEIGHT);
  }

  public getReelByUUID(uuid: string): Reel {
    return this.reels.find((reel) => reel.uuid === uuid) as Reel;
  }

  private build(): void {
    this.dock = makeSprite(dockSpriteConfig());
    this.addChild(this.dock);

    this.buildReels();

    [131, 375, 630].forEach((x) => {
      const shadow = makeSprite(reelShadowConfig(x));
      this.addChild(shadow);
    });

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
      const reel = new Reel(model);
      reel.on(ReelViewEvents.OldElementsDropComplete, this.onReelOldElementsDropComplete, this);
      reel.on(ReelViewEvents.NewElementsDropComplete, this.onReelNewElementsDropComplete, this);
      reel.position.set(reel.width * i + (i == 0 ? 0 : OFFSET_X), 0);
      this.reelsContainer.addChild(reel);
      return reel;
    });
    this.reelsContainer.scale.set(0.95);

    this.addChild(this.reelsContainer);

    this.reelsMask = new Graphics();
    this.reelsMask.beginFill(0xff0000, 0.0001);
    this.reelsMask.drawRect(this.reelsContainer.x, this.reelsContainer.y - 8, 3.16 * WIDTH, 2.85 * HEIGHT);
    this.reelsMask.endFill();
    this.addChild(this.reelsMask);

    this.reelsContainer.mask = this.reelsMask;
  }

  private onStateUpdate(newState: SlotMachineState): void {
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
    reel.setNewElements(newValue);
  }

  private onSpinResultUpdate(result: SpinResult): void {
    this.result = result;
  }

  private onReelsUpdate(newReels: ReelModel[]): void {
    if (this.reels.length !== 0) {
      this.reels.forEach((r) => r.destroy());
      this.reels = [];
    }

    this.reels = newReels.map((model: ReelModel, i: number) => {
      const reel = new Reel(model);
      reel.position.set(reel.width * i + (i == 0 ? 0 : OFFSET_X), 0);
      this.reelsContainer.addChild(reel);
      return reel;
    });

    this.reelsMask = new Graphics();
    this.reelsMask.beginFill(0xff0000, 0.0001);
    this.reelsMask.drawRect(this.reelsContainer.x, this.reelsContainer.y - 8, 3.16 * WIDTH, 2.85 * HEIGHT);
    this.reelsMask.endFill();
    this.addChild(this.reelsMask);

    this.reelsContainer.mask = this.reelsMask;
  }

  private dropOldElements(): void {
    this.reels.forEach((r, i) => r.dropOldElements(i * 100));
  }

  private dropNewElements(): void {
    this.reels.forEach((r, i) => r.dropNewElements(i * 100));
  }

  private onReelOldElementsDropComplete(uuid: string): void {
    const reel = this.getReelByUUID(uuid);
    const reelIndex = this.reels.indexOf(reel);
    if (reelIndex === 0) {
      lego.event.emit(SlotMachineViewEvents.OldElementsDropComplete);
    }
  }

  private onReelNewElementsDropComplete(uuid: string): void {
    const reel = this.getReelByUUID(uuid);
    const reelIndex = this.reels.indexOf(reel);
    if (reelIndex === this.reels.length - 1) {
      lego.event.emit(SlotMachineViewEvents.NewElementsDropComplete);
    }
  }

  private showWinnings(): void {
    if (this.result.totalWin === 0) {
      lego.event.emit(SlotMachineViewEvents.WinningsShowComplete);
      return;
    }

    this.foreground.showWin(this.result.totalWin);
  }

  private showWinLines(): void {
    if (this.result.winningInfo.length === 0) {
      lego.event.emit(SlotMachineViewEvents.WinLinesShowComplete);
    }

    const linesData: { line: WinningLine; winningItemType: string }[] = this.result.winningInfo.map((r) => {
      return { line: r.line, winningItemType: r.id };
    });

    this.animateLines(linesData);
  }

  private animateLines(lines: { line: WinningLine; winningItemType: string }[]): void {
    const getElements = (line: WinningLine) => line.map((pos, i) => this.reels[i].getElementByIndex(pos));
    const getIce = (line: any) => line.map((pos: any, i: number) => this.reels[i].getIceByIndex(pos));
    const animationConfig: { elements: Element[]; ice: Sprite[]; winningItemType: string }[] = lines.map(
      ({ line, winningItemType }) => {
        return { elements: getElements(line), ice: getIce(line), winningItemType };
      }
    );

    if (animationConfig.length === 0) return;

    const animations: any[] = [];
    const playNextAnimation = (index: number, animations: any[]): void => {
      if (!animations[index]) {
        lego.event.emit(SlotMachineViewEvents.WinLinesShowComplete);
        return;
      }
      animations[index].play();
      animations[index].complete = () => playNextAnimation(index + 1, animations);
    };

    animationConfig.forEach(({ elements, ice }) => {
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
          0
        );
      });
      ice.forEach((e) => {
        timeline.add(
          {
            targets: e.scale,
            x: 1.35,
            y: 1.35,
          },
          0
        );
      });
      animations.push(timeline);
    });

    playNextAnimation(0, animations);
  }
}

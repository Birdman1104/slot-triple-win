import { lego } from "@armathai/lego";
import anime from "animejs";
import { Container, Graphics, Rectangle, Sprite } from "pixi.js";
import { HEIGHT, OFFSET_X, WIDTH } from "../config";
import { getDockSpriteConfig } from "../configs/spritesConfig";
import { SlotMachineViewEvents } from "../events/MainEvents";
import { SlotMachineModelEvents } from "../events/ModelEvents";
import type { ReelModel } from "../models/ReelModel";
import { SlotMachineModel, SlotMachineState } from "../models/SlotMachineModel";
import { makeSprite } from "../utils/Utils";
import type { Element } from "./ElementView";
import { Reel } from "./ReelView";
import { SlotForeground } from "./SlotForeground";

export class SlotMachine extends Container {
  private dock!: Sprite;
  private reels: Reel[] = [];
  private reelsContainer: Container = new Container();
  private reelsMask: Graphics = new Graphics();
  private result: SpinResult = {
    reels: [],
    winningInfo: [],
    totalWin: -1,
  };
  private foreground: SlotForeground = new SlotForeground();

  constructor(private config: SlotMachineModel) {
    super();

    this.build();

    lego.event
      .on(SlotMachineModelEvents.StateUpdate, this.onStateUpdate, this)
      .on(SlotMachineModelEvents.ReelsUpdate, this.onReelsUpdate, this)
      .on(SlotMachineModelEvents.SpinResultUpdate, this.onSpinResultUpdate, this);
  }

  public getBounds(): Rectangle {
    return new Rectangle(0, -10, 2.85 * WIDTH, 2.9 * HEIGHT);
  }

  public getReelByUUID(uuid: string): Reel {
    return this.reels.find((reel) => reel.uuid === uuid) as Reel;
  }

  public startSpinning(): void {
    this.reels.forEach((reel, i) => {
      reel.startSpinning();
    });
  }

  public stopSpinning(): void {
    this.result.reels.forEach((reelResult, index) => {
      this.reels[index].setResultElements(reelResult);
    });
  }

  private build(): void {
    this.dock = makeSprite(getDockSpriteConfig());
    this.addChild(this.dock);
  }

  private buildForeground(): void {
    this.foreground.hideEverything();

    this.foreground.on("winBoardShowComplete", () => {
      lego.event.emit(SlotMachineViewEvents.WinningsShowComplete);
    });
    this.addChild(this.foreground);
  }

  private onStateUpdate(newState: SlotMachineState): void {
    console.warn(`SlotMachine: onStateUpdate: ${SlotMachineState[newState]}`);

    switch (newState) {
      case SlotMachineState.RequestSent:
        this.startSpinning();
        break;
      case SlotMachineState.ResponseReceived:
        this.stopSpinning();
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

  private showWinLines(): void {
    if (this.result.winningInfo.length === 0) {
      lego.event.emit(SlotMachineViewEvents.WinLinesShowComplete);
    }

    const linesData: { line: WinningLine; winningItemType: string }[] = this.result.winningInfo.map((r) => {
      return { line: r.line, winningItemType: r.id };
    });

    this.animateLines(linesData);
  }

  private showWinnings(): void {
    if (this.result.totalWin === 0) {
      lego.event.emit(SlotMachineViewEvents.WinningsShowComplete);
      return;
    }
    this.foreground.showWin(this.result.totalWin);
  }

  private onSpinResultUpdate(result: SpinResult): void {
    this.result = result;
  }

  private onReelsUpdate(newReels: ReelModel[]): void {
    if (this.reels.length !== 0) {
      this.reels.forEach((r) => r.destroy());
      this.reels = [];
    }

    this.reelsContainer = new Container();
    this.reels = newReels.map((model, i) => {
      const reel = new Reel(model, i);
      reel.on("reelStopped", (index) => {
        if (index === 2) {
          lego.event.emit(SlotMachineViewEvents.StopComplete);
        }
      });
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
    this.buildForeground();
  }

  private animateLines(lines: { line: WinningLine; winningItemType: string }[]): void {
    const getElements = (line: any) => line.map((pos: any, i: number) => this.reels[i].getElementByIndex(pos));
    const animationConfig: { elements: Element[]; winningItemType: string }[] = lines.map(
      ({ line, winningItemType }) => {
        return { elements: getElements(line), winningItemType };
      }
    );
    if (animationConfig.length === 0) return;
    const animations: any[] = [];
    const playNextAnimation = (index: number, animations: any[]): void => {
      clearDim();
      if (!animations[index]) {
        lego.event.emit(SlotMachineViewEvents.WinLinesShowComplete);
        return;
      }
      setDim();
      animations[index].play();
      animations[index].complete = () => playNextAnimation(index + 1, animations);
    };

    const clearDim = (): void => {
      this.reels.forEach((r) => {
        r.elements.forEach((e) => e.clearDim());
      });
    };

    const setDim = (): void => {
      this.reels.forEach((r) => {
        r.elements.forEach((e: Element) => e.dim());
      });
    };

    animationConfig.forEach(({ elements, winningItemType }, i) => {
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
            begin: () => e.startAnimation(winningItemType === e.type),
            complete: () => e.endAnimation(),
          },
          0
        );
      });
      animations.push(timeline);
    });

    playNextAnimation(0, animations);
  }
}

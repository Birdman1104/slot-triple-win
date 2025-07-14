import { lego } from "@armathai/lego";
import anime from "animejs";
import { Container, Graphics, Rectangle } from "pixi.js";
import { HEIGHT, OFFSET_X, WIDTH } from "../config";
import { ReelViewEvents, SlotMachineViewEvents } from "../events/MainEvents";
import { ReelModelEvents, SlotMachineModelEvents } from "../events/ModelEvents";
import { ElementModel } from "../models/ElementModel";
import { SlotMachineModel, SlotMachineState } from "../models/SlotMachineModel";
import type { Element } from "./ElementView";
import { Reel } from "./ReelView";
import { SlotForeground } from "./SlotForeground";

export class SlotMachine extends Container {
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

    lego.event.on(SlotMachineModelEvents.StateUpdate, this.onStateUpdate, this);
    lego.event.on(SlotMachineModelEvents.ReelsUpdate, this.onReelsUpdate, this);
    lego.event.on(SlotMachineModelEvents.SpinResultUpdate, this.onSpinResultUpdate, this);
    lego.event.on(ReelModelEvents.ElementsUpdate, this.onReelElementsUpdate, this);

    // const gr = new Graphics();
    // gr.beginFill(0xff0000, 0.5);
    // gr.drawRect(0, 0, this.width, this.height);
    // gr.endFill();
    // this.addChild(gr);
  }

  public getBounds(): Rectangle {
    return new Rectangle(0, -10, 3.12 * WIDTH, 2.9 * HEIGHT);
  }

  public getReelByUUID(uuid: string): Reel {
    return this.reels.find((reel) => reel.uuid === uuid) as Reel;
  }

  private build(): void {
    this.buildReels();

    this.buildForeground();
  }

  private buildForeground(): void {
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
      reel.position.set(this.reelsContainer.width + (i !== 0 ? OFFSET_X : 0), 0);
      this.reelsContainer.addChild(reel);
      return reel;
    });
    this.reelsContainer.scale.set(0.95);

    this.addChild(this.reelsContainer);

    this.reelsMask = new Graphics();
    this.reelsMask.beginFill(0xff0000, 0.00001);
    this.reelsMask.drawRect(this.reelsContainer.x, this.reelsContainer.y - 5, 3.12 * WIDTH, 2.9 * HEIGHT);
    this.reelsMask.endFill();
    this.addChild(this.reelsMask);

    this.reelsContainer.mask = this.reelsMask;
  }

  private onStateUpdate(newState: SlotMachineState): void {
    console.warn(`SlotMachine: onStateUpdate: ${SlotMachineState[newState]}`);

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
        this.reelsContainer.mask = this.reelsMask;
    }
  }

  private onReelElementsUpdate(newValue: ElementModel[], oldValue: ElementModel[], uuid: string): void {
    const reel = this.getReelByUUID(uuid);
    reel.setNewElements(newValue);
  }

  private onSpinResultUpdate(result: SpinResult): void {
    this.result = result;
  }

  private onReelsUpdate(newReels: any): void {
    if (this.reels.length !== 0) {
      this.reels.forEach((r) => r.destroy());
      this.reels = [];
    }

    this.reels = newReels.map((model: any, i: number) => {
      const reel = new Reel(model);
      reel.position.set(292 * i + (i !== 0 ? OFFSET_X : 0), 0);
      reel.on(ReelViewEvents.OldElementsDropComplete, this.onReelOldElementsDropComplete, this);
      reel.on(ReelViewEvents.NewElementsDropComplete, this.onReelNewElementsDropComplete, this);
      this.reelsContainer.addChild(reel);
      return reel;
    });
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

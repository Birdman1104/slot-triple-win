import { lego } from "@armathai/lego";
import { Container, Graphics, Rectangle } from "pixi.js";
import { HEIGHT, OFFSET_X, WIDTH } from "../config";
import { SlotMachineModelEvents } from "../events/ModelEvents";
import type { ReelModel } from "../models/ReelModel";
import { SlotMachineModel, SlotMachineState } from "../models/SlotMachineModel";
import { Reel } from "./ReelView";

export class SlotMachine extends Container {
  private reels: Reel[] = [];
  private reelsContainer: Container = new Container();
  private reelsMask: Graphics = new Graphics();
  private result: SpinResult = {
    reels: [],
    winningInfo: [],
    totalWin: -1,
  };

  constructor(private config: SlotMachineModel) {
    super();

    this.build();

    lego.event
      .on(SlotMachineModelEvents.StateUpdate, this.onStateUpdate, this)
      .on(SlotMachineModelEvents.ReelsUpdate, this.onReelsUpdate, this)
      .on(SlotMachineModelEvents.SpinResultUpdate, this.onSpinResultUpdate, this);
  }

  public getBounds(): Rectangle {
    return new Rectangle(0, -10, 3.12 * WIDTH, 2.9 * HEIGHT);
  }

  public getReelByUUID(uuid: string): Reel {
    return this.reels.find((reel) => reel.uuid === uuid) as Reel;
  }

  public startSpinning(): void {
    this.reels[0].startSpinning();
    // this.reels.forEach((reel) => reel.startSpinning());
  }

  public stopSpinning(): void {
    this.reels.forEach((reel) => reel.stopSpinning());
  }

  private build(): void {
    // this.buildReels();
  }

  private buildReels(): void {}

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
        break;
      case SlotMachineState.ShowWinnings:
        break;
      case SlotMachineState.Idle:
        break;
      default:
    }
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
      const reel = new Reel(model);
      reel.position.set(this.reelsContainer.width + (i !== 0 ? OFFSET_X : 0), 0);
      this.reelsContainer.addChild(reel);
      return reel;
    });
    this.reelsContainer.scale.set(0.95);

    this.addChild(this.reelsContainer);

    this.reelsMask = new Graphics();
    this.reelsMask.beginFill(0xff0000, 0.5);
    this.reelsMask.drawRect(this.reelsContainer.x, this.reelsContainer.y - 8, 3.16 * WIDTH, 2.85 * HEIGHT);
    this.reelsMask.endFill();
    this.addChild(this.reelsMask);

    // this.reelsContainer.mask = this.reelsMask;
  }
}

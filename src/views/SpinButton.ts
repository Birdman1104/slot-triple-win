import { lego } from "@armathai/lego";
import { Container, Sprite } from "pixi.js";
import { uiSpinBtnArrowL, uiSpinBtnBkgL, uiSpinBtnStopL } from "../configs/spritesConfig";
import { UIEvents } from "../events/MainEvents";
import { SlotMachineModelEvents } from "../events/ModelEvents";
import { SlotMachineState } from "../models/SlotMachineModel";
import { makeSprite } from "../utils/Utils";

export class SpinButton extends Container {
  private bkg!: Sprite;
  private spinArrow!: Sprite;
  private stopSign!: Sprite;

  private slotState = SlotMachineState.Unknown;

  constructor() {
    super();

    lego.event.on(SlotMachineModelEvents.StateUpdate, this.onSlotStateUpdate, this);

    this.build();
  }

  private build(): void {
    this.buildBkg();
    this.buildSpinArrow();
    this.buildStopSign();
  }

  private buildBkg(): void {
    this.bkg = makeSprite(uiSpinBtnBkgL());
    this.bkg.eventMode = "static";
    this.bkg.on("pointerdown", () => {
      this.emit("clicked");
      lego.event.emit(UIEvents.SpinButtonClick);
    });
    this.addChild(this.bkg);
  }

  private buildSpinArrow(): void {
    this.spinArrow = makeSprite(uiSpinBtnArrowL());
    this.addChild(this.spinArrow);
  }

  private buildStopSign(): void {
    this.stopSign = makeSprite(uiSpinBtnStopL());
    this.stopSign.visible = false;
    this.addChild(this.stopSign);
  }

  private onSlotStateUpdate(state: SlotMachineState): void {
    if (state === SlotMachineState.Idle || state === SlotMachineState.Error) {
      this.stopSign.visible = false;
      this.spinArrow.visible = true;
    } else {
      this.stopSign.visible = true;
      this.spinArrow.visible = false;
    }
  }
}

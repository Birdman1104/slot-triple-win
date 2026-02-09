import { lego } from "@armathai/lego";
import { Container, Sprite } from "pixi.js";
import { uiSpinBtnArrowL, uiSpinBtnBkgL, uiSpinBtnStopL, uiSpinDisabledBtnStopL } from "../../configs/spritesConfig";
import { UIEvents } from "../../events/MainEvents";
import { SlotMachineModelEvents } from "../../events/ModelEvents";
import { SlotMachineState } from "../../models/SlotMachineModel";
import { makeSprite } from "../../utils/Utils";

export class SpinButton extends Container {
  private bkg!: Sprite;
  private spinArrow!: Sprite;
  private stopSign!: Sprite;
  private stopDisabled!: Sprite;

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
    this.stopDisabled = makeSprite(uiSpinDisabledBtnStopL());
    this.stopSign.visible = false;
    this.stopDisabled.visible = false;
    this.addChild(this.stopSign, this.stopDisabled);
  }

  private onSlotStateUpdate(state: SlotMachineState): void {
    switch (state) {
      case SlotMachineState.Idle:
      case SlotMachineState.Error:
        this.stopSign.visible = false;
        this.stopDisabled.visible = false;
        this.spinArrow.visible = true;
        break;
      case SlotMachineState.DropNew:
      case SlotMachineState.ShowWinLines:
      case SlotMachineState.ShowWinnings:
        this.stopSign.visible = true;
        this.stopDisabled.visible = false;
        this.spinArrow.visible = false;
        break;
      case SlotMachineState.Pending:
      case SlotMachineState.DropOld:
      case SlotMachineState.WaitingForResult:
        this.stopSign.visible = false;
        this.stopDisabled.visible = true;
        this.spinArrow.visible = false;
        break;

      default:
        break;
    }
  }
}

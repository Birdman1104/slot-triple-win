import { lego } from "@armathai/lego";
import { Container, Text } from "pixi.js";
import { balanceTextConfig, balanceTitleConfig } from "../../configs/textConfig";
import { SlotMachineViewEvents } from "../../events/MainEvents";
import { PlayerModelEvents, SlotMachineModelEvents } from "../../events/ModelEvents";
import { SlotMachineState } from "../../models/SlotMachineModel";
import { makeText } from "../../utils/Utils";

export class Balance extends Container {
  private text!: Text;
  private balanceText!: Text;
  private balanceNumber = 0;

  private tempBalance = -1;
  private slotState = SlotMachineState.Unknown;

  constructor() {
    super();

    lego.event
      .on(PlayerModelEvents.BalanceUpdate, this.updateTempBalance, this)
      .on(SlotMachineViewEvents.WinningsShowComplete, this.updateBalance, this)
      .on(SlotMachineModelEvents.StateUpdate, this.onSlotStateUpdate, this);

    this.build();
  }

  public setBalance(value: number): void {
    this.balanceNumber = value;
    this.balanceText.text = "$" + this.balanceNumber.toString();
  }

  private build(): void {
    this.text = makeText(balanceTitleConfig());
    this.addChild(this.text);

    this.balanceText = makeText(balanceTextConfig());
    this.addChild(this.balanceText);
  }

  private updateTempBalance(newBalance: number): void {
    if (this.tempBalance === -1) {
      this.tempBalance = newBalance;
      this.balanceText.text = `$${this.tempBalance}`;
      return;
    }

    if (this.slotState === SlotMachineState.Idle) {
      this.tempBalance = newBalance;
      this.balanceText.text = `$${this.tempBalance}`;
    } else if (this.slotState === SlotMachineState.DropOld) {
      this.tempBalance = newBalance;
    }
  }

  private updateBalance(): void {
    this.balanceText.text = `$${this.tempBalance}`;
  }

  private onSlotStateUpdate(state: SlotMachineState): void {
    this.slotState = state;
  }
}

import { Container, Text } from "pixi.js";
import { balanceTextConfig, balanceTitleConfig } from "../configs/textConfig";
import { makeText } from "../utils/Utils";

export class Balance extends Container {
  private text!: Text;
  private balanceText!: Text;
  private balanceNumber = 0;

  constructor() {
    super();
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
}

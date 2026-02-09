import { lego } from "@armathai/lego";
import { Container, Sprite, Text } from "pixi.js";
import { betArrowBtnL } from "../../configs/spritesConfig";
import { betTextConfig, betTitleConfig } from "../../configs/textConfig";
import { UIEvents } from "../../events/MainEvents";
import { PlayerModelEvents } from "../../events/ModelEvents";
import { makeSprite, makeText } from "../../utils/Utils";

export class Bet extends Container {
  private text!: Text;
  private betText!: Text;
  private betNumber = 0;
  private upArrow!: Sprite;
  private downArrow!: Sprite;

  constructor(private isPortrait = false) {
    super();

    lego.event.on(PlayerModelEvents.BetUpdate, this.betUpdate, this);

    this.build();
  }

  public setBet(value: number): void {
    this.betNumber = value;
    this.betText.text = "$" + this.betNumber.toString();
  }

  private build(): void {
    this.text = makeText(betTitleConfig());
    this.addChild(this.text);

    this.betText = makeText(betTextConfig());
    this.addChild(this.betText);

    if (!this.isPortrait) {
      this.upArrow = makeSprite(betArrowBtnL("up"));
      this.upArrow.eventMode = "static";
      this.upArrow.on("pointerdown", () => {
        this.emit("clicked");
        lego.event.emit(UIEvents.PlusButtonClick);
      });
      this.addChild(this.upArrow);

      this.downArrow = makeSprite(betArrowBtnL("down"));
      this.downArrow.eventMode = "static";
      this.downArrow.on("pointerdown", () => {
        this.emit("clicked");
        lego.event.emit(UIEvents.MinusButtonClick);
      });
      this.addChild(this.downArrow);
    }
  }

  private betUpdate(bet: number): void {
    this.betText.text = `$${bet}`;
  }
}

import { Sprite, Text } from "pixi.js";
import { popupBkgConfig, popupCloseButtonConfig, redIconConfig } from "../configs/spritesConfig";
import { errorTextTextConfig, errorTitleTextConfig } from "../configs/textConfig";
import { makeSprite, makeText } from "../utils/Utils";
import { PopupBase } from "./PopupBase";

export class ErrorPopup extends PopupBase {
  private errorMessage!: Text;
  private errorTitle!: Text;
  private bkg!: Sprite;
  private redIcon!: Sprite;

  constructor(private isClosable = true) {
    super();

    this.build();
  }

  public setErrorText(error: ErrorResult): void {
    this.errorMessage.text = error.errorText;
    this.errorTitle.text = "Error " + error.errorCode;
  }

  public rebuild(): void {
    this.rebuildSprite(this.bkg, popupBkgConfig());
    this.rebuildSprite(this.redIcon, redIconConfig());
    this.rebuildSprite(this.closeButton, popupCloseButtonConfig());

    this.rebuildText(this.errorTitle, errorTitleTextConfig());
    this.rebuildText(this.errorMessage, errorTextTextConfig());
  }

  private build() {
    this.bkg = makeSprite(popupBkgConfig());
    this.addChild(this.bkg);

    if (this.isClosable) {
      this.closeButton = makeSprite(popupCloseButtonConfig());
      this.addChild(this.closeButton);

      this.closeButton.eventMode = "static";
      this.closeButton.on("pointerdown", () => {
        this.emit("closeErrorPopup");
      });
    }

    this.redIcon = makeSprite(redIconConfig());
    this.addChild(this.redIcon);

    this.errorTitle = makeText(errorTitleTextConfig());
    this.addChild(this.errorTitle);

    this.errorMessage = makeText(errorTextTextConfig());
    this.addChild(this.errorMessage);
  }
}

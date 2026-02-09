import { Sprite, Text } from "pixi.js";
import { popupBkgConfig, popupCloseButtonConfig, redIconConfig } from "../../configs/spritesConfig";
import { errorTextTextConfig, errorTitleTextConfig } from "../../configs/textConfig";
import { makeSprite, makeText } from "../../utils/Utils";
import { PopupBase } from "./PopupBase";

export class ErrorPopup extends PopupBase {
  private errorMessage!: Text;
  private errorTitle!: Text;
  private redIcon!: Sprite;

  constructor(private isClosable = true) {
    super();
    this.build();
  }

  public setErrorText(error: ErrorResult): void {
    this.errorMessage.text = error.errorText;
    this.errorTitle.text = `Error ${error.errorCode}`;
  }

  public rebuild(): void {
    this.rebuildSprite(this.bkg, popupBkgConfig());
    this.rebuildSprite(this.redIcon, redIconConfig());
    if (this.closeButton) {
      this.rebuildSprite(this.closeButton, popupCloseButtonConfig());
    }
    this.rebuildText(this.errorTitle, errorTitleTextConfig());
    this.rebuildText(this.errorMessage, errorTextTextConfig());
  }

  private build(): void {
    this.buildBkg();

    if (this.isClosable) {
      this.buildCloseButton("closeErrorPopup");
    }

    this.redIcon = makeSprite(redIconConfig());
    this.addChild(this.redIcon);

    this.errorTitle = makeText(errorTitleTextConfig());
    this.addChild(this.errorTitle);

    this.errorMessage = makeText(errorTextTextConfig());
    this.addChild(this.errorMessage);
  }
}

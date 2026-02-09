import { Text } from "pixi.js";
import { popupBkgConfig, popupCloseButtonConfig } from "../../configs/spritesConfig";
import { infoTextTextConfig, infoTitleTextConfig } from "../../configs/textConfig";
import { makeText } from "../../utils/Utils";
import { PopupBase } from "./PopupBase";

export class InfoPopup extends PopupBase {
  private infoMessage!: Text;
  private infoTitle!: Text;

  constructor() {
    super();
    this.build();
  }

  public rebuild(): void {
    this.rebuildSprite(this.bkg, popupBkgConfig());
    this.rebuildSprite(this.closeButton, popupCloseButtonConfig());
    this.rebuildText(this.infoTitle, infoTitleTextConfig());
    this.rebuildText(this.infoMessage, infoTextTextConfig());
  }

  private build(): void {
    this.buildBkg();
    this.buildCloseButton("closeInfoPopup");

    this.infoTitle = makeText(infoTitleTextConfig());
    this.addChild(this.infoTitle);

    this.infoMessage = makeText(infoTextTextConfig());
    this.addChild(this.infoMessage);
  }
}

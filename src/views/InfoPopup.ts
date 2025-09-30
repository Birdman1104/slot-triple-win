import { Sprite, Text } from "pixi.js";
import { popupBkgConfig, popupCloseButtonConfig } from "../configs/spritesConfig";
import { infoTextTextConfig, infoTitleTextConfig } from "../configs/textConfig";
import { makeSprite, makeText } from "../utils/Utils";
import { PopupBase } from "./PopupBase";

export class InfoPopup extends PopupBase {
  private infoMessage!: Text;
  private infoTitle!: Text;
  private bkg!: Sprite;

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

  private build() {
    this.bkg = makeSprite(popupBkgConfig());
    this.addChild(this.bkg);

    this.closeButton = makeSprite(popupCloseButtonConfig());
    this.addChild(this.closeButton);

    this.closeButton.eventMode = "static";
    this.closeButton.on("pointerdown", () => {
      this.emit("closeInfoPopup");
    });

    this.infoTitle = makeText(infoTitleTextConfig());
    this.addChild(this.infoTitle);

    this.infoMessage = makeText(infoTextTextConfig());
    this.addChild(this.infoMessage);
  }
}

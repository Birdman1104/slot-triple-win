import anime from "animejs";
import { Container, Sprite, Text, Texture } from "pixi.js";
import { errorPopupBkgConfig, popupCloseButtonConfig, redIconConfig } from "../configs/spritesConfig";
import { errorTextTextConfig, errorTitleTextConfig } from "../configs/textConfig";
import { makeSprite, makeText } from "../utils/Utils";

export class ErrorPopup extends Container {
  private errorMessage!: Text;
  private errorTitle!: Text;
  private bkg!: Sprite;
  private closeButton!: Sprite;
  //   private okButton!: Sprite;
  private redIcon!: Sprite;

  constructor() {
    super();

    this.build();
  }

  public show(): void {
    anime({
      targets: this,
      alpha: 1,
      duration: 300,
      easing: "easeInOutQuad",
    });
    anime({
      targets: this.scale,
      x: 1,
      y: 1,
      duration: 300,
      easing: "easeInOutQuad",
      complete: () => {
        this.closeButton.eventMode = "static";
      },
    });
  }

  public hide(force = false): void {
    this.closeButton.eventMode = "none";
    if (force) {
      this.alpha = 0;
      this.scale.set(0.1, 0.1);
      return;
    }
    anime({
      targets: this,
      alpha: 0,
      duration: 300,
      easing: "easeInOutQuad",
    });
    anime({
      targets: this.scale,
      x: 0.1,
      y: 0.1,
      duration: 300,
      easing: "easeInOutQuad",
    });
  }

  public rebuild(): void {
    this.rebuildSprite(this.bkg, errorPopupBkgConfig());
    this.rebuildSprite(this.redIcon, redIconConfig());
    this.rebuildSprite(this.closeButton, popupCloseButtonConfig());

    this.rebuildText(this.errorTitle, errorTitleTextConfig());
    this.rebuildText(this.errorMessage, errorTextTextConfig());
  }

  private build() {
    this.bkg = makeSprite(errorPopupBkgConfig());
    this.addChild(this.bkg);

    this.closeButton = makeSprite(popupCloseButtonConfig());
    this.addChild(this.closeButton);

    this.closeButton.interactive = true;
    this.closeButton.on("pointerdown", () => {
      this.emit("closeErrorPopup");
    });

    this.redIcon = makeSprite(redIconConfig());
    this.addChild(this.redIcon);

    this.errorTitle = makeText(errorTitleTextConfig());
    this.addChild(this.errorTitle);

    this.errorMessage = makeText(errorTextTextConfig());
    this.addChild(this.errorMessage);
  }

  private rebuildSprite(sprite: Sprite, config: SpriteConfig): void {
    const { frame, x = 0, y = 0, scaleX = 1, scaleY = 1 } = config;
    sprite.texture = Texture.from(frame);
    sprite.x = x;
    sprite.y = y;
    sprite.scale.set(scaleX, scaleY);
  }

  private rebuildText(object: Text, config: TextConfig): void {
    const { text, x = 0, y = 0, style } = config;
    object.text = text;
    object.x = x;
    object.y = y;
    Object.assign(object.style, style);
  }
}

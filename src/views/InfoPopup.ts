import anime from "animejs";
import { Container, Sprite, Text, Texture } from "pixi.js";
import { popupBkgConfig, popupCloseButtonConfig } from "../configs/spritesConfig";
import { infoTextTextConfig, infoTitleTextConfig } from "../configs/textConfig";
import { makeSprite, makeText } from "../utils/Utils";

export class InfoPopup extends Container {
  private infoMessage!: Text;
  private infoTitle!: Text;
  private bkg!: Sprite;
  private closeButton!: Sprite;

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

    this.closeButton.interactive = true;
    this.closeButton.on("pointerdown", () => {
      this.emit("closeErrorPopup");
    });

    this.infoTitle = makeText(infoTitleTextConfig());
    this.addChild(this.infoTitle);

    this.infoMessage = makeText(infoTextTextConfig());
    this.addChild(this.infoMessage);
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

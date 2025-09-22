import anime from "animejs";
import { Container, Sprite, Text, Texture } from "pixi.js";
import { popupBkgConfig, popupCloseButtonConfig } from "../configs/spritesConfig";
import { infoTextTextConfig, infoTitleTextConfig } from "../configs/textConfig";
import { hideToggle, makeSprite, makeText } from "../utils/Utils";

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
    const cb = () => (this.closeButton.eventMode = "static");
    hideToggle(this, cb);
  }

  public hide(force = false): void {
    this.closeButton.eventMode = "none";
    if (force) {
      this.alpha = 0;
      return;
    }
    hideToggle(this);
  }

  public rebuild(): void {
    this.rebuildSprite(this.bkg, popupBkgConfig());
    this.rebuildSprite(this.closeButton, popupCloseButtonConfig());

    this.rebuildText(this.infoTitle, infoTitleTextConfig());
    this.rebuildText(this.infoMessage, infoTextTextConfig());
  }

  private build() {
    this.bkg = makeSprite(popupBkgConfig());
    this.bkg.eventMode = "static";
    this.bkg.on("pointerdown", () => {
      this.emit("closeInfoPopup");
    });
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

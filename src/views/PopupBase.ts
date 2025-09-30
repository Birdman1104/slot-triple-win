import anime from "animejs";
import { Container, Sprite, Text, Texture } from "pixi.js";

export class PopupBase extends Container {
  protected closeButton!: Sprite;

  public show(): void {
    anime({
      targets: this,
      alpha: 1,
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
      return;
    }

    anime({
      targets: this,
      alpha: 0,
      duration: 300,
      easing: "easeInOutQuad",
    });
  }

  protected rebuildSprite(sprite: Sprite, config: SpriteConfig): void {
    const { frame, x = 0, y = 0, scaleX = 1, scaleY = 1 } = config;
    sprite.texture = Texture.from(frame);
    sprite.x = x;
    sprite.y = y;
    sprite.scale.set(scaleX, scaleY);
  }

  protected rebuildText(object: Text, config: TextConfig): void {
    const { text, x = 0, y = 0, style } = config;
    object.text = text;
    object.x = x;
    object.y = y;
    Object.assign(object.style, style);
  }
}

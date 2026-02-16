import { Container, Rectangle, Sprite } from "pixi.js";
import { dockSpriteConfig } from "../configs/spritesConfig";
import { CONFIGS } from "../GameConfig";
import { makeSprite } from "../utils/Utils";

export class DockView extends Container {
  private dock!: Sprite;

  constructor() {
    super();

    this.build();
  }

  public getBounds(): Rectangle {
    return new Rectangle(0, -10, 2.9 * CONFIGS.elementWidth, 2.9 * CONFIGS.elementHeight);
  }

  private build(): void {
    this.dock = makeSprite(dockSpriteConfig());
    this.addChild(this.dock);
  }
}

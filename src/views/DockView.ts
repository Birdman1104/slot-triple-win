import { Container, Rectangle, Sprite } from "pixi.js";
import { HEIGHT, WIDTH } from "../config";
import { dockSpriteConfig } from "../configs/spritesConfig";
import { makeSprite } from "../utils/Utils";

export class DockView extends Container {
  private dock!: Sprite;

  constructor() {
    super();

    this.build();
  }

  public getBounds(): Rectangle {
    return new Rectangle(0, -10, 2.9 * WIDTH, 2.9 * HEIGHT);
  }

  private build(): void {
    this.dock = makeSprite(dockSpriteConfig());
    this.addChild(this.dock);
  }
}

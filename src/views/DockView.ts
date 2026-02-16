import { Container, Rectangle } from "pixi.js";
import { dockSpriteConfig } from "../configs/spritesConfig";
import { CONFIGS } from "../GameConfig";
import { makeSprite } from "../utils/Utils";

// Dock scaling must behave just like the slot machine
export class DockView extends Container {
  private dock = makeSprite(dockSpriteConfig());

  constructor() {
    super();
    this.addChild(this.dock);
  }

  public getBounds(): Rectangle {
    const { x, y, width, height } = CONFIGS.slotMachineBounds;
    return new Rectangle(x, y, width, height);
  }
}

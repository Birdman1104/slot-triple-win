import anime from "animejs";
import { Container, Rectangle, Sprite, Texture } from "pixi.js";
import { HEIGHT, WIDTH } from "../config";
import { iceCubeConfig } from "../configs/spritesConfig";
import { makeSprite } from "../utils/Utils";

export class Ice extends Container {
  private isEven: boolean;
  private ice: Sprite | null = null;

  constructor(isEven: boolean) {
    super();

    this.isEven = isEven;
    this.ice = makeSprite(iceCubeConfig(isEven));
    this.addChild(this.ice);
  }

  public getBounds(): Rectangle {
    return new Rectangle(0, 0, WIDTH, HEIGHT);
  }

  public reset(): void {
    if (!this.ice) return;
    this.ice.scale.set(1);
    this.setBasicIceTexture();
    anime.remove(this);
    anime.remove(this.scale);
  }

  public setBasicIceTexture(): void {
    if (!this.ice) return;
    this.ice.texture = Texture.from(this.isEven ? "ice_1.png" : "ice_2.png");
  }

  public setWinIceTexture(): void {
    if (!this.ice) return;
    this.ice.texture = Texture.from(this.isEven ? "ice_win_1.png" : "ice_win_2.png");
  }
}

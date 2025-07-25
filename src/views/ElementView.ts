import { Container, Rectangle, Sprite, Texture } from "pixi.js";
import { HEIGHT, WIDTH } from "../config";
import { makeSprite } from "../utils/Utils";

export class Element extends Container {
  private element: Sprite | null = null;

  constructor(private _type: string) {
    super();

    this.updateDimensions();
    this.buildElement();
  }

  get type() {
    return this._type;
  }

  get bottom() {
    return this.y + this.height / 2;
  }

  get top() {
    return this.y - this.height / 2;
  }

  public updateSkin(type: string): void {
    this._type = type;
    if (this.element) {
      this.element.texture = Texture.from(`${this._type}.png`);
    }
  }

  public getBounds(): Rectangle {
    return new Rectangle(0, 0, WIDTH, HEIGHT);
  }

  public endAnimation(): void {
    if (!this.element) return;
    this.element.visible = true;
  }

  private buildElement(): void {
    this.element && this.element.destroy();
    this.element = makeSprite({ frame: `${this._type}.png`, atlas: "symbols.png" });
    this.element.anchor.set(0.5);
    this.addChild(this.element);
  }

  private updateDimensions(): void {
    // TODO Fix this config
    this.width = WIDTH;
    this.height = HEIGHT;
  }
}

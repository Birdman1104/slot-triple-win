import anime from "animejs";
import { Container, Rectangle, Sprite } from "pixi.js";
import { CONFIGS } from "../GameConfig";
import { ElementModel } from "../models/ElementModel";
import { makeSprite } from "../utils/Utils";

export class Element extends Container {
  private _uuid: string;
  private _type: string;
  private element: Sprite | null = null;

  constructor(config: ElementModel) {
    super();

    this._uuid = config.uuid;
    this._type = config.type;

    this.updateDimensions();
    this.buildElement();
  }

  get uuid() {
    return this._uuid;
  }

  get type() {
    return this._type;
  }

  get bottom() {
    return this.y + this.height / 2;
  }

  public getBounds(): Rectangle {
    return new Rectangle(0, 0, CONFIGS.elementWidth, CONFIGS.elementHeight);
  }

  public reset(): void {
    this.scale.set(1);
    anime.remove(this);
    anime.remove(this.scale);
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
    this.width = CONFIGS.elementWidth;
    this.height = CONFIGS.elementHeight;
  }
}

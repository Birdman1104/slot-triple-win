import { Container, Rectangle, Sprite } from "pixi.js";
import { HEIGHT, WIDTH } from "../config";
import { ElementModel } from "../models/ElementModel";
import { makeSprite } from "../utils/Utils";

export class Element extends Container {
  private _uuid: string;
  private _type: string;
  private ice: Sprite | null = null;
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
    return new Rectangle(0, 0, WIDTH, HEIGHT);
  }

  public endAnimation(): void {
    if (!this.element) return;
    this.element.visible = true;
  }

  private buildElement(): void {
    this.ice = makeSprite({ frame: "ice_1.png", atlas: "slot_machine.png" });
    this.ice.anchor.set(0.5);
    this.addChild(this.ice);
    console.warn(this.type);

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

import { Container, Rectangle } from "pixi.js";
import { HEIGHT, OFFSET_Y, WIDTH } from "../config";
import { ElementModel } from "../models/ElementModel";
import { ReelModel } from "../models/ReelModel";
import { Element } from "./ElementView";

const ELEMENT_FRAMES = [
  "apple.png",
  "blueberry.png",
  "cherry.png",
  "lemon.png",
  "strawberry.png",
  "watermelon.png",
  "vodka.png",
  "gin.png",
  "whiskey.png",
];

export class Reel extends Container {
  private _uuid: String;
  private _elements: Element[] = [];
  private rHeight: number = 2.9 * HEIGHT;

  constructor(model: ReelModel) {
    super();
    const { elements, uuid } = model;
    this._uuid = uuid;

    this.build(elements);
  }

  get uuid() {
    return this._uuid;
  }

  get elements() {
    return this._elements;
  }

  public getBounds(): Rectangle {
    return new Rectangle(0, 0, WIDTH, 2.9 * HEIGHT);
  }

  public getElementByUUID(uuid: string): Element | undefined {
    return this._elements.find((el) => el.uuid === uuid);
  }

  public getElementByIndex(index: number): Element {
    return this.elements[index];
  }

  public getElementIndex(element: Element): number {
    return this.elements.indexOf(element);
  }

  private build(elements: ElementModel[]): void {
    this.buildElements(elements);
  }

  private buildElements(elements: ElementModel[]): void {
    this._elements = elements.map((config) => {
      console.warn(config);

      const element = new Element(config);
      element.name = config.type;
      element.position.set(element.width / 2, -element.height / 2);
      this.addChild(element);
      return element;
    });

    this.updateElementsPositions();
  }

  private updateElementsPositions(): void {
    for (let i = 0; i < this._elements.length; i += 1) {
      const element = this._elements[i];

      if (i === 0) {
        element.y = element.height / 2;
        element.x = element.width / 2;
      } else {
        const previousEl = this._elements[i - 1];
        element.y = previousEl.bottom + element.height / 2 + OFFSET_Y;
        element.x = element.width / 2;
      }
    }
  }
}

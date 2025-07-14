import anime from "animejs";
import { Container, Rectangle } from "pixi.js";
import { OFFSET_Y, WIDTH } from "../config";
import { ReelViewEvents } from "../events/MainEvents";
import { ElementModel } from "../models/ElementModel";
import { ReelModel } from "../models/ReelModel";
import { Element } from "./ElementView";

export class Reel extends Container {
  private _uuid: String;
  private _elements: Element[] = [];
  private rHeight = 0;

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
    return new Rectangle(0, 0, WIDTH, this.calculateHeight());
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

  public dropOldElements(delay: number): void {
    let count = 0;
    this.elements.forEach((el, i) => {
      anime({
        targets: el,
        y: this.rHeight + el.height / 2,
        duration: 200 * (this.elements.length - i + 1),
        delay,
        easing: "easeInBack",
        complete: () => {
          el.destroy();
          count++;

          if (count === this.elements.length) {
            this.emit(ReelViewEvents.OldElementsDropComplete, this.uuid);
          }
        },
      });
    });
  }

  public dropNewElements(delay: number): void {
    let count = 0;

    this.elements.forEach((el, i) => {
      const { x: targetX, y: targetY } = this.getElementTargetPosition(el);
      anime({
        targets: el,
        x: targetX,
        y: targetY,
        duration: 200 * (this.elements.length - i + 1),
        delay,
        easing: "easeInBack",
        complete: () => {
          //     el.destroy();
          count++;
          if (count === this.elements.length) {
            this.emit(ReelViewEvents.NewElementsDropComplete, this.uuid);
          }
        },
        // update: (anim) => {
        //     // blur element
        // },
      });
    });
  }

  public setNewElements(elements: ElementModel[]): void {
    this._elements = [];
    this.buildElements(elements);
  }

  private build(elements: ElementModel[]): void {
    this.buildElements(elements);
    this.rHeight = this.calculateHeight();
    this.updateElementsPositions();

    // const gr = new Graphics();
    // gr.beginFill(0xff0000, 0.5);
    // gr.drawRect(0, 0, this.width, this.height);
    // gr.endFill();
    // this.addChild(gr);
  }

  private buildElements(elements: ElementModel[]): void {
    this._elements = elements.map((config) => {
      const element = new Element(config);
      element.name = config.type;
      element.position.set(element.width / 2, -element.height / 2);
      this.addChild(element);
      return element;
    });
  }

  private calculateHeight(): number {
    return this._elements.reduce((acc, cur) => acc + cur.height + OFFSET_Y, 0) - OFFSET_Y;
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

  private getElementTargetPosition(element: Element): { x: number; y: number } {
    const index = this.getElementIndex(element);
    return {
      x: element.width / 2,
      y: element.height / 2 + (element.height + OFFSET_Y) * index,
    };
  }
}

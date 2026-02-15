import anime from "animejs";
import { Container, Rectangle } from "pixi.js";
import { HEIGHT, OFFSET_Y, WIDTH } from "../config";
import { ReelViewEvents } from "../events/MainEvents";
import { CONFIGS } from "../GameConfig";
import { ElementModel } from "../models/ElementModel";
import { ReelModel } from "../models/ReelModel";
import { Element } from "./ElementView";
import { Ice } from "./IceView";

export class Reel extends Container {
  private _uuid: String;
  private _ice: Ice[] = [];
  private _elements: Element[] = [];
  private _oldElements: Element[] = [];
  private rHeight = 0;

  constructor(
    model: ReelModel,
    private index: number,
  ) {
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

  get ice(): Ice[] {
    return this._ice;
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

  public getIceByIndex(index: number): Ice {
    return this._ice[index];
  }

  public getElementIndex(element: Element): number {
    return this.elements.indexOf(element);
  }

  public forceStop(): void {
    this._oldElements.forEach((el) => el && (el.alpha = 0));
    this.elements.forEach((el) => anime.remove(el));

    this.updateElementsPositions();
    this.emit(ReelViewEvents.NewElementsDropComplete, this.uuid);
  }

  public dropOldElements(delay: number): void {
    const { dropOldElementsDuration, dropOldElementsEasing } = CONFIGS;
    let count = 0;
    this._oldElements = this.elements.map((el) => el);
    this._elements = [];
    this._oldElements.forEach((el, i) => {
      anime({
        targets: el,
        y: this.rHeight + el.height / 2,
        duration: dropOldElementsDuration * (this._oldElements.length - i + 1),
        delay,
        easing: dropOldElementsEasing,
        complete: () => {
          el.destroy();
          if (++count === this._oldElements.length) {
            this.emit(ReelViewEvents.OldElementsDropComplete, this.uuid);
          }
        },
      });
    });
  }

  public dropNewElements(delay: number): void {
    let count = 0;
    const { dropNewElementsDuration, dropNewElementsEasing } = CONFIGS;
    this.elements.forEach((el, i) => {
      const { x: targetX, y: targetY } = this.getElementTargetPosition(el);
      anime({
        targets: el,
        x: targetX,
        y: targetY,
        duration: dropNewElementsDuration * (this.elements.length - i + 1),
        delay,
        easing: dropNewElementsEasing,
        complete: () => {
          if (++count === this.elements.length) {
            this.emit(ReelViewEvents.NewElementsDropComplete, this.uuid);
          }
        },
      });
    });
  }

  public setNewElements(elements: ElementModel[]): void {
    this._elements = [];
    this.buildElements(elements);
  }

  private build(elements: ElementModel[]): void {
    this.buildIce();
    this.buildElements(elements);
    this.rHeight = this.calculateHeight();
    this.updateElementsPositions();
  }

  private buildIce(): void {
    for (let i = 0; i < 3; i++) {
      const ice = new Ice(this.index + (i % 2) === 0);
      ice.position.set(WIDTH / 2 - 10, HEIGHT * i + HEIGHT / 2);
      this.addChild(ice);
      this._ice.push(ice);
    }
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

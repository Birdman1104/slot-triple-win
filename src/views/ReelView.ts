import anime from "animejs";
import { Container, Rectangle } from "pixi.js";
import { HEIGHT, OFFSET_Y, WIDTH } from "../config";
import { ElementModel } from "../models/ElementModel";
import { ReelModel } from "../models/ReelModel";
import { last, makeSprite, sample } from "../utils/Utils";
import { Element } from "./ElementView";

const ELEMENT_FRAMES = ["apple", "blueberry", "cherry", "lemon", "strawberry", "watermelon", "vodka", "gin", "whiskey"];

export class Reel extends Container {
  private _uuid: String;
  private _elements: Element[] = [];
  private _dummyElements: Element[] = [];
  private _spinningElements: Element[] = [];
  private _spinAnimations: anime.AnimeInstance[] = [];
  private _isSpinning: boolean = false;

  private _resultIsReady: boolean = false;

  constructor(
    model: ReelModel,
    private _index: number
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

  public getBounds(): Rectangle {
    return new Rectangle(0, 0, WIDTH, 2.9 * HEIGHT);
  }

  public setResultElements(resultElements: string[]): void {
    this._resultIsReady = true;
    const newElements = resultElements.map((config) => new Element(config));
    this.addChild(...newElements);
    newElements.forEach((el) => {
      el.y = last(this._spinningElements).top - el.height / 2 - OFFSET_Y;
      el.x = el.width / 2;
      this._spinningElements.push(el);

      this.animateElement(el, el.y + HEIGHT + OFFSET_Y);
    });
  }

  public getElementByIndex(index: number): Element {
    return this.elements[index];
  }

  public getElementIndex(element: Element): number {
    return this.elements.indexOf(element);
  }

  public startSpinning(): void {
    if (this._isSpinning) return;

    this._isSpinning = true;

    this.createSpinningElements();
    this.animateSpinning();
  }

  public stopSpinning(): void {
    if (!this._isSpinning) return;
    this._isSpinning = false;
  }

  public destroy(): void {
    this.stopSpinning();
    super.destroy();
  }

  private createSpinningElements(): void {
    for (let i = 0; i < 3; i++) {
      const element = new Element(sample(ELEMENT_FRAMES));
      if (this._index === 0) {
        console.warn(i, this._spinningElements);
      }
      if (i === 0) {
        element.y = -element.height / 2;
      } else {
        const previousEl = this._dummyElements[i - 1] ?? last(this._elements);
        element.y = previousEl.top - element.height / 2 - OFFSET_Y;
      }
      element.x = element.width / 2;
      this.addChild(element);
      this._dummyElements.push(element);
    }
  }

  private animateSpinning(): void {
    if (!this._isSpinning) return;

    const totalHeight = HEIGHT + OFFSET_Y;
    this._spinningElements = [...this.elements.reverse(), ...this._dummyElements];

    this._spinningElements.forEach((el) => {
      this.animateElement(el, el.y + totalHeight);
    });
  }

  private animateElement(el: Element, targetY: number): anime.AnimeInstance {
    const totalHeight = HEIGHT + OFFSET_Y;

    this._spinAnimations.push(
      anime({
        targets: el,
        y: targetY,
        duration: 700,
        easing: "linear",

        complete: () => {
          if (this._isSpinning) {
            const index = this._spinningElements.indexOf(el);
            if (el.y > this.height && index === 0 && !this._resultIsReady) {
              this._spinningElements.splice(index, 1);
              el.y = last(this._spinningElements).top - el.height / 2 - OFFSET_Y;
              this._spinningElements.push(el);
              el.updateSkin(sample(ELEMENT_FRAMES));
            }

            if (this._resultIsReady && el.y > this.height) {
              this._spinningElements.splice(this._spinningElements.indexOf(el), 1);
              el.destroy();
            } else {
              this.animateElement(el, el.y + totalHeight);
            }

            if (this._resultIsReady && this._spinningElements.length === 3) {
              this._spinningElements.forEach((el) => anime.remove(el));
              this._elements = [...this._spinningElements.reverse()];
              this.emit("reelStopped", this._index);
              this._isSpinning = false;
              this._dummyElements.forEach((el) => el.destroy());
              this._dummyElements = [];
              this._spinningElements = [];
            }
          }
        },
      })
    );
  }

  private build(elements: ElementModel[]): void {
    this.buildIce();
    this.buildElements(elements);
  }

  private buildIce(): void {
    for (let i = 0; i < 3; i++) {
      const ice = makeSprite({ frame: "ice_1.png", atlas: "slot_machine.png" });
      ice.anchor.set(0.5);
      ice.position.set(WIDTH / 2 - 10, HEIGHT * i + HEIGHT / 2);
      this.addChild(ice);
    }
  }

  private buildElements(elements: ElementModel[]): void {
    this._elements = elements.map((config) => {
      const element = new Element(config.type);
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

import anime from "animejs";
import { Container, Rectangle } from "pixi.js";
import { HEIGHT, OFFSET_Y, WIDTH } from "../config";
import { iceCubeConfig } from "../configs/spritesConfig";
import { ElementModel } from "../models/ElementModel";
import { ReelModel } from "../models/ReelModel";
import { last, makeSprite, sample } from "../utils/Utils";
import { Element } from "./ElementView";

const ELEMENT_FRAMES = ["apple", "blueberry", "cherry", "lemon", "strawberry", "watermelon", "vodka", "gin", "whiskey"];

const TOTAL_HEIGHT = HEIGHT + OFFSET_Y;

export class Reel extends Container {
  private _uuid: String;
  private _elements: Element[] = [];
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
    const elements = [...this._elements];
    elements.sort((a, b) => b.y - a.y);

    const newElements = resultElements.map((config) => {
      const el = new Element(config);

      el.name = config;
      el.position.set(el.width / 2, -el.height / 2);
      this._elements.push(el);
      this.addChild(el);
      return el;
    });

    newElements.forEach((el) => {
      const elements = [...this._elements];
      elements.sort((a, b) => b.y - a.y);
      el.y = last(elements).top - el.height / 2 - OFFSET_Y;
      this.animateElement(el, el.y + TOTAL_HEIGHT);
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
      const type = sample(ELEMENT_FRAMES);
      const element = new Element(type);
      element.name = type;
      const elements = [...this._elements];

      elements.sort((a, b) => b.y - a.y);

      element.y = last(elements).top - element.height / 2 - OFFSET_Y;
      element.x = element.width / 2;
      this.addChild(element);
      this._elements.push(element);
    }
  }

  private animateSpinning(): void {
    if (!this._isSpinning) return;

    this.elements.forEach((el) => {
      this.animateElement(el, el.y + TOTAL_HEIGHT);
    });
  }

  private animateElement(el: Element, targetY: number): anime.AnimeInstance {
    this._spinAnimations.push(
      anime({
        targets: el,
        y: targetY,
        duration: 300,
        easing: "linear",

        complete: () => {
          if (this._isSpinning) {
            const index = this._elements.indexOf(el);
            if (el.y > this.height && index === 0 && !this._resultIsReady) {
              this._elements.splice(index, 1);
              el.y = last(this._elements).top - el.height / 2 - OFFSET_Y;
              this._elements.push(el);

              const newType = sample(ELEMENT_FRAMES);
              el.name = newType;
              el.updateSkin(newType);
            }

            if (this._resultIsReady && el.y > this.height) {
              this._elements.splice(this._elements.indexOf(el), 1);
              el.destroy();
            } else {
              this.animateElement(el, el.y + TOTAL_HEIGHT);
            }

            if (this._resultIsReady && this._elements.length === 3) {
              this._elements.forEach((el) => anime.remove(el));

              this.emit("reelStopped", this._index);
              this._resultIsReady = false;
              this._isSpinning = false;
              this.updateElementsPositions();
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
      const ice = makeSprite(iceCubeConfig(WIDTH / 2 - 10, HEIGHT * i + HEIGHT / 2));
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
    const arr = [...this._elements];
    const elements = arr.reverse();
    for (let i = 0; i < elements.length; i += 1) {
      const element = elements[i];

      if (i === 0) {
        element.y = element.height / 2;
        element.x = element.width / 2;
      } else {
        const previousEl = elements[i - 1];
        element.y = previousEl.bottom + element.height / 2 + OFFSET_Y;
        element.x = element.width / 2;
      }
    }
  }
}

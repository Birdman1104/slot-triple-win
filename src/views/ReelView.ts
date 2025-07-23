import anime from "animejs";
import { Container, Rectangle } from "pixi.js";
import { HEIGHT, OFFSET_Y, WIDTH } from "../config";
import { ElementModel } from "../models/ElementModel";
import { ReelModel } from "../models/ReelModel";
import { makeSprite } from "../utils/Utils";
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
  private _spinningElements: Element[] = [];
  private _spinAnimations: anime.AnimeInstance[] = [];
  private _isSpinning: boolean = false;

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

  // public getElementByUUID(uuid: string): Element | undefined {
  //   return this._elements.find((el) => el.uuid === uuid);
  // }

  public getElementByIndex(index: number): Element {
    return this.elements[index];
  }

  public getElementIndex(element: Element): number {
    return this.elements.indexOf(element);
  }

  public startSpinning(): void {
    if (this._isSpinning) return;

    this._isSpinning = true;

    // Hide original elements during spinning
    // this._elements.forEach((el) => (el.alpha = 0));

    this.createSpinningElements();
    this.animateSpinning();
  }

  public stopSpinning(): void {
    console.warn("start spin");

    if (!this._isSpinning) return;

    this._isSpinning = false;

    if (this._spinAnimations) {
      // this._spinAnimations.pause();
      // this._spinAnimations = null;
    }

    this.cleanupSpinningElements();

    // Show original elements again
    this._elements.forEach((el) => (el.alpha = 1));
  }

  public destroy(): void {
    this.stopSpinning();
    super.destroy();
  }

  private createSpinningElements(): void {
    // Create extra elements for the spinning effect
    // const symbolTypes = ELEMENT_FRAMES.map((frame) => frame.replace(".png", ""));

    for (let i = 0; i < 3; i++) {
      // const randomSymbol = symbolTypes[Math.floor(Math.random() * symbolTypes.length)];
      const element = new Element("apple");

      if (i === 0) {
        element.y = -element.height / 2; // Position first element at the top
      } else {
        const previousEl = this._spinningElements[i - 1];
        element.y = previousEl.top - element.height / 2 - OFFSET_Y;
      }
      element.x = element.width / 2;
      this.addChild(element);
      this._spinningElements.push(element);
    }
  }

  private animateSpinning(): void {
    if (!this._isSpinning) return;

    const totalHeight = HEIGHT + OFFSET_Y; // Height per element
    const spinningElements = [...this.elements, ...this._spinningElements];

    spinningElements.forEach((el) => {
      const target = el.y + totalHeight;
      this._spinAnimations.push(
        anime({
          targets: el,
          y: target,
          duration: 400,
          easing: "linear",
          update: () => {
            // if (i === 0) {
            //   console.log(el.y, target);
            // }
          },
          complete: () => {
            if (this._isSpinning) {
              const index = spinningElements.indexOf(el);
              console.log(spinningElements.map((e) => e.type));
              spinningElements.splice(index, 1);
              spinningElements.push(el);
              console.log(spinningElements.map((e) => e.type));
              // el.y = spinningElements[0].top - el.height / 2 - OFFSET_Y;
              // const el = spinningElements.shift();
              // console.warn(el);
              // if (!el) return;
              // spinningElements.push(el);
              // this.animateSpinning(); // Continue the loop
            }
          },
        })
      );
    });
  }

  private cleanupSpinningElements(): void {
    this._spinningElements.forEach((el) => {
      this.removeChild(el);
      el.destroy();
    });
    this._spinningElements = [];
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

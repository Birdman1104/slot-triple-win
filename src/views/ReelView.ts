import anime from "animejs";
import { Container, Rectangle } from "pixi.js";
import { HEIGHT, OFFSET_Y, WIDTH } from "../config";
import { ElementModel } from "../models/ElementModel";
import { ReelModel } from "../models/ReelModel";
import { makeSprite, sample } from "../utils/Utils";
import { Element } from "./ElementView";

const ELEMENT_FRAMES = ["apple", "blueberry", "cherry", "lemon", "strawberry", "watermelon", "vodka", "gin", "whiskey"];

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
      const element = new Element(sample(ELEMENT_FRAMES));

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
    const spinningElements = [...this.elements.reverse(), ...this._spinningElements];

    const animateElement = (el: Element, targetY: number): anime.AnimeInstance => {
      this._spinAnimations.push(
        anime({
          targets: el,
          y: targetY,
          duration: 1000,
          easing: "linear",

          complete: () => {
            if (this._isSpinning) {
              const index = spinningElements.indexOf(el);
              if (el.y > this.height && index === 0) {
                spinningElements.splice(index, 1);
                el.y = spinningElements[spinningElements.length - 1].top - el.height / 2 - OFFSET_Y;
                spinningElements.push(el);
                el.updateSkin(sample(ELEMENT_FRAMES));
              }
              animateElement(el, el.y + totalHeight);
            }
          },
        })
      );
    };

    spinningElements.forEach((el) => {
      const target = el.y + totalHeight;
      animateElement(el, target);
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

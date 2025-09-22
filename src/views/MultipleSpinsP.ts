import { Container, Rectangle, Sprite, Text } from "pixi.js";
import {
  uiMultipleNumbersBkgPortrait,
  uiMultipleSpinsBkgPortrait,
  uiMultipleSpinsIconPortrait,
} from "../configs/spritesConfig";
import { multipleSpinsTextConfigPortrait } from "../configs/textConfig";
import { hideToggle, makeSprite, makeText, showToggle } from "../utils/Utils";
import { MultipleSpinButton, values } from "./MultipleSpinsL";

class MultipleSpinsToggle extends Container {
  private bkg!: Sprite;

  private _isHidden = false;

  constructor() {
    super();
    this.build();
  }

  public get isHidden(): boolean {
    return this._isHidden;
  }

  public hide(): void {
    const cb = () => {
      this.emit("toggleClosed");
      this._isHidden = true;
    };
    hideToggle(this, cb);
  }

  public show(): void {
    const cb = () => {
      this.emit("toggleOpened");
      this._isHidden = false;
    };
    showToggle(this, cb);
  }

  private build(): void {
    this.bkg = makeSprite(uiMultipleNumbersBkgPortrait());
    this.addChild(this.bkg);

    values.forEach((v, i) => {
      const button = new MultipleSpinButton(false, v, 100, 75);
      button.y = -this.bkg.height * 1.2 + 30 + button.height * i;
      button.x = -7;
      button.on("numberClicked", (value: number) => {
        this.emit("clickedNumber", value);
        this.hide();
      });
      this.addChild(button);
      return button;
    });
  }
}

export class MultipleSpinsPortrait extends Container {
  private bkg!: Sprite;
  private icon!: Sprite;
  private number!: Text;
  private toggle!: MultipleSpinsToggle;

  constructor() {
    super();
    this.build();
  }

  public getBounds(): Rectangle {
    return this.bkg.getBounds();
  }

  public hideToggle(): void {
    this.toggle.hide();
  }

  private updateNumberWidth(): void {
    this.number.scale.set(1);
    this.number.scale.set(Math.min(1, (this.bkg.width * 0.6) / this.number.width));
  }

  private build(): void {
    this.bkg = makeSprite(uiMultipleSpinsBkgPortrait());
    this.bkg.eventMode = "static";
    this.bkg.on("pointerdown", () => {
      this.emit("clicked");
      this.toggle.isHidden ? this.toggle.show() : this.toggle.hide();
      this.bkg.eventMode = "none";
    });
    this.addChild(this.bkg);

    this.icon = makeSprite(uiMultipleSpinsIconPortrait());
    this.addChild(this.icon);

    this.number = makeText(multipleSpinsTextConfigPortrait());
    this.addChild(this.number);

    this.toggle = new MultipleSpinsToggle();
    this.toggle.visible = false;
    this.toggle.hide();
    this.toggle.on("clickedNumber", (value) => {
      this.icon.visible = false;
      this.number.text = value.toString();
      this.updateNumberWidth();
    });

    this.toggle.on("toggleClosed", () => {
      if (!this.toggle.visible) {
        this.toggle.visible = true;
      }
      this.bkg.eventMode = "static";
    });

    this.toggle.on("toggleOpened", () => {
      this.bkg.eventMode = "static";
    });
    this.addChild(this.toggle);
  }
}

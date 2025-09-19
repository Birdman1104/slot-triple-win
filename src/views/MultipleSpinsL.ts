import { lego } from "@armathai/lego";
import anime from "animejs";
import { Container, Graphics, Rectangle, Sprite, Text } from "pixi.js";
import { uiMultipleNumbersBkgL, uiMultipleSpinsBkgL, uiMultipleSpinsIconL } from "../configs/spritesConfig";
import { multipleSpinsButtonTextConfig, multipleSpinsTextConfig } from "../configs/textConfig";
import { UIEvents } from "../events/MainEvents";
import { drawBounds, makeSprite, makeText } from "../utils/Utils";

const values: number[] = [200, 100, 50, 20, 10];

class MultipleSpinButton extends Container {
  private valueText!: Text;
  private hitAreaGr!: Graphics;

  constructor(
    private value: number,
    private w: number,
    private h: number
  ) {
    super();

    this.build();
    this.hitAreaGr = drawBounds(this);
    this.hitAreaGr.eventMode = "static";
    this.hitAreaGr.on("pointerdown", () => {
      lego.event.emit(UIEvents.MultipleSpinNumberClick, this.value);
      this.emit("numberClicked", this.value);
    });
    this.hitAreaGr.alpha = 0;
  }

  public getBounds(): Rectangle {
    return new Rectangle(0, 0, this.w, this.h);
  }
  private build(): void {
    this.valueText = makeText(multipleSpinsButtonTextConfig(this.value.toString()));
    this.addChild(this.valueText);
  }
}

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
    anime({
      targets: this.scale,
      x: 0,
      y: 0,
      duration: 300,
      easing: "easeInOutSine",
      complete: () => {
        this.emit("toggleClosed");
        this._isHidden = true;
      },
    });
  }

  public show(): void {
    anime({
      targets: this.scale,
      x: 1,
      y: 1,
      duration: 300,
      easing: "easeInOutSine",
      complete: () => {
        this.emit("toggleOpened");
        this._isHidden = false;
      },
    });
  }

  private build(): void {
    this.bkg = makeSprite(uiMultipleNumbersBkgL());
    this.addChild(this.bkg);

    values.forEach((v, i) => {
      const button = new MultipleSpinButton(v, 244, 127);
      button.y = -this.bkg.height * 1.2 + 50 + button.height * i;
      button.x = -this.bkg.width / 2;
      button.on("numberClicked", (value: number) => {
        this.emit("clickedNumber", value);
        this.hide();
      });
      this.addChild(button);
      return button;
    });
  }
}

export class MultipleSpins extends Container {
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
    this.bkg = makeSprite(uiMultipleSpinsBkgL());
    this.bkg.eventMode = "static";
    this.bkg.on("pointerdown", () => {
      this.emit("clicked");
      this.toggle.isHidden ? this.toggle.show() : this.toggle.hide();
      this.bkg.eventMode = "none";
    });
    this.addChild(this.bkg);

    this.icon = makeSprite(uiMultipleSpinsIconL());
    this.addChild(this.icon);

    this.number = makeText(multipleSpinsTextConfig());
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

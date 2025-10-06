import { lego } from "@armathai/lego";
import { Container, Graphics, Rectangle, Sprite, Text } from "pixi.js";
import { autoSpinsButtonTextConfig } from "../configs/textConfig";
import { UIEvents } from "../events/MainEvents";
import { SlotMachineModelEvents } from "../events/ModelEvents";
import { SlotMachineState } from "../models/SlotMachineModel";
import { drawBounds, hideToggle, makeText, showToggle } from "../utils/Utils";

export const values: number[] = [200, 100, 50, 20, 10];

export class AutoSpinButton extends Container {
  private valueText!: Text;
  private hitAreaGr!: Graphics;

  constructor(
    private isLandscape: boolean,
    private value: number,
    private w: number,
    private h: number
  ) {
    super();

    this.build();
    this.hitAreaGr = drawBounds(this);
    this.hitAreaGr.eventMode = "static";
    this.hitAreaGr.on("pointerdown", () => {
      lego.event.emit(UIEvents.AutoSpinNumberClick, this.value);
      this.emit("numberClicked", this.value);
    });
    this.hitAreaGr.alpha = 0;
  }

  public getBounds(): Rectangle {
    return new Rectangle(0, 0, this.w, this.h);
  }
  private build(): void {
    this.valueText = makeText(
      autoSpinsButtonTextConfig(
        this.isLandscape ? 122 : 50,
        this.isLandscape ? 62 : 33,
        this.isLandscape ? 100 : 60,
        this.value.toString()
      )
    );
    this.addChild(this.valueText);
  }
}

export class AutoSpinsToggleBase extends Container {
  protected bkg!: Sprite;
  protected _isHidden = false;

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
    showToggle(this, 1, cb);
  }

  protected onNumberClicked(value: number): void {
    this.emit("clickedNumber", value);
    this.hide();
  }
}

export class AutoSpinsBase extends Container {
  protected bkg!: Sprite;
  protected icon!: Sprite;
  protected number!: Text;
  protected toggle!: AutoSpinsToggleBase;

  private slotMachineState = SlotMachineState.Unknown;

  constructor() {
    super();
    lego.event
      .on(SlotMachineModelEvents.AutoSpinCountUpdate, this.onAutoSpinCountUpdate, this)
      .on(SlotMachineModelEvents.StateUpdate, this.onSlotMachineStateUpdate, this);
  }

  public getBounds(): Rectangle {
    return this.bkg.getBounds();
  }

  public hideToggle(): void {
    this.toggle.hide();
  }

  protected buildToggle(obj: any): void {
    this.toggle = new obj();
    this.toggle.visible = false;
    this.toggle.hide();

    this.toggle.on("toggleClosed", () => this.onToggleCloseEvent());
    this.toggle.on("toggleOpened", () => this.onToggleOpenEvent());
    this.addChild(this.toggle);
  }

  protected onToggleCloseEvent(): void {
    if (!this.toggle.visible) {
      this.toggle.visible = true;
    }
    this.bkg.eventMode = "static";
  }
  protected onToggleOpenEvent(): void {
    this.bkg.eventMode = "static";
  }

  protected onBkgClick(): void {
    if (this.slotMachineState !== SlotMachineState.Idle) return;
    this.emit("clicked");
    this.toggle.isHidden ? this.toggle.show() : this.toggle.hide();
    this.bkg.eventMode = "none";
  }

  private onAutoSpinCountUpdate(value: number): void {
    if (value === 0) {
      this.number.text = "";
      this.icon.visible = true;
    } else {
      this.icon.visible = false;
      this.number.text = value.toString();
    }
    this.updateNumberWidth();
  }

  private updateNumberWidth(): void {
    this.number.scale.set(1);
    this.number.scale.set(Math.min(1, (this.bkg.width * 0.6) / this.number.width));
  }

  private onSlotMachineStateUpdate(state: SlotMachineState): void {
    this.slotMachineState = state;
  }
}

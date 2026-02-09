import { lego } from "@armathai/lego";
import { PixiGrid, type ICellConfig } from "@armathai/pixi-grid";
import anime from "animejs";
import { Graphics } from "pixi.js";
import { getForegroundViewGridConfig } from "../../configs/gridConfigs/foregroundViewGC";
import { errorTextTextConfig } from "../../configs/textConfig";
import { MainGameEvents, UIEvents } from "../../events/MainEvents";
import { ErrorPopup } from "./ErrorPopup";
import type { PopupBase } from "./PopupBase";

export class InitialErrorView extends PixiGrid {
  private errorPopup!: ErrorPopup;
  private blocker!: Graphics;

  private popups: PopupBase[] = [];

  constructor() {
    super();

    lego.event.on(UIEvents.ShowInitialError, this.showErrorPopup, this);
    this.build();
  }

  public getGridConfig(): ICellConfig {
    return getForegroundViewGridConfig();
  }

  public rebuild(): void {
    this.errorPopup.rebuild();
    super.rebuild(this.getGridConfig());
  }

  public showPopup(popup: PopupBase): void {
    this.hidePopup();
    this.showBlocker();
    popup.show();
  }

  public hidePopup(): void {
    this.hideBlocker();
    this.popups.forEach((popup) => {
      if (popup.alpha === 0) return;
      popup.hide();
    });
  }

  private showErrorPopup(): void {
    this.errorPopup.setErrorText({
      errorCode: 404,
      errorText: errorTextTextConfig().text,
    });
    this.showPopup(this.errorPopup);
  }

  private build(): void {
    this.buildBlocker();
    this.buildErrorPopup();
  }

  private buildBlocker(): void {
    this.blocker = new Graphics();
    this.blocker.beginFill(0x000000, 0.7);
    this.blocker.drawRect(0, 0, 100, 100);
    this.blocker.endFill();
    this.setChild("blocker", this.blocker);
    this.blocker.eventMode = "static";
    this.blocker.alpha = 0;
  }

  private buildErrorPopup(): void {
    this.errorPopup = new ErrorPopup(false);
    // this.errorPopup.on("closeErrorPopup", () => {
    //   lego.event.emit(ForegroundViewEvents.ErrorPopupHideComplete);
    //   this.hidePopup();
    // });
    this.setChild("popup", this.errorPopup);
    this.errorPopup.hide(true);
    this.popups.push(this.errorPopup);
  }

  private showBlocker(): void {
    anime({
      targets: this.blocker,
      alpha: 0.7,
      duration: 300,
      easing: "easeInOutQuad",
      complete: () => lego.event.emit(MainGameEvents.BlockActivity, true),
    });
  }

  private hideBlocker(): void {
    anime({
      targets: this.blocker,
      alpha: 0,
      duration: 300,
      easing: "easeInOutQuad",
      complete: () => lego.event.emit(MainGameEvents.BlockActivity, false),
    });
  }
}

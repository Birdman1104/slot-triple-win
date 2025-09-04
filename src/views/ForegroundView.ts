import { lego } from "@armathai/lego";
import { PixiGrid, type ICellConfig } from "@armathai/pixi-grid";
import anime from "animejs";
import { Container, Graphics } from "pixi.js";
import { getForegroundViewGridConfig } from "../configs/gridConfigs/foregroundViewGC";
import { MainGameEvents } from "../events/MainEvents";
import { ErrorPopup } from "./ErrorPopup";
import { InfoPopup } from "./InfoPopup";

export class ForegroundView extends PixiGrid {
  private errorPopup!: ErrorPopup;
  private infoPopup!: InfoPopup;
  private blocker!: Graphics;

  constructor() {
    super();

    this.build();
  }

  public getGridConfig(): ICellConfig {
    return getForegroundViewGridConfig();
  }

  public rebuild(): void {
    this.errorPopup.rebuild();
    super.rebuild(this.getGridConfig());
  }

  public showErrorPopup(popup: Container): void {
    this.showBlocker();
    anime({
      targets: popup,
      alpha: 1,
      duration: 200,
      easing: "easeInOutQuad",
    });
  }

  public hidePopup(popup: Container): void {
    this.hideBlocker();
    anime({
      targets: popup,
      alpha: 0,
      duration: 200,
      easing: "easeInOutQuad",
    });
  }

  private build(): void {
    this.buildBlocker();
    this.buildErrorPopup();
    this.buildInfoPopup();
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
    this.errorPopup = new ErrorPopup();
    this.errorPopup.on("closeErrorPopup", () => {
      this.hidePopup(this.errorPopup);
    });
    this.setChild("popup", this.errorPopup);
    this.errorPopup.hide(true);
  }

  private buildInfoPopup(): void {
    this.infoPopup = new InfoPopup();
    this.infoPopup.on("closeInfoPopup", () => {
      this.hidePopup(this.infoPopup);
    });
    this.setChild("popup", this.infoPopup);
    this.infoPopup.hide(true);
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

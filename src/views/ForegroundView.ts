import { PixiGrid, type ICellConfig } from "@armathai/pixi-grid";
import anime from "animejs";
import { Graphics } from "pixi.js";
import { getForegroundViewGridConfig } from "../configs/gridConfigs/foregroundViewGC";
import { ErrorPopup } from "./ErrorPopup";

export class ForegroundView extends PixiGrid {
  private errorPopup!: ErrorPopup;
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
    this.errorPopup = new ErrorPopup();
    this.setChild("popup", this.errorPopup);
    this.errorPopup.hide(true);
  }

  private showBlocker(): void {
    anime({
      targets: this.blocker,
      alpha: 0.7,
      duration: 300,
      easing: "easeInOutQuad",
    });
  }

  private hideBlocker(): void {
    anime({
      targets: this.blocker,
      alpha: 0,
      duration: 300,
      easing: "easeInOutQuad",
    });
  }
}

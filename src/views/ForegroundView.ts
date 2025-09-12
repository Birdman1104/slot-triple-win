import { lego } from "@armathai/lego";
import { PixiGrid, type ICellConfig } from "@armathai/pixi-grid";
import anime from "animejs";
import { Container, Graphics } from "pixi.js";
import { getForegroundViewGridConfig } from "../configs/gridConfigs/foregroundViewGC";
import { ForegroundViewEvents, MainGameEvents, UIEvents } from "../events/MainEvents";
import { SlotMachineModelEvents } from "../events/ModelEvents";
import { MenuEnum } from "../ui/enums/ui-enums";
import { ErrorPopup } from "./ErrorPopup";
import { InfoPopup } from "./InfoPopup";

export class ForegroundView extends PixiGrid {
  private errorPopup!: ErrorPopup;
  private infoPopup!: InfoPopup;
  private blocker!: Graphics;

  private popups: Container[] = [];

  constructor() {
    super();

    lego.event
      .on(UIEvents.MenuItemClick, this.onMenuItemClick, this)
      .on(SlotMachineModelEvents.ErrorResultUpdate, this.onErrorResultUpdate, this);
    this.build();
  }

  public getGridConfig(): ICellConfig {
    return getForegroundViewGridConfig();
  }

  public rebuild(): void {
    this.errorPopup.rebuild();
    this.infoPopup.rebuild();
    super.rebuild(this.getGridConfig());
  }

  public showPopup(popup: Container): void {
    this.hidePopup();
    this.showBlocker();
    anime({
      targets: popup,
      alpha: 1,
      duration: 200,
      easing: "easeInOutQuad",
    });
  }

  public hidePopup(): void {
    this.hideBlocker();
    anime({
      targets: this.popups,
      alpha: 0,
      duration: 200,
      easing: "easeInOutQuad",
    });
  }

  private onMenuItemClick(itemId: string): void {
    if (itemId === MenuEnum.Info) {
      this.showPopup(this.infoPopup);
    }
  }

  private onErrorResultUpdate(error: ErrorResult): void {
    this.errorPopup.setErrorText(error);
    this.showPopup(this.errorPopup);
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
      lego.event.emit(ForegroundViewEvents.ErrorPopupHideComplete);
      this.hidePopup();
    });
    this.setChild("popup", this.errorPopup);
    this.errorPopup.hide(true);
    this.popups.push(this.errorPopup);
  }

  private buildInfoPopup(): void {
    this.infoPopup = new InfoPopup();
    this.infoPopup.on("closeInfoPopup", () => {
      this.hidePopup();
    });
    this.setChild("popup", this.infoPopup);
    this.infoPopup.hide(true);
    this.popups.push(this.infoPopup);
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

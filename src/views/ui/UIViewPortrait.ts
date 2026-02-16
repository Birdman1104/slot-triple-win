import { lego } from "@armathai/lego";
import { PixiGrid, type ICellConfig } from "@armathai/pixi-grid";
import { Container, Rectangle, type Sprite } from "pixi.js";
import { getUIViewGridConfig } from "../../configs/gridConfigs/uiViewGC";
import { betArrowBtnL, uiButBonusBtnL, uiPortraitBkg } from "../../configs/spritesConfig";
import { UIEvents } from "../../events/MainEvents";
import { makeSprite } from "../../utils/Utils";
import { AutoSpinsPortrait } from "./AutoSpinsPortrait";
import { Balance } from "./BalanceView";
import { Bet } from "./BetView";
import { MenuPortraitView } from "./Menu";
import { SpinButton } from "./SpinButton";

class UIPortraitWrapper extends Container {
  private bkg!: Sprite;
  private buyBonusBtn!: Sprite;
  private spinBtn!: SpinButton;
  private balance!: Balance;
  private autoSpins!: AutoSpinsPortrait;
  private bet!: Bet;

  private upArrow!: Sprite;
  private downArrow!: Sprite;

  constructor() {
    super();
    this.build();
  }

  public getBounds(): Rectangle {
    return new Rectangle(-350, -140, 700, 280);
  }

  public hideAutoSpins(): void {
    this.autoSpins.hideToggle();
  }

  private build() {
    this.buildBkg();
    this.buildBuyBonusButton();
    this.buildSpinButton();
    this.buildBalance();
    this.buildBet();
    this.buildAutoSpins();
  }

  private buildBkg(): void {
    this.bkg = makeSprite(uiPortraitBkg("p"));
    this.bkg.eventMode = "static";
    this.bkg.on("pointerdown", () => {
      this.emit("closeMenu");
      this.autoSpins.hideToggle();
    });
    this.addChild(this.bkg);
  }

  private buildBuyBonusButton(): void {
    this.buyBonusBtn = makeSprite(uiButBonusBtnL());
    this.buyBonusBtn.scale.set(0.6);
    this.buyBonusBtn.position.set(260, -37);
    this.addChild(this.buyBonusBtn);
  }

  private buildSpinButton(): void {
    this.spinBtn = new SpinButton();
    this.spinBtn.on("clicked", () => {
      this.emit("closeMenu");
      this.autoSpins.hideToggle();
    });
    this.spinBtn.scale.set(0.6);
    this.spinBtn.position.set(-1, -43);
    this.addChild(this.spinBtn);
  }

  private buildBalance(): void {
    this.balance = new Balance();
    this.balance.position.set(-170, 80);
    this.balance.scale.set(0.45);
    this.addChild(this.balance);
  }

  private buildBet(): void {
    this.bet = new Bet(true);
    this.bet.position.set(140, 80);
    this.bet.scale.set(0.45);
    this.addChild(this.bet);

    this.upArrow = makeSprite(betArrowBtnL("up"));
    this.upArrow.scale.set(1.4);
    this.upArrow.x = 146;
    this.upArrow.eventMode = "static";
    this.upArrow.on("pointerdown", () => {
      this.emit("closeMenu");
      this.autoSpins.hideToggle();
      lego.event.emit(UIEvents.PlusButtonClick);
    });
    this.addChild(this.upArrow);

    this.downArrow = makeSprite(betArrowBtnL("down"));
    this.downArrow.scale.set(1.4);
    this.downArrow.position.set(-162, -30);
    this.downArrow.eventMode = "static";
    this.downArrow.on("pointerdown", () => {
      this.emit("closeMenu");
      this.autoSpins.hideToggle();
      lego.event.emit(UIEvents.MinusButtonClick);
    });
    this.addChild(this.downArrow);
  }

  private buildAutoSpins(): void {
    this.autoSpins = new AutoSpinsPortrait();
    this.autoSpins.on("clicked", () => this.emit("closeMenu"));
    this.autoSpins.position.set(-273, -37);
    this.addChild(this.autoSpins);
  }
}
export class UIPortraitView extends PixiGrid {
  private wrapper = new UIPortraitWrapper();
  private menu = new MenuPortraitView();

  constructor() {
    super();
    this.build();
  }

  public getGridConfig(): ICellConfig {
    return getUIViewGridConfig();
  }

  public rebuild(): void {
    super.rebuild(this.getGridConfig());
  }

  private build() {
    this.wrapper.on("closeMenu", () => this.menu.hideToggle());
    this.setChild("ui_bar", this.wrapper);
    this.menu.on("clicked", () => this.wrapper.hideAutoSpins());
    this.setChild("menu", this.menu);
  }
}

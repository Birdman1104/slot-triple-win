import { lego } from "@armathai/lego";
import { PixiGrid, type ICellConfig } from "@armathai/pixi-grid";
import { Container, Rectangle, type Sprite } from "pixi.js";
import { getUIViewGridConfig } from "../configs/gridConfigs/uiViewGC";
import { betArrowBtnL, uiButBonusBtnL, uiPortraitBkg } from "../configs/spritesConfig";
import { UIEvents } from "../events/MainEvents";
import { makeSprite } from "../utils/Utils";
import { Balance } from "./BalanceView";
import { Bet } from "./BetView";
import { MultipleSpins } from "./MultipleSpinsL";
import { SpinButton } from "./SpinButton";

class UIPortraitWrapper extends Container {
  private bkg!: Sprite;
  private buyBonusBtn!: Sprite;
  private spinBtn!: SpinButton;
  private balance!: Balance;
  private multipleSpins!: MultipleSpins;
  private bet!: Bet;

  private upArrow!: Sprite;
  private downArrow!: Sprite;

  constructor() {
    super();
    this.build();
    // drawBounds(this);
  }

  public getBounds(skipUpdate?: boolean, rect?: Rectangle): Rectangle {
    return this.bkg.getBounds(skipUpdate, rect);
  }

  private build() {
    this.buildBkg();
    // this.buildMenu();
    this.buildBuyBonusButton();
    this.buildSpinButton();
    this.buildBalance();
    this.buildBet();
    this.buildMultipleSpins();
  }

  private buildBkg(): void {
    this.bkg = makeSprite(uiPortraitBkg("p"));
    this.addChild(this.bkg);
  }

  // private buildMenu(): void {
  //   this.menu = new MenuLandscapeView();
  //   this.menu.position.set(-1228, 12);
  //   this.addChild(this.menu);
  // }

  private buildBuyBonusButton(): void {
    this.buyBonusBtn = makeSprite(uiButBonusBtnL());
    this.buyBonusBtn.scale.set(0.6);
    this.buyBonusBtn.position.set(260, -37);
    this.addChild(this.buyBonusBtn);
  }

  private buildSpinButton(): void {
    this.spinBtn = new SpinButton();
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
      lego.event.emit(UIEvents.PlusButtonClick);
    });
    this.addChild(this.upArrow);

    this.downArrow = makeSprite(betArrowBtnL("down"));
    this.downArrow.scale.set(1.4);
    this.downArrow.position.set(-162, -30);
    this.downArrow.eventMode = "static";
    this.downArrow.on("pointerdown", () => {
      lego.event.emit(UIEvents.MinusButtonClick);
    });
    this.addChild(this.downArrow);
  }

  private buildMultipleSpins(): void {
    this.multipleSpins = new MultipleSpins();
    this.multipleSpins.position.set(-273, -37);
    this.multipleSpins.scale.set(0.6);
    this.addChild(this.multipleSpins);
  }
}
export class UIPortraitView extends PixiGrid {
  private wrapper = new UIPortraitWrapper();

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
    this.setChild("ui_bar", this.wrapper);
  }
}

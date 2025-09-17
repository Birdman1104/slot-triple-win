import { PixiGrid, type ICellConfig } from "@armathai/pixi-grid";
import { Container, type Sprite } from "pixi.js";
import { getUIViewGridConfig } from "../configs/gridConfigs/uiViewGC";
import { uiButBonusBtnL, uiMenuBtnL, uiPortraitBkgL, uiSpinBtnBkgL } from "../configs/spritesConfig";
import { makeSprite } from "../utils/Utils";
import { Balance } from "./BalanceView";
import { Bet } from "./BetView";

export class UILandscapeView extends PixiGrid {
  private wrapper = new Container();
  private bkg!: Sprite;
  private menuBtn!: Sprite;
  private buyBonusBtn!: Sprite;
  private spinBtnBkg!: Sprite;
  private balance!: Balance;
  private bet!: Bet;

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
    this.buildBkg();
    this.buildMenuButton();
    this.buildBuyBonusButton();
    this.buildSpinButtonBkg();
    this.buildBalance();
    this.buildBet();

    this.setChild("ui_bar", this.wrapper);
  }

  private buildBkg(): void {
    this.bkg = makeSprite(uiPortraitBkgL());
    this.wrapper.addChild(this.bkg);
  }

  private buildMenuButton(): void {
    this.menuBtn = makeSprite(uiMenuBtnL());
    this.wrapper.addChild(this.menuBtn);
  }

  private buildBuyBonusButton(): void {
    this.buyBonusBtn = makeSprite(uiButBonusBtnL());
    this.wrapper.addChild(this.buyBonusBtn);
  }

  private buildSpinButtonBkg(): void {
    this.spinBtnBkg = makeSprite(uiSpinBtnBkgL());
    this.wrapper.addChild(this.spinBtnBkg);
  }

  private buildBalance(): void {
    this.balance = new Balance();
    this.balance.x = -657;
    this.wrapper.addChild(this.balance);
    this.balance.setBalance(1000);
  }

  private buildBet(): void {
    this.bet = new Bet();
    this.bet.x = 657;
    this.wrapper.addChild(this.bet);
    this.bet.setBet(100);
  }
}

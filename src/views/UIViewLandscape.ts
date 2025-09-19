import { PixiGrid, type ICellConfig } from "@armathai/pixi-grid";
import { Container, Rectangle, type Sprite } from "pixi.js";
import { getUIViewGridConfig } from "../configs/gridConfigs/uiViewGC";
import { uiButBonusBtnL, uiLineL, uiPortraitBkg } from "../configs/spritesConfig";
import { makeSprite } from "../utils/Utils";
import { Balance } from "./BalanceView";
import { Bet } from "./BetView";
import { MenuLandscapeView } from "./Menu";
import { MultipleSpins } from "./MultipleSpinsL";
import { SpinButton } from "./SpinButton";

class UILandscapeWrapper extends Container {
  private bkg!: Sprite;
  private menu!: MenuLandscapeView;
  private buyBonusBtn!: Sprite;
  private spinBtn!: SpinButton;
  private balance!: Balance;
  private multipleSpins!: MultipleSpins;
  private bet!: Bet;

  private lines: Sprite[] = [];

  constructor() {
    super();
    this.build();
  }

  public getBounds(skipUpdate?: boolean, rect?: Rectangle): Rectangle {
    return this.bkg.getBounds(skipUpdate, rect);
  }

  private build() {
    this.buildBkg();
    this.buildMenu();
    this.buildBuyBonusButton();
    this.buildSpinButton();
    this.buildBalance();
    this.buildBet();
    this.buildMultipleSpins();
    this.buildLines();
  }

  private buildBkg(): void {
    this.bkg = makeSprite(uiPortraitBkg("l"));
    this.bkg.eventMode = "static";
    this.bkg.on("pointerdown", () => {
      this.multipleSpins.hideToggle();
      this.menu.hideToggle();
    });
    this.addChild(this.bkg);
  }

  private buildMenu(): void {
    this.menu = new MenuLandscapeView();
    this.menu.position.set(-1228, 12);
    this.menu.on("clicked", () => {
      this.multipleSpins.hideToggle();
    });
    this.addChild(this.menu);
  }

  private buildBuyBonusButton(): void {
    this.buyBonusBtn = makeSprite(uiButBonusBtnL());
    this.addChild(this.buyBonusBtn);
  }

  private buildSpinButton(): void {
    this.spinBtn = new SpinButton();
    this.spinBtn.on("clicked", () => {
      this.multipleSpins.hideToggle();
      this.menu.hideToggle();
    });
    this.addChild(this.spinBtn);
  }

  private buildBalance(): void {
    this.balance = new Balance();
    this.balance.x = -657;
    this.addChild(this.balance);
  }

  private buildBet(): void {
    this.bet = new Bet();
    this.bet.on("clicked", () => {
      this.multipleSpins.hideToggle();
      this.menu.hideToggle();
    });

    this.bet.x = 657;
    this.addChild(this.bet);
  }

  private buildMultipleSpins(): void {
    this.multipleSpins = new MultipleSpins();
    this.multipleSpins.on("clicked", () => {
      this.menu.hideToggle();
    });
    this.multipleSpins.position.set(208, 11);
    this.addChild(this.multipleSpins);
  }

  private buildLines(): void {
    [-1130, 300, 1130].forEach((x) => {
      const line = makeSprite(uiLineL(x));
      this.addChild(line);
      this.lines.push(line);
    });
  }
}

export class UILandscapeView extends PixiGrid {
  private wrapper = new UILandscapeWrapper();

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

  public resize(): void {
    // const { width } = getGameBounds();
    // this.wrapper.scale.set(width / this.wrapper.width);
  }

  private build() {
    this.setChild("ui_bar", this.wrapper);
  }
}

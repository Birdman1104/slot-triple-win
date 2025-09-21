import { lego } from "@armathai/lego";
import { PixiGrid, type ICellConfig } from "@armathai/pixi-grid";
import anime from "animejs";
import { Container, Rectangle, type Sprite } from "pixi.js";
import { getUIViewGridConfig } from "../configs/gridConfigs/uiViewGC";
import {
  betArrowBtnL,
  portraitMenuCloseButtonConfig,
  uiButBonusBtnL,
  uiMenuBkgP,
  uiMenuBtnL,
  uiPortraitBkg,
} from "../configs/spritesConfig";
import { UIEvents } from "../events/MainEvents";
import { GameModelEvents, SoundModelEvents } from "../events/ModelEvents";
import { GameType } from "../models/GameModel";
import { SoundState } from "../models/SoundModel";
import { makeSprite } from "../utils/Utils";
import { Balance } from "./BalanceView";
import { Bet } from "./BetView";
import { buttonsConfig, MenuButton } from "./Menu";
import { MultipleSpinsPortrait } from "./MultipleSpinsP";
import { SpinButton } from "./SpinButton";

class MenuTogglePortrait extends Container {
  private bkg!: Sprite;
  private buttons: MenuButton[] = [];
  private closeBtn!: Sprite;

  constructor() {
    super();
    lego.event.on(SoundModelEvents.MusicStateUpdate, this.onMusicStateUpdate, this);
    lego.event.on(SoundModelEvents.SoundStateUpdate, this.onSoundStateUpdate, this);
    lego.event.on(GameModelEvents.GameTypeUpdate, this.onGameTypeUpdate, this);
    this.build();
  }

  public hide(): void {
    this.closeBtn.eventMode = "none";
    anime({
      targets: this.scale,
      x: 0,
      y: 0,
      duration: 300,
      easing: "easeInOutSine",
      complete: () => {
        this.emit("menuClosed");
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
        this.emit("menuOpened");
        this.closeBtn.eventMode = "static";
      },
    });
  }

  private onMusicStateUpdate(value: SoundState): void {
    const button = this.buttons.find((b) => b.title === "Music");
    if (button) {
      button.toggleButton(value === SoundState.On);
    }
  }

  private onSoundStateUpdate(value: SoundState): void {
    const button = this.buttons.find((b) => b.title === "Sound");
    if (button) {
      button.toggleButton(value === SoundState.On);
    }
  }

  private onGameTypeUpdate(value: GameType): void {
    const button = this.buttons.find((b) => b.title === "Turbo");
    if (button) {
      button.toggleButton(value === GameType.Flash);
    }
  }

  private build(): void {
    this.bkg = makeSprite(uiMenuBkgP());
    this.addChild(this.bkg);

    buttonsConfig.forEach((c, i) => {
      const button = new MenuButton(c, 400, 110, 70);
      button.on("close", () => this.hide());
      button.y = i * button.height - this.height * 0.07;
      button.x = -this.bkg.width + 50;
      this.addChild(button);
      this.buttons.push(button);
    });

    this.closeBtn = makeSprite(portraitMenuCloseButtonConfig());
    this.closeBtn.on("pointerdown", () => this.hide());
    this.addChild(this.closeBtn);
  }
}
class MenuPortraitView extends Container {
  private menuButton!: Sprite;
  private menu!: MenuTogglePortrait;

  constructor() {
    super();
    this.build();
  }

  public getBounds(): Rectangle {
    return this.menuButton.getBounds();
  }

  public hideToggle(): void {
    this.menu.hide();
  }

  private build(): void {
    this.buildMenuButton();
    this.buildMenu();
  }

  private buildMenuButton(): void {
    this.menuButton = makeSprite(uiMenuBtnL());
    this.menuButton.eventMode = "static";
    this.menuButton.on("pointerdown", () => {
      this.menu.show();
      this.menuButton.eventMode = "none";
    });
    this.addChild(this.menuButton);
  }

  private buildMenu(): void {
    this.menu = new MenuTogglePortrait();
    this.menu.visible = false;
    this.menu.hide();

    this.menu.on("menuClosed", () => {
      if (!this.menu.visible) {
        this.menu.visible = true;
      }

      this.menuButton.eventMode = "static";
    });

    this.menu.on("menuOpened", () => {
      this.menuButton.eventMode = "none";
    });
    this.addChild(this.menu);
  }
}

class UIPortraitWrapper extends Container {
  private bkg!: Sprite;
  private buyBonusBtn!: Sprite;
  private spinBtn!: SpinButton;
  private balance!: Balance;
  private multipleSpins!: MultipleSpinsPortrait;
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

  private build() {
    this.buildBkg();
    this.buildBuyBonusButton();
    this.buildSpinButton();
    this.buildBalance();
    this.buildBet();
    this.buildMultipleSpins();
  }

  private buildBkg(): void {
    this.bkg = makeSprite(uiPortraitBkg("p"));
    this.bkg.eventMode = "static";
    this.bkg.on("pointerdown", () => {
      this.emit("closeMenu");
      this.multipleSpins.hideToggle();
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
      this.multipleSpins.hideToggle();
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
      this.multipleSpins.hideToggle();
      lego.event.emit(UIEvents.PlusButtonClick);
    });
    this.addChild(this.upArrow);

    this.downArrow = makeSprite(betArrowBtnL("down"));
    this.downArrow.scale.set(1.4);
    this.downArrow.position.set(-162, -30);
    this.downArrow.eventMode = "static";
    this.downArrow.on("pointerdown", () => {
      this.emit("closeMenu");
      this.multipleSpins.hideToggle();
      lego.event.emit(UIEvents.MinusButtonClick);
    });
    this.addChild(this.downArrow);
  }

  private buildMultipleSpins(): void {
    this.multipleSpins = new MultipleSpinsPortrait();
    this.multipleSpins.on("clicked", () => {
      this.emit("closeMenu");
    });
    this.multipleSpins.position.set(-273, -37);
    // this.multipleSpins.scale.set(0.6);
    this.addChild(this.multipleSpins);
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
    this.setChild("menu", this.menu);
  }
}

import { lego } from "@armathai/lego";
import anime from "animejs";
import { Container, Graphics, Rectangle, Sprite, Text, Texture } from "pixi.js";
import { uiMenuBkgL, uiMenuBtnL, uiMenuButtonBkgL, uiMenuButtonL, uiMenuCloseBtnL } from "../configs/spritesConfig";
import { menuButtonTextConfig } from "../configs/textConfig";
import { UIEvents } from "../events/MainEvents";
import { GameModelEvents, SoundModelEvents } from "../events/ModelEvents";
import { GameType } from "../models/GameModel";
import { SoundState } from "../models/SoundModel";
import { drawBounds, makeSprite, makeText } from "../utils/Utils";

export type MenuButtonConfig = {
  title: string;
  icon: string;
  event: string;
  type: "toggle" | "button";
};

export const buttonsConfig: MenuButtonConfig[] = [
  {
    title: "Sound",
    icon: "sound_icon.png",
    event: UIEvents.SoundButtonClick,
    type: "toggle",
  },
  {
    title: "Music",
    icon: "music_icon.png",
    event: UIEvents.MusicButtonClick,
    type: "toggle",
  },
  {
    title: "Info",
    icon: "info_icon.png",
    event: UIEvents.InfoButtonClick,
    type: "button",
  },
  {
    title: "Turbo",
    icon: "turbo_icon.png",
    event: UIEvents.TurboButtonClick,
    type: "toggle",
  },
  {
    title: "History",
    icon: "history_icon.png",
    event: UIEvents.HistoryButtonClick,
    type: "button",
  },
];

export class MenuButton extends Container {
  private iconBkg!: Sprite;
  private icon!: Sprite;
  private titleText!: Text;

  private hitAreaGr!: Graphics;

  private isSelected = false;

  constructor(
    private config: MenuButtonConfig,
    private w: number,
    private h: number,
    private fontSize = 100
  ) {
    super();

    this.build();

    this.hitAreaGr = drawBounds(this);
    this.hitAreaGr.alpha = 0;
    this.hitAreaGr.eventMode = "static";
    this.hitAreaGr.on("pointerdown", () => {
      lego.event.emit(this.config.event);
      if (this.config.type === "toggle") {
        //
      } else {
        this.emit("close");
      }
    });
  }

  get title(): string {
    return this.config.title;
  }

  public getBounds(): Rectangle {
    return new Rectangle(0, 0, this.w, this.h);
  }

  public toggleButton(selected: boolean): void {
    if (this.config.type !== "toggle") return;
    this.isSelected = selected;
    this.iconBkg.texture = Texture.from(this.isSelected ? "icon_bkg_green.png" : "icon_bkg.png");
  }

  private build(): void {
    this.iconBkg = makeSprite(uiMenuButtonBkgL());
    this.addChild(this.iconBkg);

    this.icon = makeSprite(uiMenuButtonL(this.config.icon));
    this.addChild(this.icon);

    this.titleText = makeText(menuButtonTextConfig(this.config.title, this.fontSize));
    this.addChild(this.titleText);
  }
}

class MenuToggle extends Container {
  private bkg!: Sprite;
  private buttons: MenuButton[] = [];

  constructor() {
    super();

    lego.event.on(SoundModelEvents.MusicStateUpdate, this.onMusicStateUpdate, this);
    lego.event.on(SoundModelEvents.SoundStateUpdate, this.onSoundStateUpdate, this);
    lego.event.on(GameModelEvents.GameTypeUpdate, this.onGameTypeUpdate, this);

    this.build();
  }

  public hide(): void {
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
      },
    });
  }

  private build(): void {
    this.bkg = makeSprite(uiMenuBkgL());
    this.addChild(this.bkg);

    buttonsConfig.forEach((c, i) => {
      const button = new MenuButton(c, 600, 124);
      button.on("close", () => this.hide());
      button.y = -this.bkg.height * 1.2 + 60 + i * button.height;
      button.x = -this.bkg.width / 2 + 20;
      this.addChild(button);
      this.buttons.push(button);
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
}

export class MenuLandscapeView extends Container {
  private menuButton!: Sprite;
  private closeButton!: Sprite;
  private menu!: MenuToggle;

  constructor() {
    super();
    this.build();
  }

  public hideToggle(): void {
    this.menu.hide();
  }

  private build(): void {
    this.buildMenuButton();
    this.buildCloseButton();
    this.buildMenu();
  }

  private buildMenuButton(): void {
    this.menuButton = makeSprite(uiMenuBtnL());
    this.menuButton.eventMode = "static";
    this.menuButton.on("pointerdown", () => {
      this.emit("clicked");
      this.menu.show();
      this.menuButton.eventMode = "none";
      this.closeButton.eventMode = "none";
    });
    this.addChild(this.menuButton);
  }

  private buildCloseButton(): void {
    this.closeButton = makeSprite(uiMenuCloseBtnL());
    this.closeButton.visible = false;

    this.closeButton.on("pointerdown", () => {
      this.menu.hide();
      this.menuButton.eventMode = "none";
      this.closeButton.eventMode = "none";
    });
    this.addChild(this.closeButton);
  }

  private buildMenu(): void {
    this.menu = new MenuToggle();
    this.menu.visible = false;
    this.menu.hide();

    this.menu.on("menuClosed", () => {
      if (!this.menu.visible) {
        this.menu.visible = true;
      }

      this.closeButton.visible = false;
      this.menuButton.visible = true;

      this.menuButton.eventMode = "static";
      this.closeButton.eventMode = "none";
    });

    this.menu.on("menuOpened", () => {
      this.closeButton.visible = true;
      this.menuButton.visible = false;

      this.menuButton.eventMode = "none";
      this.closeButton.eventMode = "static";
    });
    this.addChild(this.menu);
  }
}

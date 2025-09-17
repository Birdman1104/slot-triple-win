import { lego } from "@armathai/lego";
import anime from "animejs";
import { Container, Graphics, Rectangle, Sprite, Text, Texture } from "pixi.js";
import { uiMenuBkgL, uiMenuBtnL, uiMenuButtonBkgL, uiMenuButtonL, uiMenuCloseBtnL } from "../configs/spritesConfig";
import { menuButtonTextConfig } from "../configs/textConfig";
import { UIEvents } from "../events/MainEvents";
import { drawBounds, makeSprite, makeText } from "../utils/Utils";

type MenuButtonConfig = {
  title: string;
  icon: string;
  event: string;
  type: "toggle" | "button";
};

const buttonsConfig: MenuButtonConfig[] = [
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

class MenuButton extends Container {
  private iconBkg!: Sprite;
  private icon!: Sprite;
  private title!: Text;

  private hitAreaGr!: Graphics;

  private isSelected = false;

  constructor(private config: MenuButtonConfig) {
    super();

    this.build();

    this.hitAreaGr = drawBounds(this);
    this.hitAreaGr.alpha = 0;
    this.hitAreaGr.eventMode = "static";
    this.hitAreaGr.on("pointerdown", () => {
      lego.event.emit(this.config.event);
      if (this.config.type === "toggle") {
        this.isSelected = !this.isSelected;
        this.iconBkg.texture = Texture.from(this.isSelected ? "icon_bkg_green.png" : "icon_bkg.png");
      } else {
        this.emit("close");
      }
    });
  }

  public getBounds(): Rectangle {
    return new Rectangle(0, 0, 600, 124);
  }

  private build(): void {
    this.iconBkg = makeSprite(uiMenuButtonBkgL());
    this.addChild(this.iconBkg);

    this.icon = makeSprite(uiMenuButtonL(this.config.icon));
    this.addChild(this.icon);

    this.title = makeText(menuButtonTextConfig(this.config.title));
    this.addChild(this.title);
  }
}

class MenuToggle extends Container {
  private bkg!: Sprite;
  private buttons: MenuButton[] = [];

  constructor() {
    super();
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
      const button = new MenuButton(c);
      button.on("close", () => this.hide());
      button.y = -this.bkg.height * 1.2 + 60 + i * button.height;
      button.x = -this.bkg.width / 2 + 20;
      this.addChild(button);
      this.buttons.push(button);
    });
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

  private build(): void {
    this.buildMenuButton();
    this.buildCloseButton();
    this.buildMenu();
  }

  private buildMenuButton(): void {
    this.menuButton = makeSprite(uiMenuBtnL());
    this.menuButton.eventMode = "static";
    this.menuButton.on("pointerdown", () => {
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

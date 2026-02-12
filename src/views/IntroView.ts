import { lego } from "@armathai/lego";
import { PixiGrid, type ICellConfig } from "@armathai/pixi-grid";
import anime from "animejs";
import { Container, Graphics, Rectangle, Sprite, Text, Texture } from "pixi.js";
import { getIntroViewGridConfig, introLandscapeGridConfig } from "../configs/gridConfigs/introViewGC";
import { introIceCubeConfig, reelShadowConfig } from "../configs/spritesConfig";
import { clickToContinueTextConfig } from "../configs/textConfig";
import { MainGameEvents } from "../events/MainEvents";
import { getGameBounds, lp, makeSprite, makeText } from "../utils/Utils";
import { IntroCard } from "./IntroCard";

class IntroLandscape extends PixiGrid {
  private card1: IntroCard | null = null;
  private card2: IntroCard | null = null;
  private card3: IntroCard | null = null;
  private clickToContinue: Text | null = null;
  private cardWrapper = new Container();
  private shadowWrapper = new Container();

  constructor() {
    super();
    this.card1 = new IntroCard(1);
    this.card2 = new IntroCard(2);
    this.card3 = new IntroCard(3);

    this.card1.position.set(0, 0);
    this.card2.position.set(this.card1.width * 1.05, 0);
    this.card3.position.set(this.card2.width * 2.1, 0);

    this.cardWrapper.addChild(this.card1, this.card2, this.card3);
    this.setChild("cards", this.cardWrapper);

    for (let i = 0; i < 3; i++) {
      const shadow = makeSprite(reelShadowConfig(0));
      shadow.scale.set(2, 1.25);
      shadow.x = i === 0 ? -35 : i === 1 ? this.card2.x : this.card3.x + 15;
      shadow.alpha = 0.9;
      this.shadowWrapper.addChild(shadow);
    }

    this.setChild("shadows", this.shadowWrapper);

    this.clickToContinue = makeText(clickToContinueTextConfig(this.card2.x));
    this.clickToContinue.visible = false;
    this.setChild("text", this.clickToContinue);
  }

  public showClickToContinue(): void {
    if (this.clickToContinue) {
      this.clickToContinue.visible = true;
    }
  }

  public getGridConfig(): ICellConfig {
    return introLandscapeGridConfig();
  }

  public rebuild(): void {
    super.rebuild(this.getGridConfig());
  }

  public processClick(): void {
    lego.event.emit(MainGameEvents.ShowGame);
  }

  public setReadyToPlay(): void {
    // Landscape is always ready once showClickToContinue is called
  }
}

class IntroPortrait extends Container {
  private card1: IntroCard | null = null;
  private card2: IntroCard | null = null;
  private card3: IntroCard | null = null;

  private ice1!: Sprite;
  private ice2!: Sprite;
  private ice3!: Sprite;
  private clickToContinue!: Text;

  private currentCardIndex = 0;
  private isSwitchingCards = false;
  private isReadyToPlay = false;

  constructor() {
    super();
    this.card1 = new IntroCard(1);
    this.card2 = new IntroCard(2);
    this.card3 = new IntroCard(3);

    this.ice1 = makeSprite(introIceCubeConfig(-100, true));
    this.ice2 = makeSprite(introIceCubeConfig(0, false));
    this.ice3 = makeSprite(introIceCubeConfig(100, false));
    this.ice1.scale.set(0.275);
    this.addChild(this.ice1, this.ice2, this.ice3);
    const { width } = getGameBounds();

    this.card1.position.set(0, 0);
    this.card2.position.set(width + this.card2.width, 0);
    this.card3.position.set(width + this.card3.width, 0);

    this.addChild(this.card1, this.card2, this.card3);

    this.clickToContinue = makeText(clickToContinueTextConfig(0));
    this.clickToContinue.visible = false;
    this.addChild(this.clickToContinue);
  }

  public setReadyToPlay(): void {
    this.isReadyToPlay = true;
  }

  get cards(): IntroCard[] {
    return [this.card1 as IntroCard, this.card2 as IntroCard, this.card3 as IntroCard];
  }

  get ice(): Sprite[] {
    return [this.ice1, this.ice2, this.ice3];
  }

  public getBounds(): Rectangle {
    return new Rectangle(-275, -200, 550, 650);
  }

  public processClick(): void {
    if (this.isSwitchingCards) return;
    if (!this.isReadyToPlay) return;

    if (this.currentCardIndex === this.cards.length - 1) {
      lego.event.emit(MainGameEvents.ShowGame);
      return;
    }

    this.isSwitchingCards = true;
    const { width } = getGameBounds();
    const currentCard = this.cards[this.currentCardIndex];
    const nextCard = this.cards[this.currentCardIndex + 1];
    this.ice.forEach((ice, index) => {
      ice.texture = Texture.from(introIceCubeConfig(ice.x, index === this.currentCardIndex + 1).frame);
      if (index === this.currentCardIndex + 1) {
        ice.scale.set(0.275);
      } else {
        ice.scale.set(0.225);
      }
    });

    this.currentCardIndex += 1;
    if (this.currentCardIndex === this.cards.length - 1) {
      this.clickToContinue.visible = true;
      this.ice.forEach((ice) => {
        ice.visible = false;
      });
    }

    anime({
      targets: currentCard,
      x: -width - currentCard.width,
      duration: 500,
      easing: "easeInOutSine",
      complete: () => {
        this.isSwitchingCards = false;
      },
    });
    anime({
      targets: nextCard,
      x: 0,
      duration: 500,
      easing: "easeInOutSine",
    });
  }
}

export class IntroViewWrapper extends PixiGrid {
  private landscapeView = new IntroLandscape();
  private portraitView = new IntroPortrait();
  private overlay: Graphics = new Graphics();

  private isPortrait!: boolean;
  private isReadyToPlay = false;

  constructor() {
    super();
    this.setChild("view", this.landscapeView);
    this.setChild("view", this.portraitView);

    this.buildOverlay();

    this.rebuild();

    lego.event.on(MainGameEvents.IntroReadyToPlay, this.onReadyToPlay, this);
  }

  public getGridConfig(): ICellConfig {
    return getIntroViewGridConfig();
  }

  public destroy(): void {
    lego.event.off(MainGameEvents.IntroReadyToPlay, this.onReadyToPlay, this);
    super.destroy();
  }

  public rebuild(): void {
    const newOrientation = lp(false, true);
    if (this.isPortrait !== newOrientation) {
      this.isPortrait = newOrientation;
      this.landscapeView.visible = !this.isPortrait;
      this.portraitView.visible = this.isPortrait;
    }

    super.rebuild(this.getGridConfig());
  }

  private onReadyToPlay(): void {
    this.isReadyToPlay = true;
    this.overlay.eventMode = "static";
    this.landscapeView.showClickToContinue();
    this.portraitView.setReadyToPlay();
  }

  private buildOverlay(): void {
    this.overlay = new Graphics();
    this.overlay.beginFill(0x000000, 0.01);
    this.overlay.drawRect(0, 0, 10, 10);
    this.overlay.endFill();
    this.overlay.alpha = 0;
    this.overlay.eventMode = "none";
    this.overlay.on("pointerdown", () => {
      if (!this.isReadyToPlay) return;
      this.isPortrait ? this.portraitView.processClick() : this.landscapeView.processClick();
    });

    this.setChild("overlay", this.overlay);
  }
}

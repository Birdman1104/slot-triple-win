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

const CARD_COUNT = 3;
const CARD_SPACING = 1.05;
const SHADOW_SCALE = { x: 2, y: 1.25 };
const SHADOW_ALPHA = 0.9;
const SHADOW_OFFSETS = [-35, 0, 15] as const;
const ANIMATION_DURATION = 500;
const ANIMATION_EASING = "easeInOutSine";
const ICE_POSITIONS = [-100, 0, 100] as const;
const ICE_SCALE_ACTIVE = 0.275;
const ICE_SCALE_INACTIVE = 0.225;

class IntroLandscape extends PixiGrid {
  private cards: IntroCard[] = [];
  private clickToContinue: Text | null = null;
  private cardWrapper = new Container();
  private shadowWrapper = new Container();

  constructor() {
    super();
    this.cards = Array.from({ length: CARD_COUNT }, (_, i) => new IntroCard(i));

    let nextX = 0;
    this.cards.forEach((card) => {
      card.position.set(nextX, 0);
      nextX += card.width * CARD_SPACING;
    });

    this.cardWrapper.addChild(...this.cards);
    this.setChild("cards", this.cardWrapper);

    this.cards.forEach((card, i) => {
      const shadow = makeSprite(reelShadowConfig(0));
      shadow.scale.set(SHADOW_SCALE.x, SHADOW_SCALE.y);
      shadow.x = card.x + SHADOW_OFFSETS[i];
      shadow.alpha = SHADOW_ALPHA;
      this.shadowWrapper.addChild(shadow);
    });

    this.setChild("shadows", this.shadowWrapper);

    this.clickToContinue = makeText(clickToContinueTextConfig(this.cards[1].x));
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
  private cards: IntroCard[] = [];
  private ice: Sprite[] = [];
  private clickToContinue!: Text;

  private currentCardIndex = 0;
  private isSwitchingCards = false;
  private isReadyToPlay = false;

  constructor() {
    super();
    const { width } = getGameBounds();

    this.cards = Array.from({ length: CARD_COUNT }, (_, i) => new IntroCard(i));
    this.cards[0].position.set(0, 0);
    this.cards.slice(1).forEach((card) => card.position.set(width + card.width, 0));
    this.addChild(...this.cards);

    this.ice = ICE_POSITIONS.map((x, i) => {
      const sprite = makeSprite(introIceCubeConfig(x, i === 0));
      sprite.scale.set(i === 0 ? ICE_SCALE_ACTIVE : ICE_SCALE_INACTIVE);
      return sprite;
    });
    this.addChild(...this.ice);

    this.clickToContinue = makeText(clickToContinueTextConfig(0));
    this.clickToContinue.visible = false;
    this.addChild(this.clickToContinue);
  }

  public setReadyToPlay(): void {
    this.isReadyToPlay = true;
  }

  public getBounds(): Rectangle {
    return new Rectangle(-275, -200, 550, 650);
  }

  public processClick(): void {
    if (this.isSwitchingCards || !this.isReadyToPlay) return;

    if (this.currentCardIndex === this.cards.length - 1) {
      lego.event.emit(MainGameEvents.ShowGame);
      return;
    }

    this.isSwitchingCards = true;
    const { width } = getGameBounds();
    const currentCard = this.cards[this.currentCardIndex];
    const nextCard = this.cards[this.currentCardIndex + 1];

    this.ice.forEach((ice, index) => {
      const isActive = index === this.currentCardIndex + 1;
      ice.texture = Texture.from(introIceCubeConfig(ice.x, isActive).frame);
      ice.scale.set(isActive ? ICE_SCALE_ACTIVE : ICE_SCALE_INACTIVE);
    });

    this.currentCardIndex += 1;
    if (this.currentCardIndex === this.cards.length - 1) {
      this.clickToContinue.visible = true;
      this.ice.forEach((ice) => (ice.visible = false));
    }

    anime({
      targets: currentCard,
      x: -width - currentCard.width,
      duration: ANIMATION_DURATION,
      easing: ANIMATION_EASING,
      complete: () => {
        this.isSwitchingCards = false;
      },
    });
    anime({
      targets: nextCard,
      x: 0,
      duration: ANIMATION_DURATION,
      easing: ANIMATION_EASING,
    });
  }
}

export class IntroViewWrapper extends PixiGrid {
  private landscapeView = new IntroLandscape();
  private portraitView = new IntroPortrait();
  private overlay!: Graphics;

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

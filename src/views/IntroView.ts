import { lego } from "@armathai/lego";
import { PixiGrid, type ICellConfig } from "@armathai/pixi-grid";
import anime from "animejs";
import { Container, Graphics, Rectangle, Text } from "pixi.js";
import { getIntroViewGridConfig } from "../configs/gridConfigs/introViewGC";
import { clickToContinueTextConfig, clickToProceedTextConfig } from "../configs/textConfig";
import { MainGameEvents } from "../events/MainEvents";
import { getGameBounds, lp, makeText } from "../utils/Utils";
import { IntroCard } from "./IntroCard";

class IntroLandscape extends Container {
  private card1: IntroCard | null = null;
  private card2: IntroCard | null = null;
  private card3: IntroCard | null = null;
  private clickToContinue: Text | null = null;

  constructor() {
    super();
    this.card1 = new IntroCard(1);
    this.card2 = new IntroCard(2);
    this.card3 = new IntroCard(3);

    this.card1.position.set(0, 0);
    this.card2.position.set(this.card1.width * 1.1, 0);
    this.card3.position.set(this.card2.width * 2.2, 0);

    this.addChild(this.card1, this.card2, this.card3);

    this.clickToContinue = makeText(clickToContinueTextConfig(this.width / 2 - 265, this.height - 180));
    this.addChild(this.clickToContinue);
  }

  public processClick(): void {
    lego.event.emit(MainGameEvents.ShowGame);
  }
}

class IntroPortrait extends Container {
  private card1: IntroCard | null = null;
  private card2: IntroCard | null = null;
  private card3: IntroCard | null = null;
  private clickToContinue!: Text;
  private clickToProceed!: Text;

  private currentCardIndex = 0;
  private isSwitchingCards = false;

  constructor() {
    super();
    this.card1 = new IntroCard(1);
    this.card2 = new IntroCard(2);
    this.card3 = new IntroCard(3);

    const { width } = getGameBounds();

    this.card1.position.set(0, 0);
    this.card2.position.set(width + this.card2.width, 0);
    this.card3.position.set(width + this.card3.width, 0);

    this.addChild(this.card1, this.card2, this.card3);

    this.clickToContinue = makeText(clickToContinueTextConfig(this.width / 2 - 265, this.height - 10));
    this.clickToContinue.visible = false;
    this.addChild(this.clickToContinue);

    this.clickToProceed = makeText(clickToProceedTextConfig(this.width / 2 - 265, this.height - 10));
    this.addChild(this.clickToProceed);
  }

  get cards(): IntroCard[] {
    return [this.card1 as IntroCard, this.card2 as IntroCard, this.card3 as IntroCard];
  }

  public getBounds(): Rectangle {
    return new Rectangle(-275, -200, 550, 500);
  }

  public processClick(): void {
    if (this.isSwitchingCards) return;

    if (this.currentCardIndex === this.cards.length - 1) {
      lego.event.emit(MainGameEvents.ShowGame);
      return;
    }

    this.isSwitchingCards = true;
    const { width } = getGameBounds();
    const currentCard = this.cards[this.currentCardIndex];
    const nextCard = this.cards[this.currentCardIndex + 1];

    this.currentCardIndex += 1;
    if (this.currentCardIndex === this.cards.length - 1) {
      this.clickToContinue.visible = true;
      this.clickToProceed.visible = false;
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

  constructor() {
    super();
    this.setChild("view", this.landscapeView);
    this.setChild("view", this.portraitView);

    this.buildOverlay();

    this.rebuild();
  }

  public getGridConfig(): ICellConfig {
    return getIntroViewGridConfig();
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

  private buildOverlay(): void {
    this.overlay = new Graphics();
    this.overlay.beginFill(0x000000, 0.01);
    this.overlay.drawRect(0, 0, 10, 10);
    this.overlay.endFill();
    this.overlay.alpha = 0;
    this.overlay.eventMode = "static";
    this.overlay.on("pointerdown", () => {
      this.isPortrait ? this.portraitView.processClick() : this.landscapeView.processClick();
    });

    this.setChild("overlay", this.overlay);
  }
}

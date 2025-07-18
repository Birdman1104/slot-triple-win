import { PixiGrid, type ICellConfig } from "@armathai/pixi-grid";
import { Container, Text } from "pixi.js";
import { getIntroViewGridConfig } from "../configs/gridConfigs/introViewGC";
import { IntroCard } from "./IntroCard";

export class IntroView extends PixiGrid {
  private cardsWrapper: Container = new Container();
  private card1: IntroCard | null = null;
  private card2: IntroCard | null = null;
  private card3: IntroCard | null = null;
  private clickToContinue: Text | null = null;

  constructor() {
    super();
    this.build();
  }

  public getGridConfig(): ICellConfig {
    return getIntroViewGridConfig();
  }

  public rebuild(): void {
    super.rebuild(this.getGridConfig());
  }

  private build(): void {
    this.buildIntroCards();
    // const introSprite = makeSprite(getIntroSpriteConfig());
    // this.setChild("intro", introSprite);
  }

  private buildIntroCards(): void {
    this.cardsWrapper = new Container();
    this.addChild(this.cardsWrapper);

    this.card1 = new IntroCard(1);
    this.card2 = new IntroCard(2);
    this.card3 = new IntroCard(3);

    this.card1.position.set(0, 0);
    this.card2.position.set(this.card1.width * 1.1, 0);
    this.card3.position.set(this.card2.width * 2.2, 0);

    this.cardsWrapper.addChild(this.card1, this.card2, this.card3);

    // Position the cards in the grid
    this.setChild("cards", this.cardsWrapper);

    // Add click to continue text
    this.clickToContinue = new Text("Click to continue", { fontSize: 24, fill: "#ffffff" });
    this.clickToContinue.anchor.set(0.5);
    this.clickToContinue.position.set(this.width / 2, this.height - 50);
    this.setChild("click_to_continue", this.clickToContinue);
  }
}

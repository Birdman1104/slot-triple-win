import { Container } from "pixi.js";
import { introCardConfig } from "../configs/spritesConfig";
import { introCardDescriptionTextConfig, introCardTitleTextConfig } from "../configs/textConfig";
import { makeSprite, makeText } from "../utils/Utils";

const atlas = "intro.png";
const CARDS_CONFIG = [
  {
    frame: "intro_1.png",
    atlas,
    title: "Max Win",
    description:
      "This game offers a massive win potential of up to 333x your bet - hit the right combo and take home top prize.",
  },
  {
    frame: "intro_2.png",
    atlas,
    title: "Join the Fun",
    description:
      "This game offers a massive win potential of up to 333x your bet - hit the right combo and take home top prize.",
  },
  {
    frame: "intro_3.png",
    atlas,
    title: "Bonus",
    description:
      "This game offers a massive win potential of up to 333x your bet - hit the right combo and take home top prize.",
  },
];

export class IntroCard extends Container {
  constructor(private cardIndex: number) {
    super();
    this.build();
  }

  private build(): void {
    const cardConfig = CARDS_CONFIG[this.cardIndex - 1];
    const bkg = makeSprite(introCardConfig(cardConfig.frame, cardConfig.atlas));
    this.addChild(bkg);

    const title = makeText(introCardTitleTextConfig(cardConfig.title));

    title.anchor.set(0.5);
    title.position.set(0, 40);
    this.addChild(title);
    const description = makeText(introCardDescriptionTextConfig(cardConfig.description, title.y + 70, bkg.width * 0.7));

    description.anchor.set(0.5);
    description.position.set(10, title.y + 70);

    this.addChild(description);
  }
}

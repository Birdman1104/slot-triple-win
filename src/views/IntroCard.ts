import { Container, Text } from "pixi.js";
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
    const bkg = makeSprite({ frame: cardConfig.frame, atlas: cardConfig.atlas });
    this.addChild(bkg);

    const title = makeText({
      text: cardConfig.title,
      x: 0,
      y: 40,
      anchor: { x: 0, y: 0.5 },
      style: { fontSize: 48, fill: "#ffffff" },
    });

    title.anchor.set(0.5);
    title.position.set(0, 40);
    this.addChild(title);
    const description = new Text(cardConfig.description, {
      fontSize: 16,
      fill: "#ffffff",
      wordWrap: true,
      wordWrapWidth: bkg.width * 0.7,
    });
    description.anchor.set(0.5);
    description.position.set(10, title.y + 70);

    this.addChild(description);
  }
}

import { Container } from "pixi.js";
import { introCardConfig } from "../configs/spritesConfig";
import { getTextConfig } from "../configs/textConfig";
import { CONFIGS } from "../GameConfig";
import { makeSprite, makeText } from "../utils/Utils";

export class IntroCard extends Container {
  constructor(cardIndex: number) {
    super();
    const { image, title: titleConfig, description: descriptionConfig } = CONFIGS.intro.cards[cardIndex];

    const bkg = makeSprite(introCardConfig(image));
    const title = makeText(getTextConfig(titleConfig));
    const description = makeText(getTextConfig(descriptionConfig));
    this.addChild(bkg, title, description);
  }
}

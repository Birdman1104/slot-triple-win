import { uiAutoSpinsBkgL, uiAutoSpinsIconL, uiMultipleNumbersBkgL } from "../../configs/spritesConfig";
import { autoSpinsTextConfig } from "../../configs/textConfig";
import { CONFIGS } from "../../GameConfig";
import { makeSprite, makeText } from "../../utils/Utils";
import { AutoSpinButton, AutoSpinsBase, AutoSpinsToggleBase } from "./AutoSpinMenuBase";

class AutoSpinsToggleLandscape extends AutoSpinsToggleBase {
  constructor() {
    super();

    this.bkg = makeSprite(uiMultipleNumbersBkgL());
    this.addChild(this.bkg);

    CONFIGS.autoSpinValues.forEach((v, i) => {
      const button = new AutoSpinButton(true, v, 244, 127);
      button.y = -this.bkg.height * 1.2 + 50 + button.height * i;
      button.x = -this.bkg.width / 2;
      button.on("numberClicked", (value: number) => this.onNumberClicked(value));
      this.addChild(button);
    });
  }
}

export class AutoSpinsLandscape extends AutoSpinsBase {
  constructor() {
    super();

    this.bkg = makeSprite(uiAutoSpinsBkgL());
    this.bkg.eventMode = "static";
    this.bkg.on("pointerdown", () => this.onBkgClick());
    this.addChild(this.bkg);

    this.icon = makeSprite(uiAutoSpinsIconL());
    this.addChild(this.icon);

    this.number = makeText(autoSpinsTextConfig());
    this.addChild(this.number);

    this.buildToggle(AutoSpinsToggleLandscape);
  }
}

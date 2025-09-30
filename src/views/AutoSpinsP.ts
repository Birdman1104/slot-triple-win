import {
  uiAutoSpinsBkgPortrait,
  uiAutoSpinsIconPortrait,
  uiMultipleNumbersBkgPortrait,
} from "../configs/spritesConfig";
import { autoSpinsTextConfigPortrait } from "../configs/textConfig";
import { makeSprite, makeText } from "../utils/Utils";
import { AutoSpinButton, AutoSpinsBase, AutoSpinsToggleBase, values } from "./AutoSpinMenuBase";

class AutoSpinsTogglePortrait extends AutoSpinsToggleBase {
  constructor() {
    super();
    this.build();
  }

  private build(): void {
    this.bkg = makeSprite(uiMultipleNumbersBkgPortrait());
    this.addChild(this.bkg);

    values.forEach((v, i) => {
      const button = new AutoSpinButton(false, v, 100, 75);
      button.y = -this.bkg.height * 1.2 + 30 + button.height * i;
      button.x = -7;
      button.on("numberClicked", (value: number) => {
        this.onNumberClicked(value);
      });
      this.addChild(button);
      return button;
    });
  }
}

export class AutoSpinsPortrait extends AutoSpinsBase {
  constructor() {
    super();
    this.build();
  }

  private build(): void {
    this.bkg = makeSprite(uiAutoSpinsBkgPortrait());
    this.bkg.eventMode = "static";
    this.bkg.on("pointerdown", () => {
      this.emit("clicked");
      this.toggle.isHidden ? this.toggle.show() : this.toggle.hide();
      this.bkg.eventMode = "none";
    });
    this.addChild(this.bkg);

    this.icon = makeSprite(uiAutoSpinsIconPortrait());
    this.addChild(this.icon);

    this.number = makeText(autoSpinsTextConfigPortrait());
    this.addChild(this.number);
    this.buildToggle(AutoSpinsTogglePortrait);
  }
}

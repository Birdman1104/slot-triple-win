import anime from "animejs";
import { Container, Sprite } from "pixi.js";
import { iceCrackConfig } from "../configs/spritesConfig";
import { winTextConfig } from "../configs/textConfig";
import { makeSprite, makeText } from "../utils/Utils";

export class SlotForeground extends Container {
  private iceCrack: Sprite = new Sprite();
  private win = makeText(winTextConfig());

  constructor() {
    super();
    this.build();
  }

  public showWin(winAmount: number): void {
    this.win.text = `${winAmount}`;
    this.win.alpha = 0;
    this.win.scale.set(0.2);

    const timeline = anime.timeline({
      easing: "easeInOutQuad",
      complete: () => {
        this.emit("winBoardShowComplete");
      },
    });

    timeline.add({
      targets: [this.iceCrack, this.win],
      alpha: 1,
      duration: 800,
    });

    timeline.add(
      {
        targets: this.win.scale,
        x: 1,
        y: 1,
        duration: 800,
      },
      0
    );

    timeline.add(
      {
        targets: this.win.scale,
        x: 0.2,
        y: 0.2,
        duration: 800,
      },
      3000
    );

    timeline.add(
      {
        targets: [this.iceCrack, this.win],
        alpha: 0,
        duration: 800,
      },
      3000
    );
  }

  private build(): void {
    this.iceCrack = makeSprite(iceCrackConfig());
    this.addChild(this.iceCrack, this.win);
  }

  public hideEverything(): void {
    [this.iceCrack].forEach((child) => (child.alpha = 0));
  }
}

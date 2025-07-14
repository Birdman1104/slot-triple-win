import anime from "animejs";
import { Container, Sprite, Text } from "pixi.js";
import { makeSprite } from "../utils/Utils";

export class SlotForeground extends Container {
  private iceCrack: Sprite = new Sprite();

  constructor() {
    super();
    this.build();
  }

  public showWin(winAmount: number): void {
    const win = new Text(`${winAmount}`, {
      fontFamily: "Arial",
      fontSize: 128,
      fill: "#ffffff",
    });
    win.anchor.set(0.5);

    win.position.set(420, 370);
    this.addChild(win);

    anime({
      targets: this.iceCrack,
      alpha: 1,
      duration: 300,
      easing: "easeInOutQuad",
    });

    setTimeout(() => {
      anime({
        targets: [this.iceCrack, win],
        alpha: 0,
        duration: 300,
        easing: "easeInOutQuad",
        complete: () => {
          win.destroy();
          this.emit("winBoardShowComplete");
        },
      });
    }, 2000);
  }

  private build(): void {
    this.iceCrack = makeSprite({ frame: "crack.png" });
    this.iceCrack.anchor.set(0.5);
    this.iceCrack.position.set(420, 370);
    this.addChild(this.iceCrack);
  }

  public hideEverything(): void {
    [this.iceCrack].forEach((child) => (child.alpha = 0));
  }
}

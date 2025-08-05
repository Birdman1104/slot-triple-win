import anime from "animejs";
import { Container, Sprite, Text } from "pixi.js";
import { makeSprite } from "../utils/Utils";

export class SlotForeground extends Container {
  private iceCrack: Sprite = new Sprite();
  private win = new Text("", {
    fontFamily: "Arial",
    fontSize: 128,
    fill: "#ffffff",
  });

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
    this.iceCrack = makeSprite({ frame: "crack.png" });
    this.iceCrack.anchor.set(0.5);
    this.iceCrack.position.set(420, 370);
    this.addChild(this.iceCrack);

    this.win.anchor.set(0.5);
    this.win.position.set(420, 370);
    this.addChild(this.win);
  }

  public hideEverything(): void {
    [this.iceCrack].forEach((child) => (child.alpha = 0));
  }
}

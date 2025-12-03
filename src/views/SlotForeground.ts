import anime from "animejs";
import { Container, Sprite, Texture } from "pixi.js";
import { cocktailConfig, cocktailTextConfig, iceCrackConfig, winTypeConfig } from "../configs/spritesConfig";
import { winTextConfig } from "../configs/textConfig";
import Head from "../models/Head";
import { makeSprite, makeText } from "../utils/Utils";

const STOP_DURATION = 1500;

export class SlotForeground extends Container {
  private iceCrack: Sprite = new Sprite();
  private cocktail: Sprite = new Sprite();
  private cocktailText: Sprite = new Sprite();
  private winType: Sprite = new Sprite();
  private winAmount = makeText(winTextConfig());

  private tl: any;

  constructor() {
    super();
    this.build();
  }

  public skipWinnings(): void {
    this.tl.pause();
    this.tl.remove();
    [this.iceCrack, this.winAmount, this.winType].forEach((el) => (el.alpha = 0));
    [this.winAmount, this.winType].forEach((el) => el.scale.set(0.2));

    this.emit("winBoardShowComplete");
  }

  public showWin(result: SpinResult): void {
    if (result.winningInfo.length === 1 && !result.winningInfo[0].line) {
      this.cocktail.texture = Texture.from(result.winningInfo[0].symbol + ".png");
      this.cocktailText.texture = Texture.from(result.winningInfo[0].symbol + "_text.png");
      this.showCocktail(result.totalWin);
    } else {
      this.showSymbolWin(result.totalWin);
    }
  }

  private showCocktail(winAmount: number): void {
    this.winAmount.text = `$${winAmount}`;

    [this.cocktail, this.cocktailText, this.winAmount].forEach((el) => {
      el.alpha = 0;
      el.scale.set(4);
    });
    this.updateWinAmountTextStyle(winAmount);

    this.tl = anime.timeline({
      easing: "easeInOutQuad",
      complete: () => {
        this.emit("winBoardShowComplete");
      },
    });

    this.tl.add({
      targets: this.iceCrack,
      alpha: 1,
      duration: 10,
    });

    this.tl.add({
      targets: [this.cocktail, this.cocktailText],
      alpha: 1,
      duration: 200,
    });

    this.tl.add(
      {
        targets: [this.cocktail.scale, this.cocktailText.scale],
        x: 1,
        y: 1,
        ease: "easeOutBounce",
        duration: 200,
      },
      0
    );

    this.tl.add(
      {
        targets: [this.cocktail.scale, this.cocktailText.scale],
        x: 0.2,
        y: 0.2,
        duration: 400,
      },
      STOP_DURATION
    );

    this.tl.add(
      {
        targets: [this.iceCrack, this.cocktail, this.cocktailText],
        alpha: 0,
        duration: 400,
      },
      STOP_DURATION
    );
  }

  private showSymbolWin(winAmount: number): void {
    this.winAmount.text = `$${winAmount}`;
    this.winAmount.alpha = 0;
    this.winAmount.scale.set(4);
    this.updateWinAmountTextStyle(winAmount);

    this.winType.alpha = 0;
    this.winType.scale.set(4);

    this.tl = anime.timeline({
      easing: "easeInOutQuad",
      complete: () => {
        this.emit("winBoardShowComplete");
      },
    });

    this.tl.add({
      targets: this.iceCrack,
      alpha: 1,
      duration: 10,
    });

    this.tl.add({
      targets: [this.winAmount, this.winType],
      alpha: 1,
      duration: 200,
    });

    this.tl.add(
      {
        targets: [this.winAmount.scale, this.winType.scale],
        x: 1,
        y: 1,
        ease: "easeOutBounce",
        duration: 200,
      },
      0
    );

    this.tl.add(
      {
        targets: [this.winAmount.scale, this.winType.scale],
        x: 0.2,
        y: 0.2,
        duration: 400,
      },
      STOP_DURATION
    );

    this.tl.add(
      {
        targets: [this.iceCrack, this.winAmount, this.winType],
        alpha: 0,
        duration: 400,
      },
      STOP_DURATION
    );
  }

  private build(): void {
    this.iceCrack = makeSprite(iceCrackConfig());

    this.winType = makeSprite(winTypeConfig());
    this.addChild(this.winType);

    this.cocktail = makeSprite(cocktailConfig());
    this.cocktailText = makeSprite(cocktailTextConfig());
    this.addChild(this.iceCrack, this.winAmount, this.winType, this.cocktail, this.cocktailText);
  }

  public hideEverything(): void {
    this.children.forEach((child) => {
      child.alpha = 0;
    });
  }

  private updateWinAmountTextStyle(winAmount: number): void {
    const bet = Head.playerModel?.bet || 10;
    if (winAmount / bet > 10) {
      // BIG WIN
      this.winAmount.style.stroke = "#00a9aa";
      this.winType.texture = Texture.from("big_win.png");
    } else {
      // WIN
      this.winAmount.style.stroke = "#00a718";
      this.winType.texture = Texture.from("win.png");
    }
  }
}

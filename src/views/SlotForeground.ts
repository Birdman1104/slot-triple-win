import anime from "animejs";
import { Container, Sprite, Text, Texture } from "pixi.js";
import { cocktailConfig, cocktailTextConfig, iceCrackConfig, winTypeConfig } from "../configs/spritesConfig";
import { COCKTAIL_COLOR_MAP } from "../configs/SymbolsConfig";
import { multiplierTextConfig, winTextConfig } from "../configs/textConfig";
import Head from "../models/Head";
import { makeSprite, makeText } from "../utils/Utils";

const STOP_DURATION = 1500;

export class SlotForeground extends Container {
  private iceCrack!: Sprite;
  private cocktail!: Sprite;
  private cocktailText!: Sprite;
  private winType!: Sprite;
  private winAmount: Text;
  private multiplier!: Text;

  private tl: any;

  constructor() {
    super();
    this.iceCrack = makeSprite(iceCrackConfig());
    this.multiplier = makeText(multiplierTextConfig(0));
    this.multiplier.angle = -15;
    this.winType = makeSprite(winTypeConfig());
    this.winAmount = makeText(winTextConfig());
    this.cocktail = makeSprite(cocktailConfig());
    this.cocktailText = makeSprite(cocktailTextConfig());

    this.addChild(this.iceCrack, this.winAmount, this.winType, this.cocktail, this.cocktailText, this.multiplier);
  }

  public skipWinnings(): void {
    this.tl.pause();
    this.tl.remove();
    [this.iceCrack, this.winAmount, this.winType, this.cocktail, this.cocktailText].forEach((el) => (el.alpha = 0));
    [this.winAmount, this.winType, this.cocktail, this.cocktailText].forEach((el) => el.scale.set(0.2));

    this.emit("winBoardShowComplete");
  }

  public showWin(result: SpinResult): void {
    const cocktails = result.winningInfo.filter((info) => !info.line);

    if (cocktails.length > 0) {
      this.showCocktails(cocktails, result.totalWin);
    } else {
      this.showSymbolWin(result.totalWin);
    }
  }

  private showCocktails(cocktails: WinningInfo[], totalWin: number): void {
    this.winAmount.text = `$${totalWin}`;

    [this.cocktail, this.cocktailText, this.winAmount, this.winType].forEach((el) => {
      el.alpha = 0;
      el.scale.set(4);
    });
    this.updateWinAmountTextStyle(totalWin);

    this.tl = anime.timeline({
      easing: "easeInOutQuad",
      complete: () => {
        this.emit("winBoardShowComplete");
      },
    });

    this.tl.add(
      {
        targets: this.iceCrack,
        alpha: 1,
        duration: 10,
      },
      0
    );

    let currentOffset = 10;
    cocktails.forEach((cocktail) => {
      const cocktailStartOffset = currentOffset;

      this.tl.add(
        {
          targets: [this.cocktail.scale, this.cocktailText.scale, this.multiplier.scale],
          x: 4,
          y: 4,
          duration: 0.1,
          begin: () => {
            this.cocktail.texture = Texture.from(cocktail.symbol + ".png");
            this.cocktailText.texture = Texture.from(cocktail.symbol + "_text.png");
            this.multiplier.text = `${cocktail.multiplier || 1}x`;
            this.multiplier.style.fill = COCKTAIL_COLOR_MAP[cocktail.symbol as keyof typeof COCKTAIL_COLOR_MAP];
          },
        },
        cocktailStartOffset - 1
      );
      this.tl.add(
        // Fade in
        {
          targets: [this.cocktail, this.cocktailText, this.multiplier],
          alpha: 1,
          duration: 200,
          begin: () => {
            this.cocktail.texture = Texture.from(cocktail.symbol + ".png");
            this.cocktailText.texture = Texture.from(cocktail.symbol + "_text.png");
          },
        },
        cocktailStartOffset
      );
      this.tl.add(
        // Scale in
        {
          targets: [this.cocktail.scale, this.cocktailText.scale, this.multiplier.scale],
          x: 1,
          y: 1,
          duration: 200,
        },
        cocktailStartOffset
      );

      this.tl.add(
        // Scale out
        {
          targets: [this.cocktail.scale, this.cocktailText.scale, this.multiplier.scale],
          x: 0.2,
          y: 0.2,
          duration: 400,
        },
        cocktailStartOffset + STOP_DURATION
      );
      this.tl.add(
        // Fade out
        {
          targets: [this.cocktail, this.cocktailText, this.multiplier],
          alpha: 0,
          duration: 400,
        },
        cocktailStartOffset + STOP_DURATION + 10
      );

      currentOffset = cocktailStartOffset + STOP_DURATION + 400;
    });

    const totalWinStartOffset = currentOffset;

    this.tl.add(
      {
        targets: [this.winAmount, this.winType],
        alpha: 1,
        duration: 200,
      },
      totalWinStartOffset
    );

    this.tl.add(
      {
        targets: [this.winAmount.scale, this.winType.scale],
        x: 1,
        y: 1,
        duration: 200,
      },
      totalWinStartOffset
    );

    this.tl.add(
      {
        targets: [this.winAmount.scale, this.winType.scale],
        x: 0.2,
        y: 0.2,
        duration: 400,
      },
      totalWinStartOffset + STOP_DURATION
    );

    this.tl.add(
      {
        targets: [this.iceCrack, this.winAmount, this.winType],
        alpha: 0,
        duration: 400,
      },
      totalWinStartOffset + STOP_DURATION
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

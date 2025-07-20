import { Container } from "pixi.js";
import { BackgroundView } from "./views/BackgroundView.ts";
import { GameView } from "./views/GameView.ts";
import { IntroView } from "./views/IntroView.ts";

class PixiStage extends Container {
  private intro: IntroView | null = null;
  private gameView: GameView | null = null;
  private bgView: BackgroundView | null = null;

  public resize(): void {
    this.intro?.rebuild();
    this.bgView?.rebuild();
    this.gameView?.rebuild();
  }

  public hideIntro(): void {
    if (this.intro) {
      this.removeChild(this.intro);
      this.intro = null;
    }
  }

  public showIntro(): void {
    if (this.intro) return;
    this.bgView = new BackgroundView();
    this.addChild(this.bgView);

    this.intro = new IntroView();
    this.addChild(this.intro);
  }

  public showMainGame(): void {
    this.gameView = new GameView();
    this.addChild(this.gameView);
  }
}

export default PixiStage;

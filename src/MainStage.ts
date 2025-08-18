import { Container } from "pixi.js";
import { BackgroundView } from "./views/BackgroundView.ts";
import { ForegroundView } from "./views/ForegroundView.ts";
import { GameView } from "./views/GameView.ts";
import { IntroViewWrapper } from "./views/IntroView.ts";

class PixiStage extends Container {
  private intro: IntroViewWrapper | null = null;
  private gameView: GameView | null = null;
  private bgView: BackgroundView | null = null;
  private foregroundView: ForegroundView | null = null;

  public resize(): void {
    this.intro?.rebuild();
    this.bgView?.rebuild();
    this.gameView?.rebuild();
    this.foregroundView?.rebuild();
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

    this.intro = new IntroViewWrapper();
    this.addChild(this.intro);
  }

  public showMainGame(): void {
    this.gameView = new GameView();
    this.addChild(this.gameView);

    this.foregroundView = new ForegroundView();
    this.addChild(this.foregroundView);
  }
}

export default PixiStage;

import { Container } from "pixi.js";
import { BackgroundView } from "./views/BackgroundView.ts";
import { GameView } from "./views/GameView.ts";
import { IntroView } from "./views/IntroView.ts";
import { UIView } from "./views/UIView.ts";

class PixiStage extends Container {
  private intro: IntroView | null = null;
  private gameView: GameView | null = null;
  private uiView: UIView | null = null;
  private bgView: BackgroundView | null = null;

  public resize(): void {
    this.intro?.rebuild();
    this.bgView?.rebuild();
    this.gameView?.rebuild();
    this.uiView?.rebuild();
  }

  public showIntro(): void {
    if (this.intro) return;
    this.bgView = new BackgroundView();
    this.addChild(this.bgView);

    this.intro = new IntroView();
    this.addChild(this.intro);
  }

  public start(): void {
    this.gameView = new GameView();
    this.addChild(this.gameView);
  }
}

export default PixiStage;

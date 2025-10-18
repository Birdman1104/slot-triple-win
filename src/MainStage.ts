import { Container } from "pixi.js";
import { lp } from "./utils/Utils.ts";
import { BackgroundView } from "./views/BackgroundView.ts";
import { ForegroundView } from "./views/ForegroundView.ts";
import { GameView } from "./views/GameView.ts";
import { InitialErrorView } from "./views/InitialErrorView.ts";
import { IntroViewWrapper } from "./views/IntroView.ts";
import { UILandscapeView } from "./views/UIViewLandscape.ts";
import { UIPortraitView } from "./views/UIViewPortrait.ts";

class PixiStage extends Container {
  private intro: IntroViewWrapper | null = null;
  private gameView: GameView | null = null;
  private bgView: BackgroundView | null = null;
  private foregroundView: ForegroundView | null = null;
  private uiLandscape: UILandscapeView | null = null;
  private uiPortrait: UIPortraitView | null = null;
  private initialError: InitialErrorView | null = null;

  public resize(): void {
    this.intro?.rebuild();
    this.bgView?.rebuild();
    this.gameView?.rebuild();
    this.foregroundView?.rebuild();

    if (this.uiLandscape) {
      this.uiLandscape.visible = lp(true, false);
      this.uiLandscape.visible && this.uiLandscape.rebuild();
    }

    if (this.uiPortrait) {
      this.uiPortrait.visible = lp(false, true);
      this.uiPortrait.visible && this.uiPortrait.rebuild();
    }
  }

  public hideIntro(): void {
    if (this.intro) {
      this.removeChild(this.intro);
      this.intro = null;
    }
  }

  public showIntro(): void {
    if (this.intro) return;

    this.intro = new IntroViewWrapper();
    this.addChild(this.intro);
  }

  public showMainGame(): void {
    this.gameView = new GameView();
    this.addChild(this.gameView);

    this.foregroundView = new ForegroundView();
    this.addChild(this.foregroundView);

    this.uiLandscape = new UILandscapeView();
    this.addChild(this.uiLandscape);

    this.uiPortrait = new UIPortraitView();
    this.addChild(this.uiPortrait);
    this.resize();
  }

  public setBkg(): void {
    this.bgView = new BackgroundView();
    this.addChild(this.bgView);
  }

  public initInitialErrorView(): void {
    this.initialError = new InitialErrorView();
    this.addChild(this.initialError);
  }
}

export default PixiStage;

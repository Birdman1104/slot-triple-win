import { lego } from "@armathai/lego";
import { Container } from "pixi.js";
import { MainGameEvents } from "./events/MainEvents.ts";
import { lp } from "./utils/Utils.ts";
import { BackgroundView } from "./views/BackgroundView.ts";
import { ForegroundView } from "./views/ForegroundView.ts";
import { GameView } from "./views/GameView.ts";
import { IntroViewWrapper } from "./views/IntroView.ts";
import { InitialErrorView } from "./views/ui/InitialErrorView.ts";
import { UILandscapeView } from "./views/ui/UIViewLandscape.ts";
import { UIPortraitView } from "./views/ui/UIViewPortrait.ts";

class PixiStage extends Container {
  private intro: IntroViewWrapper | null = null;
  private gameView: GameView | null = null;
  private bgView: BackgroundView | null = null;
  private foregroundView: ForegroundView | null = null;
  private uiLandscape: UILandscapeView | null = null;
  private uiPortrait: UIPortraitView | null = null;
  private initialError: InitialErrorView | null = null;

  constructor() {
    super();
    lego.event.on(MainGameEvents.IntroReadyToPlay, this.onIntroReadyToPlay, this);
  }

  public resize(): void {
    this.intro?.rebuild();
    this.bgView?.rebuild();
    this.gameView?.rebuild();
    this.foregroundView?.rebuild();
    this.initialError?.rebuild();

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
    this.addChildAt(this.intro, 1);
  }

  public showMainGame(): void {
    this.gameView = new GameView();
    this.addChild(this.gameView);

    this.uiLandscape = new UILandscapeView();
    this.addChild(this.uiLandscape);

    this.uiPortrait = new UIPortraitView();
    this.addChild(this.uiPortrait);

    this.foregroundView = new ForegroundView();
    this.addChild(this.foregroundView);

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

  private onIntroReadyToPlay(): void {
    this.initialError?.destroy();
    this.initialError = null;
  }
}

export default PixiStage;

import { Container } from "pixi.js";
import { BackgroundView } from "./views/BackgroundView.ts";
import { GameView } from "./views/GameView.ts";
import { UIView } from "./views/UIView.ts";

class PixiStage extends Container {
  private gameView: GameView | null = null;
  private uiView: UIView | null = null;
  private bgView: BackgroundView | null = null;

  public resize(): void {
    this.bgView?.rebuild();
    this.gameView?.rebuild();
    this.uiView?.rebuild();
  }

  public start(): void {
    this.bgView = new BackgroundView();
    this.addChild(this.bgView);
    this.gameView = new GameView();
    this.addChild(this.gameView);
  }
}

export default PixiStage;

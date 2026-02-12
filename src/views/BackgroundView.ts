import { lego } from "@armathai/lego";
import { PixiGrid, type ICellConfig } from "@armathai/pixi-grid";
import type { Sprite } from "pixi.js";
import { getBackgroundGridConfig } from "../configs/gridConfigs/backgroundViewGC";
import { dockLeftShadowConfig, dockRightShadowConfig, gameBkgSpriteConfig, leafConfig } from "../configs/spritesConfig";
import { GameModelEvents } from "../events/ModelEvents";
import { GameState } from "../models/GameModel";
import { makeSprite } from "../utils/Utils";

export class BackgroundView extends PixiGrid {
  private leftShadow!: Sprite;
  private rightShadow!: Sprite;
  private leaf!: Sprite;
  constructor() {
    super();

    lego.event.on(GameModelEvents.StateUpdate, this.onStateUpdate, this);
    this.build();
  }

  public destroy(): void {
    lego.event.off(GameModelEvents.StateUpdate, this.onStateUpdate, this);
    super.destroy();
  }

  public getGridConfig(): ICellConfig {
    return getBackgroundGridConfig();
  }

  public rebuild(): void {
    super.rebuild(this.getGridConfig());
  }

  private onStateUpdate(state: GameState): void {
    if (state === GameState.Game) {
      this.leftShadow.destroy();
      this.rightShadow.destroy();
      this.leaf.destroy();
    }
  }

  private build(): void {
    const bkg = makeSprite(gameBkgSpriteConfig());
    this.setChild("bkg", bkg);

    this.leftShadow = makeSprite(dockLeftShadowConfig());
    this.setChild("left_shadow", this.leftShadow);
    this.rightShadow = makeSprite(dockRightShadowConfig());
    this.setChild("right_shadow", this.rightShadow);
    this.leaf = makeSprite(leafConfig());
    this.setChild("leaf", this.leaf);
  }
}

import { PixiGrid, type ICellConfig } from "@armathai/pixi-grid";
import { getBackgroundGridConfig } from "../configs/gridConfigs/BackgroundViewGC";
import { gameBkgSpriteConfig } from "../configs/spritesConfig";
import { makeSprite } from "../utils/Utils";

export class BackgroundView extends PixiGrid {
  constructor() {
    super();
    this.build();
  }

  public getGridConfig(): ICellConfig {
    return getBackgroundGridConfig();
  }

  public rebuild(): void {
    super.rebuild(this.getGridConfig());
  }

  private build(): void {
    const bkg = makeSprite(gameBkgSpriteConfig());
    this.setChild("bkg", bkg);
  }
}

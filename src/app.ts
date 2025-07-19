import { lego, legoLogger } from "@armathai/lego";
import { Application, Assets, Spritesheet } from "pixi.js";
import Stats from "stats.js";
import { ATLASES } from "./assets/assetsNames/atlases.ts";
import { IMAGES } from "./assets/assetsNames/images.ts";
import { SPRITESHEET } from "./assets/assetsNames/spritesheets.ts";
import { mapCommands } from "./commands/eventCommandPairs.ts";
import { ScreenSizeConfig } from "./config.ts";
import { MainGameEvents, WindowEvent } from "./events/MainEvents.ts";
import PixiStage from "./MainStage.ts";
import { fitDimension } from "./utils/Utils.ts";

class App extends Application {
  declare public stage: PixiStage;

  public constructor() {
    super({
      backgroundColor: 0x0044aa,
      backgroundAlpha: 1,
      powerPreference: "high-performance",
      antialias: true,
      resolution: Math.max(window.devicePixelRatio || 1, 2),
      sharedTicker: true,
    });
  }

  public async init(): Promise<void> {
    this.stage = new PixiStage();
    // @ts-ignore
    this.view.classList.add("app");
    // @ts-ignore
    document.body.appendChild(this.view);
    // @ts-ignore
    if (process.env.NODE_ENV !== "production") {
      this.initStats();
      this.initLego();
    }
    await this.loadAssets();
    this.onLoadComplete();
  }

  public onFocusChange(focus: boolean): void {
    lego.event.emit(WindowEvent.FocusChange, focus);
  }

  public appResize(): void {
    const { clientWidth: w, clientHeight: h } = document.body;
    if (w === 0 || h === 0) return;
    const { min, max } = ScreenSizeConfig.size.ratio;
    const { width, height } = fitDimension({ width: w, height: h }, min, max);
    this.resizeCanvas(width, height);
    this.resizeRenderer(width, height);
    this.stage.resize();
  }

  private resizeCanvas(width: number, height: number): void {
    const { style } = this.renderer.view;
    if (!style) return;
    style.width = `${width}px`;
    style.height = `${height}px`;
  }

  private resizeRenderer(width: number, height: number): void {
    this.renderer.resize(width, height);
  }

  private async loadAssets(): Promise<void> {
    for (const image of IMAGES) {
      const { name, path } = image;
      await Assets.load({ alias: name, src: path });
    }
    for (const atlas of ATLASES) {
      const { name, img, json } = atlas;
      const sheetTexture = await Assets.load({ alias: `${name}.png`, src: img });
      SPRITESHEET[name] = new Spritesheet(sheetTexture, json);
      await SPRITESHEET[name].parse();
    }
  }

  private onLoadComplete(): void {
    this.appResize();
    this.stage.showIntro();
    lego.command.execute(mapCommands);
    lego.event.emit(MainGameEvents.MainViewReady);

    lego.event.on(MainGameEvents.GameStart, this.onGameStart, this);
  }

  private onGameStart(): void {
    this.stage.hideIntro();
    this.stage.showMainGame();
    lego.event.emit("initModels");
  }

  private initStats(): void {
    const stats = Stats();
    document.body.appendChild(stats.dom);
    stats.begin();
    this.ticker.add(() => {
      stats.update();
    });
  }

  private initLego(): void {
    legoLogger.start(lego, Object.freeze({}));
  }
}

export default App;

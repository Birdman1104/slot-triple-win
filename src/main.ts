// @ts-ignore
import App from "./app.ts";

window.addEventListener("load", async (): Promise<void> => {
  window.game = new App();
  window.game.init();

  // @ts-ignore
  if (process.env.NODE_ENV !== "production") {
    // @ts-ignore
    globalThis.__PIXI_APP__ = window.game;
  }

  window.addEventListener("resize", () => window.game.appResize());
  window.addEventListener("focus", () => window.game.onFocusChange(true));
  window.addEventListener("blur", () => window.game.onFocusChange(false));
});

// @ts-ignore
import { lego } from "@armathai/lego";
import { createApp } from "vue";
import App from "./app.ts";
import { MainGameEvents } from "./events/MainEvents.ts";
import UI from "./ui/UI.vue";

window.addEventListener("load", async (): Promise<void> => {
  window.game = new App();
  window.game.init();

  // @ts-ignore
  if (process.env.NODE_ENV !== "production") {
    // @ts-ignore
    globalThis.__PIXI_APP__ = window.game;
  }

  window.addEventListener("resize", () => window.game.appResize());
  window.addEventListener("orientationchange", () => window.game.appResize());
  window.addEventListener("focus", () => window.game.onFocusChange(true));
  window.addEventListener("blur", () => window.game.onFocusChange(false));

  lego.event.on(MainGameEvents.MainViewReady, () => {
    const uiRoot = document.createElement("div");
    document.body.appendChild(uiRoot);
    createApp(UI).mount(uiRoot);
  });
});

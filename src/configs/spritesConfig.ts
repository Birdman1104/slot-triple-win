import { lp } from "../utils/Utils";

export const getBkgSpriteConfig = (): SpriteConfig => ({
  frame: "bkg.jpg",
});

export const errorPopupBkgConfig = (): SpriteConfig => ({
  atlas: "ui.png",
  frame: lp("error_l.png", "error_p.png"),
});

export const popupCloseButtonConfig = (): SpriteConfig => ({
  atlas: "ui.png",
  frame: "close_button.png",
  x: lp(290, 100),
  y: lp(-130, -75),
});

export const redIconConfig = (): SpriteConfig => ({
  atlas: "ui.png",
  frame: "red_triangle.png",
  y: lp(-100, -65),
  scaleX: lp(1, 0.6),
  scaleY: lp(1, 0.6),
});

import { lp } from "../utils/Utils";

export const getBkgSpriteConfig = (): SpriteConfig => ({
  frame: "bkg.jpg",
});

export const getDockSpriteConfig = (): SpriteConfig => ({
  frame: "dock.png",
  x: 372,
  y: 648,
  scaleX: 1.5,
  scaleY: 1.5,
  anchor: { x: 0.5, y: 0 },
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

export const iceCrackConfig = (): SpriteConfig => ({
  frame: "crack.png",
  x: 384,
  y: 370,
  anchor: { x: 0.5, y: 0.5 },
});

export const iceCubeConfig = (x: number, y: number): SpriteConfig => ({
  frame: "ice_1.png",
  atlas: "slot_machine.png",
  x,
  y,
  anchor: { x: 0.5, y: 0.5 },
});

export const introCardConfig = (frame: string, atlas: string): SpriteConfig => ({
  frame,
  atlas,
});

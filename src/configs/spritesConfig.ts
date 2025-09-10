import { lp } from "../utils/Utils";

export const gameBkgSpriteConfig = (): SpriteConfig => ({
  frame: "bkg.jpg",
});

export const reelShadowConfig = (x: number): SpriteConfig => ({
  frame: "reel_shadow.png",
  x,
  y: 750,
});

export const dockSpriteConfig = (): SpriteConfig => ({
  frame: "dock.png",
  x: 372,
  y: 648,
  scaleX: 1.5,
  scaleY: 1.5,
  anchor: { x: 0.5, y: 0 },
});

export const popupBkgConfig = (): SpriteConfig => ({
  atlas: "ui.png",
  frame: lp("error_l.png", "error_p.png"),
});

export const popupCloseButtonConfig = (): SpriteConfig => ({
  atlas: "ui.png",
  frame: "close_button.png",
  x: lp(570, 205),
  y: lp(-250, -155),
});

export const redIconConfig = (): SpriteConfig => ({
  atlas: "ui.png",
  frame: "red_triangle.png",
  y: lp(-200, -135),
  scaleX: lp(0.8, 0.5),
  scaleY: lp(0.8, 0.5),
});

export const iceCrackConfig = (): SpriteConfig => ({
  frame: "crack.png",
  x: 384,
  y: 370,
  anchor: { x: 0.5, y: 0.5 },
});

export const winTypeConfig = (): SpriteConfig => ({
  frame: "big_win.png",
  x: 384,
  y: 300,
  anchor: { x: 0.5, y: 0.5 },
});

export const iceCubeConfig = (x: number, y: number, isEven: boolean): SpriteConfig => ({
  frame: isEven ? "ice_1.png" : "ice_2.png",
  atlas: "slot_machine.png",
  x,
  y,
  anchor: { x: 0.5, y: 0.5 },
});

export const introIceCubeConfig = (x: number, isActive: boolean): SpriteConfig => ({
  frame: isActive ? "ice_win_1.png" : "ice_1.png",
  atlas: "slot_machine.png",
  x,
  y: 390,
  anchor: { x: 0.5, y: 0.5 },
  scaleX: 0.225,
  scaleY: 0.225,
});

export const introCardConfig = (frame: string, atlas: string): SpriteConfig => ({
  frame,
  atlas,
  scaleX: 0.666666,
  scaleY: 0.666666,
});

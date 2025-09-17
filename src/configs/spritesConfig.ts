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

export const dockLeftShadowConfig = (): SpriteConfig => ({
  frame: "shadow_left.png",
  x: -1175,
  y: 1085,
  scaleX: 1.5,
  scaleY: 1.5,
  anchor: { x: 0, y: 1 },
});

export const dockRightShadowConfig = (): SpriteConfig => ({
  frame: "shadow_right.png",
  x: 1635,
  y: 979,
  scaleX: 1.5,
  scaleY: 1.5,
  anchor: { x: 1, y: 1 },
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

export const uiPortraitBkgL = (): SpriteConfig => ({
  frame: "ui_bkg_l.png",
});

export const uiMenuBtnL = (): SpriteConfig => ({
  frame: "menu.png",
  atlas: "ui_l",
  name: "menu_button",
  x: -1231,
  y: 12,
});

export const uiButBonusBtnL = (): SpriteConfig => ({
  frame: "buy_bonus.png",
  atlas: "ui_l",
  name: "buy_bonus_button",
  x: 1231,
  y: 12,
});

export const betArrowBtnL = (type: "up" | "down"): SpriteConfig => ({
  frame: `arrow_${type}.png`,
  atlas: "ui_l",
  name: type,
  x: 150,
  y: type === "up" ? -30 : 50,
});

export const uiSpinBtnBkgL = (): SpriteConfig => ({
  frame: "spin_btn_bkg.png",
  atlas: "ui_l",
  name: "spin_button_background",
  x: -12,
  y: 9,
});

export const uiSpinBtnArrowL = (): SpriteConfig => ({
  frame: "spin_button.png",
  atlas: "ui_l",
  name: "spin_button_arrow",
  x: -12,
  y: -10,
});

export const uiSpinBtnStopL = (): SpriteConfig => ({
  frame: "spin_btn_stop.png",
  atlas: "ui_l",
  name: "spin_button_stop",
  x: -12,
  y: 0,
});

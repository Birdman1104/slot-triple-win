import { Point } from "pixi.js";
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

export const leafConfig = (): SpriteConfig => ({
  frame: "leaf.png",
  name: "leaf",
  anchor: { x: 1, y: 0 },
});

export const dockLeftShadowConfig = (): SpriteConfig => ({
  frame: "shadow_left.png",
  name: "leftShadow",
  x: -1175,
  y: 1085,
  scaleX: 1.5,
  scaleY: 1.5,
  anchor: { x: 0, y: 1 },
});

export const dockRightShadowConfig = (): SpriteConfig => ({
  frame: "shadow_right.png",
  name: "rightShadow",
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

export const portraitMenuCloseButtonConfig = (): SpriteConfig => ({
  atlas: "ui.png",
  frame: "close_button.png",
  x: 0,
  y: 0,
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
  y: 450,
  anchor: { x: 0.5, y: 0.5 },
  scaleX: 0.225,
  scaleY: 0.225,
});

export const introCardConfig = (frame: string, atlas: string): SpriteConfig => ({
  frame,
  atlas,
});

export const uiPortraitBkg = (type: "p" | "l"): SpriteConfig => ({
  frame: `ui_bkg_${type}.png`,
  alpha: 0.8,
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
  x: 160,
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
});

export const uiMenuBtnL = (): SpriteConfig => ({
  frame: "menu.png",
  atlas: "ui_l",
  name: "menu_button",
});

export const uiMenuCloseBtnL = (): SpriteConfig => ({
  frame: "menu_close.png",
  atlas: "ui_l",
  name: "menu_close_button",
});

export const uiMenuCloseBtnP = (): SpriteConfig => ({
  frame: "close_button.png",
  atlas: "ui",
  scaleX: 1.2,
  scaleY: 1.2,
  y: -9,
  name: "menu_close_button",
});

export const uiMenuBkgL = (): SpriteConfig => ({
  frame: "menu_bkg.png",
  atlas: "ui_l",
  name: "menu_background",
  anchor: new Point(0.5, 1.2),
});

export const uiMenuBkgP = (): SpriteConfig => ({
  frame: "menu_bkg_p.png",
  atlas: "ui_p",
  name: "menu_background",
  anchor: new Point(0.85, 0.125),
});

export const uiMenuButtonBkgL = (): SpriteConfig => ({
  frame: "icon_bkg.png",
  atlas: "ui_l",
  name: "icon_bkg",
  x: 100,
  y: 62,
});

export const uiMenuButtonL = (type: string): SpriteConfig => ({
  frame: type,
  atlas: "ui_l",
  name: type,
  x: 100,
  y: 54,
});

export const uiLineL = (x: number): SpriteConfig => ({
  frame: "line.png",
  atlas: "ui_l",
  name: "line_" + x,
  x,
});

export const uiAutoSpinsBkgL = (): SpriteConfig => ({
  frame: "multiple_spins_bkg.png",
  atlas: "ui_l",
  name: "multiple_spins_bkg",
});

export const uiAutoSpinsBkgPortrait = (): SpriteConfig => ({
  frame: "multiple_spins_bkg.png",
  atlas: "ui_l",
  name: "multiple_spins_bkg",
  scaleX: 0.6,
  scaleY: 0.6,
});

export const uiAutoSpinsIconPortrait = (): SpriteConfig => ({
  frame: "multiple_spins_icon.png",
  atlas: "ui_l",
  name: "multiple_spins_icon",
  y: -6,
  scaleX: 0.6,
  scaleY: 0.6,
});

export const uiAutoSpinsIconL = (): SpriteConfig => ({
  frame: "multiple_spins_icon.png",
  atlas: "ui_l",
  name: "multiple_spins_icon",
  y: -10,
});

export const uiMultipleNumbersBkgL = (): SpriteConfig => ({
  frame: "multiple_numbers_bkg.png",
  atlas: "ui_l",
  name: "multiple_numbers_bkg",
  anchor: { x: 0.5, y: 1.2 },
});

export const uiMultipleNumbersBkgPortrait = (): SpriteConfig => ({
  frame: "multiple_numbers_bkg_p.png",
  atlas: "ui_p",
  name: "multiple_numbers_bkg_p",
  anchor: { x: 0.2, y: 1.2 },
});

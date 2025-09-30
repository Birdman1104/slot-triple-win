import { CellAlign, CellScale } from "@armathai/pixi-grid";
import { isNarrowScreen, isSquareLikeScreen, lp } from "../../utils/Utils";

export const getUIViewGridConfig = () => {
  return lp(getUIViewGridLandscapeConfig, getUIViewGridPortraitConfig).call(null);
};

const getUIViewGridLandscapeConfig = () => {
  const bounds = { x: 0, y: 0, width: document.body.clientWidth, height: document.body.clientHeight };
  return {
    name: "ui",
    // debug: { color: 0xff0027 },
    bounds,
    cells: [
      {
        name: "ui_bar",
        bounds: { x: 0.075, y: 0.8, width: 0.85, height: 0.2 },
      },
      {
        name: "menu",
        bounds: { x: 0.9, y: 0, width: 0.1, height: 0.1 },
      },
    ],
  };
};

const getUIViewGridPortraitConfig = () => {
  let cellBounds = { x: -0.02, y: 0.715, width: 1.04, height: 0.295 };
  if (isSquareLikeScreen()) {
    cellBounds = { x: 0, y: 0.785, width: 1, height: 0.225 };
  } else if (isNarrowScreen()) {
    cellBounds = { x: -0.035, y: 0.715, width: 1.07, height: 0.285 };
  }

  const bounds = { x: 0, y: 0, width: document.body.clientWidth, height: document.body.clientHeight };
  return {
    name: "ui",
    // debug: { color: 0xff0027 },
    bounds,
    cells: [
      {
        name: "ui_bar",
        align: CellAlign.centerBottom,
        scale: CellScale.fit,
        bounds: cellBounds,
      },
      {
        name: "menu",
        bounds: { x: 0.85, y: 0, width: 0.15, height: 0.1 },
      },
    ],
  };
};

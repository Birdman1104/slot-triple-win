import { CellAlign, CellScale } from "@armathai/pixi-grid";
import { lp } from "../../utils/Utils";

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
        // align: CellAlign.centerBottom,
        // scale: CellScale.envelop,
        bounds: { x: 0.9, y: 0, width: 0.1, height: 0.1 },
      },
    ],
  };
};

const getUIViewGridPortraitConfig = () => {
  const bounds = { x: 0, y: 0, width: document.body.clientWidth, height: document.body.clientHeight };
  return {
    name: "ui",
    debug: { color: 0xff0027 },
    bounds,
    cells: [
      {
        name: "ui_bar",
        align: CellAlign.centerBottom,
        scale: CellScale.envelop,
        bounds: { x: 0, y: 0.82, width: 1, height: 0.19 },
      },
      {
        name: "menu",
        // align: CellAlign.centerBottom,
        // scale: CellScale.envelop,
        bounds: { x: 0.85, y: 0, width: 0.15, height: 0.1 },
      },
    ],
  };
};

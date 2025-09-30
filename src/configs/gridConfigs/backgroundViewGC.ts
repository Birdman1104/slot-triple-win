import { CellAlign, CellScale } from "@armathai/pixi-grid";
import { lp } from "../../utils/Utils";

export const getBackgroundGridConfig = () => {
  return lp(getBackgroundGridLandscapeConfig, getBackgroundGridPortraitConfig).call(null);
};

const getBackgroundGridLandscapeConfig = () => {
  const bounds = {
    x: 0,
    y: 0,
    width: document.body.clientWidth,
    height: document.body.clientHeight,
  };
  return {
    name: "background",
    // debug: { color: 0xd95027 },
    bounds,
    cells: [
      {
        name: "bkg",
        scale: CellScale.envelop,
        bounds: { x: 0, y: 0, width: 1, height: 1 },
      },
      {
        name: "leaf",
        bounds: { x: 0.6, y: 0, width: 0.4, height: 0.3 },
        align: CellAlign.rightTop,
        scale: CellScale.envelop,
      },
      {
        name: "left_shadow",
        bounds: { x: 0, y: 0.75, width: 0.3, height: 0.25 },
        align: CellAlign.leftBottom,
        scale: CellScale.envelop,
      },
      {
        name: "right_shadow",
        bounds: { x: 0.7, y: 0.75, width: 0.3, height: 0.25 },
        align: CellAlign.rightBottom,
        scale: CellScale.envelop,
      },
    ],
  };
};

const getBackgroundGridPortraitConfig = () => {
  const bounds = {
    x: 0,
    y: 0,
    width: document.body.clientWidth,
    height: document.body.clientHeight,
  };
  return {
    name: "background",
    // debug: { color: 0xd95027 },
    bounds,
    cells: [
      {
        name: "bkg",
        scale: CellScale.envelop,
        bounds: { x: 0, y: 0, width: 1, height: 1 },
      },
      {
        name: "leaf",
        bounds: { x: 0.7, y: 0, width: 0.3, height: 0.175 },
        align: CellAlign.rightTop,
        scale: CellScale.envelop,
      },
      {
        name: "left_shadow",
        bounds: { x: 0, y: 0.6, width: 1, height: 0.4 },
        align: CellAlign.leftBottom,
        scale: CellScale.showAll,
      },
      {
        name: "right_shadow",
        bounds: { x: 1, y: 0.7, width: 0.5, height: 0.3 },
        align: CellAlign.rightBottom,
        scale: CellScale.showAll,
      },
    ],
  };
};

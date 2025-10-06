import { CellAlign, CellScale } from "@armathai/pixi-grid";
import { isNarrowScreen, isSquareLikeScreen, lp } from "../../utils/Utils";

export const getGameViewGridConfig = () => {
  return lp(getGameViewGridLandscapeConfig, getGameViewGridPortraitConfig).call(null);
};

const getGameViewGridLandscapeConfig = () => {
  const bounds = { x: 0, y: 0, width: document.body.clientWidth, height: document.body.clientHeight };
  return {
    name: "game",
    // debug: { color: 0xd9ff27 },
    bounds,
    cells: [
      {
        name: "slot_machine",
        bounds: { x: 0, y: 0.1, width: 1, height: 0.7 },
      },
      {
        name: "dock",
        bounds: { x: 0, y: 0.1, width: 1, height: 0.7 },
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

const getGameViewGridPortraitConfig = () => {
  const bounds = { x: 0, y: 0, width: document.body.clientWidth, height: document.body.clientHeight };
  return {
    name: "game",
    // debug: { color: 0xd9ff27 },
    bounds,
    cells: [
      {
        name: "slot_machine",
        bounds: {
          x: isNarrowScreen() ? 0.01 : 0.1,
          y: isSquareLikeScreen() ? 0.1 : 0.15,
          width: isNarrowScreen() ? 0.98 : 0.8,
          height: 0.7,
        },
      },
      {
        name: "dock",
        bounds: { x: 0.3, y: 0.1, width: 0.4, height: 0.6 },
        scale: CellScale.envelop,
      },
      {
        name: "leaf",
        bounds: { x: 0.5, y: 0, width: 0.5, height: 0.3 },
        align: CellAlign.rightTop,
        scale: CellScale.showAll,
      },
      {
        name: "left_shadow",
        bounds: { x: 0, y: 0.7, width: 0.5, height: 0.3 },
        align: CellAlign.leftBottom,
        scale: CellScale.envelop,
      },
      {
        name: "right_shadow",
        bounds: { x: 0.5, y: 0.7, width: 0.5, height: 0.3 },
        align: CellAlign.rightBottom,
        scale: CellScale.showAll,
      },
    ],
  };
};

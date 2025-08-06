import { CellScale } from "@armathai/pixi-grid";
import { lp } from "../../utils/Utils";

export const getForegroundViewGridConfig = () => {
  return lp(getForegroundViewGridLandscapeConfig, getForegroundViewGridPortraitConfig).call(null);
};

const getForegroundViewGridLandscapeConfig = () => {
  const bounds = { x: 0, y: 0, width: document.body.clientWidth, height: document.body.clientHeight };
  return {
    name: "foreground",
    // debug: { color: 0xd91127 },
    bounds,
    cells: [
      {
        name: "popup",
        bounds: { x: 0, y: 0, width: 1, height: 1 },
      },
      {
        name: "blocker",
        bounds: { x: 0, y: 0, width: 1, height: 1 },
        scale: CellScale.fill,
      },
    ],
  };
};

const getForegroundViewGridPortraitConfig = () => {
  const bounds = { x: 0, y: 0, width: document.body.clientWidth, height: document.body.clientHeight };
  return {
    name: "foreground",
    // debug: { color: 0xd91127 },
    bounds,
    cells: [
      {
        name: "popup",
        bounds: { x: 0, y: 0, width: 1, height: 1 },
      },
      {
        name: "blocker",
        bounds: { x: 0, y: 0, width: 1, height: 1 },
        scale: CellScale.fill,
      },
    ],
  };
};

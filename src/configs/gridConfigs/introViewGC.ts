import { CellScale } from "@armathai/pixi-grid";
import { lp } from "../../utils/Utils";

export const getIntroViewGridConfig = () => {
  return lp(getIntroViewGridLandscapeConfig, getIntroViewGridPortraitConfig).call(null);
};

const getIntroViewGridLandscapeConfig = () => {
  const bounds = { x: 0, y: 0, width: document.body.clientWidth, height: document.body.clientHeight };
  return {
    name: "intro",
    // debug: { color: 0xd9ff27 },
    bounds,
    cells: [
      {
        name: "view",
        bounds: { x: 0, y: 0.15, width: 1, height: 0.8 },
      },
      {
        name: "overlay",
        bounds: { x: 0, y: 0, width: 1, height: 1 },
        scale: CellScale.fill,
      },
    ],
  };
};

const getIntroViewGridPortraitConfig = () => {
  const bounds = { x: 0, y: 0, width: document.body.clientWidth, height: document.body.clientHeight };
  return {
    name: "intro",
    // debug: { color: 0xd9ff27 },
    bounds,
    cells: [
      {
        name: "view",
        bounds: { x: 0, y: 0.1, width: 1, height: 0.85 },
      },
      {
        name: "overlay",
        bounds: { x: 0, y: 0, width: 1, height: 1 },
        scale: CellScale.fill,
      },
    ],
  };
};

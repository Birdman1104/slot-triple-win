import { CellScale } from "@armathai/pixi-grid";
import { isNarrowScreen, lp } from "../../utils/Utils";

export const getIntroViewGridConfig = () => {
  return lp(getIntroViewGridLandscapeConfig, getIntroViewGridPortraitConfig).call(null);
};

export const introLandscapeGridConfig = () => {
  const narrowConfigCards = {
    name: "cards",
    bounds: { x: 0.15, y: 0.15, width: 0.7, height: 0.7 },
  };

  const otherConfigCards = {
    name: "cards",
    bounds: { x: 0.1, y: 0.15, width: 0.8, height: 0.7 },
    scale: CellScale.showAll,
  };

  const narrowConfigShadows = {
    name: "shadows",
    bounds: { x: 0.125, y: 0.825, width: 0.75, height: 0.15 },
  };

  const otherConfigShadows = {
    name: "shadows",
    bounds: { x: 0.1, y: 0.775, width: 0.8, height: 0.15 },
    scale: CellScale.showAll,
  };

  const narrowConfigText = {
    name: "text",
    bounds: { x: 0.15, y: 0.875, width: 0.7, height: 0.1 },
  };

  const otherConfigText = {
    name: "text",
    bounds: { x: 0, y: 0.8, width: 1, height: 0.2 },
  };

  const bounds = { x: 0, y: 0, width: document.body.clientWidth, height: document.body.clientHeight };
  return {
    name: "intro_land",
    // debug: { color: 0x00ff27 },
    bounds,
    cells: [
      isNarrowScreen() ? narrowConfigCards : otherConfigCards,
      isNarrowScreen() ? narrowConfigShadows : otherConfigShadows,
      isNarrowScreen() ? narrowConfigText : otherConfigText,
    ],
  };
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
        bounds: { x: 0, y: 0, width: 1, height: 1 },
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

import { lp } from "../../utils/Utils";

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
        bounds: { x: 0, y: 0.15, width: 1, height: 0.7 },
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
        bounds: { x: 0.05, y: 0.1, width: 0.9, height: 0.7 },
      },
    ],
  };
};

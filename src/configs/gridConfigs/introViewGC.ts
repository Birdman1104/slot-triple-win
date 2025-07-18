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
        name: "cards",
        bounds: { x: 0, y: 0.15, width: 1, height: 0.6 },
      },
      {
        name: "click_to_continue",
        bounds: { x: 0, y: 0.8, width: 1, height: 0.15 },
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
        name: "cards",
        bounds: { x: 0, y: 0.825, width: 1, height: 0.15 },
      },
    ],
  };
};

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
    ],
  };
};

const getUIViewGridPortraitConfig = () => {
  const bounds = { x: 0, y: 0, width: document.body.clientWidth, height: document.body.clientHeight };
  return {
    name: "ui",
    // debug: { color: 0xff0027 },
    bounds,
    cells: [
      {
        name: "ui_bar",
        bounds: { x: 0.05, y: 0.1, width: 0.9, height: 0.7 },
      },
    ],
  };
};

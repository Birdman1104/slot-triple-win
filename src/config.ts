export const WIDTH = 264;
export const HEIGHT = 264;
export const OFFSET_Y = 0;
export const OFFSET_X = 8;

export const ScreenSizeConfig = Object.freeze({
  size: {
    app: {
      landscape: { width: 960, height: 640 },
      portrait: { width: 640, height: 960 },
    },
    game: {
      landscape: { width: 960, height: 640 },
      portrait: { width: 640, height: 960 },
    },
    ratio: { min: 0.1, max: 1 },
  },
});

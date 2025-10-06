import anime from "animejs";
import { DisplayObject, Graphics, Point, Rectangle, Sprite, Text, Texture } from "pixi.js";
import { SPRITESHEET } from "../assets/assetsNames/spritesheets";

export const parseBase64JsonToObject = (base64: string): any => {
  const slicedBase64 = base64.slice(29, base64.length);
  const convertedJson = atob(slicedBase64);
  const parsed = JSON.parse(convertedJson);
  return parsed;
};

export const lp = (l: any, p: any): any => {
  const { clientWidth: w, clientHeight: h } = document.body;
  return w > h ? l : p;
};

export const isLandscape = () => {
  const { clientWidth: w, clientHeight: h } = document.body;
  return w > h;
};

export const getTextureFromSpriteSheet = (atlas: string, key: string): Texture => {
  return SPRITESHEET[atlas].textures[key];
};

export const fitDimension = (
  dim: { width: number; height: number },
  minRatio: number,
  maxRatio: number
): { width: number; height: number } => {
  const ratioW = dim.width / dim.height;
  const ratioH = dim.height / dim.width;

  if (ratioW < ratioH) {
    if (ratioW > maxRatio) {
      dim.width = dim.width * (maxRatio / ratioW);
    } else if (ratioW < minRatio) {
      dim.height = dim.height * (ratioW / minRatio);
    }
  } else {
    if (ratioH > maxRatio) {
      dim.height = dim.height * (maxRatio / ratioH);
    } else if (ratioH < minRatio) {
      dim.width = dim.width * (ratioH / minRatio);
    }
  }
  return dim;
};

export const makeSprite = (config: SpriteConfig): Sprite => {
  const {
    frame,
    atlas = "",
    x = 0,
    y = 0,
    scaleX = 1,
    scaleY = 1,
    anchor = new Point(0.5, 0.5),
    tint = 0xffffff,
    alpha = 1,
    rotation = 0,
    name = "",
  } = config;

  const texture = SPRITESHEET[atlas] ? getTextureFromSpriteSheet(atlas, frame) : Texture.from(frame);
  const sprite = new Sprite(texture);
  sprite.position.set(x, y);
  sprite.scale.set(scaleX, scaleY);
  sprite.anchor.set(anchor.x, anchor.y);
  sprite.tint = tint;
  sprite.alpha = alpha;
  sprite.rotation = rotation;
  name && (sprite.name = name);
  return sprite;
};

export const drawBounds = (container: any, color = 0xffffff * Math.random(), alpha = 0.5): Graphics => {
  const { x, y, width, height } = container.getBounds();
  const gr = new Graphics();
  gr.beginFill(color, alpha);
  gr.drawRect(x, y, width, height);
  gr.endFill();
  container.addChild(gr);
  return gr;
};

export const drawPoint = (
  container: any,
  x: number,
  y: number,
  radius = 5,
  color = 0xffffff * Math.random(),
  alpha = 0.5
): Graphics => {
  const gr = new Graphics();
  gr.beginFill(color, alpha);
  gr.drawCircle(x, y, radius);
  gr.endFill();
  container.addChild(gr);
  return gr;
};

export const makeText = (config: TextConfig, name?: string): Text => {
  const { text: content, x = 0, y = 0, alpha = 1, style = {}, anchor = { x: 0.5, y: 0.5 } } = config;
  const text = new Text(content, style);
  text.position.set(x, y);
  text.anchor.set(anchor.x, anchor.y);
  text.alpha = alpha;
  name && (text.name = name);
  return text;
};

export const delayRunnable = (delay: number, runnable: Function, context?: any, ...args: any[]) => {
  let delayMS = delay * 1000;
  const delayWrapper = () => {
    delayMS -= window.game.ticker.deltaMS;
    if (delayMS <= 0) {
      runnable.call(context, ...args);
      window.game.ticker.remove(delayWrapper);
    }
  };
  window.game.ticker.add(delayWrapper);
  return delayWrapper;
};

export const loopRunnable = (runnable: Function, context?: any, ...args: any[]) => {
  return window.game.ticker.add(runnable, context, ...args);
};

export const removeRunnable = (runnable: Function, context?: any) => window.game.ticker.remove(runnable, context);

export const getGameBounds = () => {
  const { clientWidth: width, clientHeight: height } = document.body;
  return new Rectangle(0, 0, width, height);
};

export const isSquareLikeScreen = (): boolean => {
  const { width, height } = getGameBounds();
  return Math.min(width, height) / Math.max(width, height) > 0.7;
};

export const isNarrowScreen = (): boolean => {
  const { width, height } = getGameBounds();
  return Math.min(width, height) / Math.max(width, height) < 0.5;
};

export const getViewByProperty = (prop: string, value: string, parent?: DisplayObject): DisplayObject | null => {
  const { children } = parent || window.game.stage;

  if (!children || children.length === 0) {
    return null;
  }

  for (let i = 0; i < children.length; i += 1) {
    const child = children[i];
    if (child[prop] === value) {
      return child;
    }

    const view = getViewByProperty(prop, value, child);
    if (view) {
      return view;
    }
  }

  return null;
};

export const randomInt = (min: number, max: number): number => {
  const mi = Math.ceil(min);
  const ma = Math.floor(max);
  return Math.floor(Math.random() * (ma - mi + 1)) + mi;
};

export const shuffle = (arr: any[]): void => {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = randomInt(0, i);
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
};

export const callIfExists = (callback: any): void => {
  if (typeof callback === "function") {
    callback();
  }
};

export const drawRect = (
  container: any,
  x: number,
  y: number,
  w = 5,
  h = 5,
  color = 0xffffff * Math.random(),
  alpha = 0.5
): Graphics => {
  const gr = new Graphics();
  gr.beginFill(color, alpha);
  gr.drawRect(x, y, w, h);
  gr.endFill();
  container.addChild(gr);
  return gr;
};

export const sample = (arr: any[]): any => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const difference = (arrA: any[], arrB: any[]): any[] => {
  return arrA.filter((x) => !arrB.includes(x));
};

export const last = (arr: any[]): any => {
  return arr.slice(-1)[0];
};

export const showToggle = (obj: DisplayObject, scale = 1, cb?: () => void) => {
  return anime({
    targets: obj.scale,
    x: scale,
    y: scale,
    duration: 300,
    easing: "easeInOutSine",
    complete: () => {
      callIfExists(cb);
    },
  });
};

export const hideToggle = (obj: DisplayObject, cb?: () => void) => {
  return anime({
    targets: obj.scale,
    x: 0,
    y: 0,
    duration: 300,
    easing: "easeInOutSine",
    complete: () => {
      callIfExists(cb);
    },
  });
};

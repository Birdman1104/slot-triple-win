import { SYMBOL_TYPE } from "./configs/SymbolsConfig";
import type { Element } from "./views/ElementView";
import type { Ice } from "./views/IceView";

const elementWidth = 264;
const elementHeight = 264;

export const CONFIGS = Object.freeze({
  // WINNING LINES
  lines: [
    // STRAIGHT LINES
    [0, 0, 0],
    [1, 1, 1],
    [2, 2, 2],

    // DIAGONAL
    [0, 1, 2],
    [2, 1, 0],
  ],

  autoSpinValues: [200, 100, 50, 20, 10],

  elementWidth,
  elementHeight,
  elementOffsetY: 0,
  elementOffsetX: 2,

  slotMachineBounds: {
    x: 0,
    y: -10,
    width: 2.9 * elementWidth,
    height: 2.9 * elementHeight,
  },

  reelContainerX: 0,
  reelContainerY: 0,
  reelContainerScale: 0.95,

  reelContainerMask: {
    x: -13,
    y: -6,
    width: 3 * elementWidth,
    height: 2.9 * elementHeight - 20,
  },

  // INITIAL REELS CONFIG
  initialReelsConfig: {
    reels: [
      [SYMBOL_TYPE.LEMON, SYMBOL_TYPE.LEMON, SYMBOL_TYPE.LEMON],
      [SYMBOL_TYPE.CHERRY, SYMBOL_TYPE.CHERRY, SYMBOL_TYPE.CHERRY],
      [SYMBOL_TYPE.APPLE, SYMBOL_TYPE.APPLE, SYMBOL_TYPE.APPLE],
    ],
    winningInfo: [],
    totalWin: 0,
  },

  // DROPPING ELEMENTS ANIMATION CONFIG
  dropOldElementsDelay: 100,
  dropOldElementsDuration: 100,
  dropOldElementsEasing: () => {
    return (x: number): number => {
      const c1 = 1.5;
      const c3 = c1 + 1;
      return c3 * x * x * x - c1 * x * x;
    };
  },

  // DROPPING NEW ELEMENTS ANIMATION CONFIG
  dropNewElementsDelay: 100,
  dropNewElementsDuration: 100,
  dropNewElementsEasing: "easeInBack",

  // WINNING LINES ANIMATION / TIMELINE CONFIG
  winLinesTimelineConfig: {
    duration: 800,
    easing: "easeInBack",
    direction: "alternate",
    autoplay: false,
  },
  winElementAnimationConfig: (e: Element) => ({
    targets: e.scale,
    x: 1.35,
    y: 1.35,
    complete: () => e.endAnimation(),
  }),
  winIceAnimationConfig: (e: Ice) => ({
    targets: e.scale,
    x: 1.35,
    y: 1.35,
    begin: () => e.setWinIceTexture(),
    complete: () => e.setBasicIceTexture(),
  }),

  // INTRO CONFIG
  intro: {
    cards: [
      {
        image: {
          frame: "intro_1.png",
          atlas: "intro.png",
        },
        title: {
          text: "Max Win",
          x: -180,
          y: 40,
          anchor: { x: 0, y: 0.5 },
          style: { fontSize: 84, fill: "#ffffff", fontFamily: "JomhuriaRegular", letterSpacing: 1 },
        },
        description: {
          text: "This game offers a massive win potential of up to 333x your bet - hit the right combo and take home top prize.",
          x: 10,
          y: 80,
          anchor: { x: 0.5, y: 0 },
          style: {
            fontSize: 34,
            fill: "#ffffff",
            wordWrap: true,
            wordWrapWidth: 336,
            fontFamily: "JomhuriaRegular",
            letterSpacing: 1,
          },
        },
      },
      {
        image: {
          frame: "intro_2.png",
          atlas: "intro.png",
        },
        title: {
          text: "Join the Fun",
          x: -180,
          y: 40,
          anchor: { x: 0, y: 0.5 },
          style: { fontSize: 84, fill: "#ffffff", fontFamily: "JomhuriaRegular", letterSpacing: 1 },
        },
        description: {
          text: "This game offers a massive win potential of up to 333x your bet - hit the right combo and take home top prize.",
          x: 10,
          y: 80,
          anchor: { x: 0.5, y: 0 },
          style: {
            fontSize: 34,
            fill: "#ffffff",
            wordWrap: true,
            wordWrapWidth: 336,
            fontFamily: "JomhuriaRegular",
            letterSpacing: 1,
          },
        },
      },
      {
        image: {
          frame: "intro_3.png",
          atlas: "intro.png",
        },
        title: {
          text: "Bonus",
          x: -180,
          y: 40,
          anchor: { x: 0, y: 0.5 },
          style: { fontSize: 84, fill: "#ffffff", fontFamily: "JomhuriaRegular", letterSpacing: 1 },
        },
        description: {
          text: "This game offers a massive win potential of up to 333x your bet - hit the right combo and take home top prize.",
          x: 10,
          y: 80,
          anchor: { x: 0.5, y: 0 },
          style: {
            fontSize: 34,
            fill: "#ffffff",
            wordWrap: true,
            wordWrapWidth: 336,
            fontFamily: "JomhuriaRegular",
            letterSpacing: 1,
          },
        },
      },
    ],
  },
});

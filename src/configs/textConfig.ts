import { lp } from "../utils/Utils";

export const clickToContinueTextConfig = (x: number): TextConfig => ({
  text: "Click to continue",
  x,
  y: 460,
  anchor: { x: 0.5, y: 0.5 },
  style: { fontSize: 100, fill: "#ffffff", fontFamily: "JomhuriaRegular", letterSpacing: 1 },
});

export const clickToProceedTextConfig = (x: number, y: number): TextConfig => ({
  text: "Click to proceed",
  x,
  y,
  anchor: { x: 0.5, y: 0.5 },
  style: { fontSize: 72, fill: "#ffffff", fontFamily: "JomhuriaRegular", letterSpacing: 1 },
});

export const getTextConfig = (config: TextConfig): TextConfig => ({
  text: config.text,
  x: config.x,
  y: config.y,
  anchor: config.anchor,
  style: config.style,
});

export const errorTitleTextConfig = (): TextConfig => ({
  text: "Something went wrong",
  x: 0,
  y: lp(-60, -55),
  style: {
    fontSize: lp(102, 68),
    fill: 0xffffff,
    align: "center",
    fontFamily: "JomhuriaRegular",
    letterSpacing: 1,
  },
});

export const infoTitleTextConfig = (): TextConfig => ({
  text: "Information",
  x: 0,
  y: lp(-203, -150),
  style: {
    fontSize: lp(102, 68),
    fill: 0xffffff,
    align: "center",
    fontFamily: "JomhuriaRegular",
    letterSpacing: 1,
  },
});

export const infoTextTextConfig = (): TextConfig => ({
  text: "Some random information for the user. This is just a demo text. You can put anything here. This popup can be used for various purposes. For example, to inform the user about something important.",
  x: 0,
  y: lp(40, 5),
  style: {
    fontSize: lp(72, 44),
    fill: 0xffffff,
    align: "center",
    wordWrap: true,
    wordWrapWidth: lp(1200, 440),
    fontFamily: "JomhuriaRegular",
    letterSpacing: 1,
  },
});

export const errorTextTextConfig = (): TextConfig => ({
  text: "Something went wrong while processing your request. Don’t worry-it’s usually just a hiccup. Please try again, or check your connection if the problem continues.",
  x: 0,
  y: lp(90, 48),
  style: {
    fontSize: lp(72, 38),
    fill: 0xffffff,
    align: "center",
    wordWrap: true,
    wordWrapWidth: lp(1200, 440),
    fontFamily: "JomhuriaRegular",
    letterSpacing: 1,
  },
});

export const winTextConfig = (): TextConfig => ({
  text: "",
  x: 384,
  y: 500,
  anchor: { x: 0.5, y: 0.5 },
  style: {
    fontSize: 200,
    fill: "#ffffff",
    stroke: "#00a9aa",
    strokeThickness: 12,
    fontFamily: "JomhuriaRegular",
    letterSpacing: 1,
  },
});

export const multiplierTextConfig = (n: number, fill: string = "#00ffff"): TextConfig => ({
  text: `${n}x`,
  x: 512,
  y: 600,
  anchor: { x: 0.5, y: 0.5 },
  style: {
    fontSize: 200,
    fill,
    stroke: "#ffffff",
    strokeThickness: 12,
    fontFamily: "JomhuriaRegular",
    letterSpacing: 1,
  },
});

export const balanceTitleConfig = (): TextConfig => ({
  text: "Balance",
  x: 0,
  y: -40,
  anchor: { x: 0.5, y: 0.5 },
  alpha: 0.7,
  style: {
    fontSize: 80,
    fill: "#ffffff",
    fontFamily: "JomhuriaRegular",
    letterSpacing: 1,
  },
});

export const betTitleConfig = (): TextConfig => ({
  text: "Bet",
  x: 0,
  y: -40,
  anchor: { x: 0.5, y: 0.5 },
  alpha: 0.7,
  style: {
    fontSize: 80,
    fill: "#ffffff",
    fontFamily: "JomhuriaRegular",
    letterSpacing: 1,
  },
});

export const balanceTextConfig = (): TextConfig => ({
  text: "$0",
  x: 0,
  y: 20,
  anchor: { x: 0.5, y: 0.5 },
  style: {
    fontSize: 125,
    fill: "#ffffff",
    fontFamily: "JomhuriaRegular",
    letterSpacing: 1,
  },
});

export const betTextConfig = (): TextConfig => ({
  text: "$0",
  x: 0,
  y: 20,
  anchor: { x: 0.5, y: 0.5 },
  style: {
    fontSize: 125,
    fill: "#ffffff",
    fontFamily: "JomhuriaRegular",
    letterSpacing: 1,
  },
});

export const menuButtonTextConfig = (text: string, fontSize = 100): TextConfig => ({
  text,
  x: 180,
  y: 51,
  anchor: { x: 0, y: 0.5 },
  style: {
    align: "left",
    fontSize,
    fill: "#ffffff",
    fontFamily: "JomhuriaRegular",
    letterSpacing: 1,
  },
});

export const autoSpinsTextConfig = (text = ""): TextConfig => ({
  text,
  y: -14,
  anchor: { x: 0.5, y: 0.5 },
  style: {
    fontSize: 100,
    fill: "#ffffff",
    fontFamily: "JomhuriaRegular",
    letterSpacing: 1,
  },
});

export const autoSpinsTextConfigPortrait = (x = 0, y = -6, text = ""): TextConfig => ({
  text,
  y,
  x,
  anchor: { x: 0.5, y: 0.5 },
  style: {
    fontSize: 60,
    fill: "#ffffff",
    fontFamily: "JomhuriaRegular",
    letterSpacing: 1,
  },
});

export const autoSpinsButtonTextConfig = (x: number, y: number, fontSize: number, text = ""): TextConfig => ({
  text,
  x,
  y,
  anchor: { x: 0.5, y: 0.5 },
  style: {
    fontSize,
    fill: "#ffffff",
    fontFamily: "JomhuriaRegular",
    letterSpacing: 1,
  },
});

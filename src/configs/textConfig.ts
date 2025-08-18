import { lp } from "../utils/Utils";

export const clickToContinueTextConfig = (x: number, y: number): TextConfig => ({
  text: "Click to continue",
  x,
  y,
  anchor: { x: 0.5, y: 0.5 },
  style: { fontSize: 72, fill: "#ffffff", fontFamily: "JomhuriaRegular", letterSpacing: 1 },
});

export const clickToProceedTextConfig = (x: number, y: number): TextConfig => ({
  text: "Click to proceed",
  x,
  y,
  anchor: { x: 0.5, y: 0.5 },
  style: { fontSize: 72, fill: "#ffffff", fontFamily: "JomhuriaRegular", letterSpacing: 1 },
});

export const introCardTitleTextConfig = (title: string): TextConfig => ({
  text: title,
  x: -180,
  y: 40,
  anchor: { x: 0, y: 0.5 },
  style: { fontSize: 84, fill: "#ffffff", fontFamily: "JomhuriaRegular", letterSpacing: 1 },
});

export const introCardDescriptionTextConfig = (description: string, y: number, wordWrapWidth: number): TextConfig => ({
  text: description,
  x: 10,
  y,
  anchor: { x: 0.5, y: 0 },
  style: {
    fontSize: 34,
    fill: "#ffffff",
    wordWrap: true,
    wordWrapWidth,
    fontFamily: "JomhuriaRegular",
    letterSpacing: 1,
  },
});

export const errorTitleTextConfig = (): TextConfig => ({
  text: "Something went wrong",
  x: 0,
  y: lp(-25, -25),
  style: {
    fontSize: lp(26, 20),
    fill: 0xffffff,
    align: "center",
    fontFamily: "JomhuriaRegular",
    letterSpacing: 1,
  },
});

export const errorTextTextConfig = (): TextConfig => ({
  text: "Something went wrong while processing your request. Don’t worry-it’s usually just a hiccup. Please try again, or check your connection if the problem continues.",
  x: 0,
  y: lp(40, 33),
  style: {
    fontSize: lp(20, 14),
    fill: 0xffffff,
    align: "center",
    wordWrap: true,
    wordWrapWidth: lp(600, 230),
    fontFamily: "JomhuriaRegular",
    letterSpacing: 1,
  },
});

export const winTextConfig = (): TextConfig => ({
  text: "",
  x: 384,
  y: 370,
  anchor: { x: 0.5, y: 0.5 },
  style: {
    fontSize: 200,
    fill: "#ffffff",
    fontFamily: "JomhuriaRegular",
    letterSpacing: 1,
  },
});

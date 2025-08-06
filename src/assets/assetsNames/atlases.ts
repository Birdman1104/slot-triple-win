// @ts-nocheck

import introJson from "../atlas/intro.json";
import introPng from "../atlas/intro.png?inline";

import slotMachineJson from "../atlas/slotMachine.json";
import slotMachinePng from "../atlas/slotMachine.png?inline";

import symbolsJson from "../atlas/symbols.json";
import symbolsPng from "../atlas/symbols.png?inline";

import uiJson from "../atlas/ui.json";
import uiPng from "../atlas/ui.png?inline";

export const ATLASES = [
  { name: "intro", img: introPng, json: introJson },
  { name: "slotMachine", img: slotMachinePng, json: slotMachineJson },
  { name: "symbols", img: symbolsPng, json: symbolsJson },
  { name: "ui", img: uiPng, json: uiJson },
];

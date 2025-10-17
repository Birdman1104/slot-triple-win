declare module "stats.js";
interface Window {
  game: Application;
}

type Dimensions = {
  width: number;
  height: number;
};

type AssetNameAndPath = {
  name: string;
  path: string;
};

type SpriteConfig = {
  frame: string;
  atlas?: string;
  x?: number;
  y?: number;
  scaleX?: number;
  scaleY?: number;
  anchor?: Point;
  tint?: number;
  alpha?: number;
  rotation?: number;
  name?: string;
};

interface TextConfig {
  text: string;
  x?: number;
  y?: number;
  alpha?: number;
  anchor?: { x: number; y: number };
  style: Partial<ITextStyle>;
}

type ServerResponse = {
  id?: number;
  win: number;
  multiplier: number;
  grid: SYMBOL_TYPE[][];
  wins: { symbol: SYMBOL_TYPE; win: number }[];
};

type ReelsResult = ReelResult[];
type ReelResult = string[];
type WinningLine = number[];

type SpinResult = {
  reels: ReelsResult;
  winningInfo: WinningInfo[];
  totalWin: number;
};

type WinningItemsCount = {
  count: number;
  elementType: string;
  line: number[];
};

type WinningInfo = {
  symbol: string;
  winAmount: number;
  line: WinningLine;
  id: string;
};

type ElementWeightRatio = {
  id: string;
  from: number;
  to: number;
};

type PlayerInfo = {
  balance: number;
  bet: number;
  id: number;
};

type ErrorResult = {
  errorText: string;
  errorCode: number;
};

type InitResponse = {
  session_id: string;
  game_name: string;
};

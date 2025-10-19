import { lego } from "@armathai/lego";
import { GLOBALS } from "../configs/constants";
import { SYMBOL_MAP, SYMBOL_TYPE } from "../configs/SymbolsConfig";
import { UIEvents } from "../events/MainEvents";
import { updatePageTitle } from "../utils/Utils";

const LINES = [
  // STRAIGHT LINES
  [0, 0, 0],
  [1, 1, 1],
  [2, 2, 2],

  // DIAGONAL
  [0, 1, 2],
  [2, 1, 0],
];

export const getError = (): Promise<ErrorResult> => {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve({
        errorText: "An error occurred, please reload the page or contact support",
        errorCode: Math.ceil(Math.random() * 150 + 400),
      });
    }, 50)
  );
};

export const spin = async (bet: number): Promise<SpinResult | undefined> => {
  try {
    const response = await fetch("https://20.121.53.139/api/play/bet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session_id: sessionStorage.getItem(GLOBALS.sessionIdKey) || "",
        game_name: GLOBALS.gameName,
        amount: bet,
      }),
    });
    const data = await response.json();
    const { spin_result, wins, payout } = data;
    const reels = new Array(3).fill(null).map(() => new Array(3).fill(null));
    spin_result.forEach((col: string[], colIndex: number) => {
      col.forEach((symbol: string, rowIndex: number) => {
        reels[rowIndex][colIndex] = SYMBOL_MAP[symbol as keyof typeof SYMBOL_MAP];
      });
    });

    const winningInfo = wins.map((win: WinInfo) => {
      const line = LINES[win.payline_index];
      return {
        symbol: SYMBOL_MAP[win.symbol as keyof typeof SYMBOL_MAP],
        winAmount: win.payout,
        line,
        id: `${SYMBOL_MAP[win.symbol as keyof typeof SYMBOL_MAP]}-${line.join("-")}`,
      };
    });

    const totalWin = payout;

    return {
      reels,
      winningInfo,
      totalWin,
    };
  } catch (error) {
    console.error("Error fetching initial data:", error);
  }
};

export const getDefaultReelsConfig = (): SpinResult => {
  return {
    reels: [
      [SYMBOL_TYPE.LEMON, SYMBOL_TYPE.LEMON, SYMBOL_TYPE.LEMON],
      [SYMBOL_TYPE.CHERRY, SYMBOL_TYPE.CHERRY, SYMBOL_TYPE.CHERRY],
      [SYMBOL_TYPE.APPLE, SYMBOL_TYPE.APPLE, SYMBOL_TYPE.APPLE],
    ],
    winningInfo: [],
    totalWin: 0,
  };
};

// TODO _ refactor this func
export const sendInitRequest = async (): Promise<boolean> => {
  const data = await initRequest();

  if (!data) {
    return false;
  }

  const { session_id, game_name } = data;

  GLOBALS.sessionIdKey = `${game_name}_session_id`;
  sessionStorage.setItem(GLOBALS.sessionIdKey, session_id);

  const formattedGameName = game_name
    .split("_")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  updatePageTitle(formattedGameName);
  GLOBALS.gameName = game_name;

  return true;
};

export const getDefaultPlayerInfo = async (): Promise<PlayerInfo> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        balance: Math.random() * 1000 - 500 + DEFAULT_BALANCE,
        bet: DEFAULT_BET,
        id: Math.random() * 1000,
      });
    }, 100);
  });
};

const initRequest = async (): Promise<InitResponse | undefined> => {
  try {
    const response = await fetch("https://20.121.53.139/api/play/init", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        player_id: "dummy",
        game_id: "1",
        currency: "amd",
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    lego.event.emit(UIEvents.ShowInitialError, error);
    console.error("Error fetching initial data:", error);
  }
};

export const getSlotMachineInitialConfig = () => {
  return { reels: getDefaultReelsConfig().reels };
};

export const BETS = [1, 2, 3, 4, 5, 10, 20, 50, 100, 200, 250, 500, 1000, 2000];
export const DEFAULT_BET = 1;
export const DEFAULT_BALANCE = 1000;

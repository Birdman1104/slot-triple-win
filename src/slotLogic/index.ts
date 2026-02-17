import { BASE_URL, GLOBALS } from "../configs/constants";
import { COCKTAILS_MAP, SYMBOL_MAP } from "../configs/SymbolsConfig";
import { CONFIGS } from "../GameConfig";
import { updatePageTitle } from "../utils/Utils";

export class SpinError extends Error {
  public readonly errorCode: number;
  public readonly errorText: string;

  constructor(errorCode: number, errorText: string) {
    super(errorText);
    this.name = "SpinError";
    this.errorCode = errorCode;
    this.errorText = errorText;
  }

  toErrorResult(): ErrorResult {
    return {
      errorCode: this.errorCode,
      errorText: this.errorText,
    };
  }
}

export const spin = async (bet: number): Promise<SpinResult> => {
  const response = await fetch(BASE_URL + "api/play/bet", {
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

  if (!response.ok) {
    throw new SpinError(response.status, `Server error: ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.spin_result || !Array.isArray(data.wins)) {
    throw new SpinError(500, "Invalid response from server");
  }
  // @NOTE: coctails win, mock!
  // const data = {
  //   spin_result: [
  //     ["LE", "GI", "LE"],
  //     ["LE", "GI", "LE"],
  //     ["LE", "WH", "LE"],
  //   ],
  //   wins: [
  //     {
  //       payline_index: 1,
  //       symbol: "Mojito",
  //       payout: 200,
  //       multiplier: 4,
  //     },
  // {
  //   payline_index: -1,
  //   symbol: "Whiskey Gin Sour",
  //   payout: 2000,
  //   multiplier: 11,
  // },
  // {
  //   payline_index: -1,
  //   symbol: "Blueberry Gin Fizz",
  //   payout: 2000,
  //   multiplier: 3,
  // },
  // {
  //   payline_index: -1,
  //   symbol: "Strawberry Gin Smash",
  //   payout: 2000,
  //   multiplier: 14,
  // },
  // {
  //   payline_index: -1,
  //   symbol: "Cherry Caipiroska",
  //   payout: 2000,
  //   multiplier: 26,
  // },
  //   ],
  //   payout: 2000,
  // };

  const { spin_result, wins, payout } = data;

  const reels = new Array(3).fill(null).map(() => new Array(3).fill(null));
  spin_result.forEach((col: string[], colIndex: number) => {
    col.forEach((symbol: string, rowIndex: number) => {
      reels[rowIndex][colIndex] = SYMBOL_MAP[symbol as keyof typeof SYMBOL_MAP];
    });
  });

  const winningInfo = wins
    .map((win: WinInfo) => {
      const { payline_index } = win;
      if (payline_index === -1) {
        return {
          symbol: COCKTAILS_MAP[win.symbol as keyof typeof COCKTAILS_MAP],
          winAmount: win.payout,
          id: `${COCKTAILS_MAP[win.symbol as keyof typeof COCKTAILS_MAP]}`,
          multiplier: win.multiplier,
        };
      } else {
        const line = CONFIGS.lines[win.payline_index];
        if (!line) {
          console.warn(`Invalid payline_index: ${win.payline_index}`);
          return null;
        }
        return {
          symbol: SYMBOL_MAP[win.symbol as keyof typeof SYMBOL_MAP],
          winAmount: win.payout,
          line,
          id: `${SYMBOL_MAP[win.symbol as keyof typeof SYMBOL_MAP]}-${line.join("-")}`,
        };
      }
    })
    .filter(Boolean) as WinningInfo[];

  return {
    reels,
    winningInfo,
    totalWin: payout,
  };
};

export const sendInitRequest = async (): Promise<boolean> => {
  const data = await initRequest();

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

export const getDefaultPlayerData = async (): Promise<PlayerData> => {
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

const initRequest = async (): Promise<InitResponse> => {
  const response = await fetch(BASE_URL + "api/play/init", {
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

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  const data = await response.json();
  return data;
};

export const BETS = [1, 2, 3, 4, 5, 10, 20, 50, 100, 200, 250, 500, 1000, 2000];
export const DEFAULT_BET = 1;
export const DEFAULT_BALANCE = 1000;

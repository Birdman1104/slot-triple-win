import { BASE_URL, GLOBALS } from "../configs/constants";
import { COCKTAILS_MAP, SYMBOL_MAP, SYMBOL_TYPE } from "../configs/SymbolsConfig";
import { updatePageTitle } from "../utils/Utils";

export const LINES = [
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
    }, 50),
  );
};

export const spin = async (bet: number): Promise<SpinResult | undefined> => {
  try {
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
    const data = await response.json();
    // const data = {
    //   spin_result: [
    //     ["ST", "ST", "ST"],
    //     ["ST", "ST", "LE"],
    //     ["ST", "ST", "ST"],
    //   ],

    //   wins: [
    //     {
    //       payline_index: 0,
    //       symbol: "ST",
    //       payout: 1,
    //     },
    //     {
    //       payline_index: 2,
    //       symbol: "ST",
    //       payout: 1,
    //     },
    //     {
    //       payline_index: 3,
    //       symbol: "ST",
    //       payout: 1,
    //     },
    //     {
    //       payline_index: 4,
    //       symbol: "ST",
    //       payout: 1,
    //     },
    //   ],
    //   payout: 50,
    // };
    // const data = {
    //   spin_result: [
    //     ["LE", "GI", "LE"],
    //     ["LE", "GI", "LE"],
    //     ["LE", "WH", "LE"],
    //   ],
    //   wins: [
    //     {
    //       payline_index: -1,
    //       symbol: "Mojito",
    //       payout: 200,
    //       multiplier: 4,
    //     },
    //     {
    //       payline_index: -1,
    //       symbol: "Whiskey Gin Sour",
    //       payout: 2000,
    //       multiplier: 11,
    //     },
    //     {
    //       payline_index: -1,
    //       symbol: "Blueberry Gin Fizz",
    //       payout: 2000,
    //       multiplier: 3,
    //     },
    //     {
    //       payline_index: -1,
    //       symbol: "Strawberry Gin Smash",
    //       payout: 2000,
    //       multiplier: 14,
    //     },
    //     {
    //       payline_index: -1,
    //       symbol: "Cherry Caipiroska",
    //       payout: 2000,
    //       multiplier: 26,
    //     },
    //   ],
    //   payout: 2000,
    // };
    //     : {
    //         spin_result: [
    //           ["BB", "BB", "BB"],
    //           ["BB", "BB", "VO"],
    //           ["BB", "VO", "VO"],
    //         ],
    //         wins: [
    //           {
    //             payline_index: 0,
    //             symbol: "Blackberry",
    //             payout: 10,
    //           },
    //           {
    //             payline_index: 4,
    //             symbol: "Blackberry",
    //             payout: 10,
    //           },
    //         ],
    //         payout: 20,
    //       };
    const { spin_result, wins, payout } = data;
    const reels = new Array(3).fill(null).map(() => new Array(3).fill(null));
    spin_result.forEach((col: string[], colIndex: number) => {
      col.forEach((symbol: string, rowIndex: number) => {
        reels[rowIndex][colIndex] = SYMBOL_MAP[symbol as keyof typeof SYMBOL_MAP];
      });
    });

    const winningInfo = wins.map((win: WinInfo) => {
      const { payline_index } = win;
      if (payline_index === -1) {
        return {
          symbol: COCKTAILS_MAP[win.symbol as keyof typeof COCKTAILS_MAP],
          winAmount: win.payout,
          id: `${COCKTAILS_MAP[win.symbol as keyof typeof COCKTAILS_MAP]}`,
          multiplier: win.multiplier,
        };
      } else {
        const line = LINES[win.payline_index];
        return {
          symbol: SYMBOL_MAP[win.symbol as keyof typeof SYMBOL_MAP],
          winAmount: win.payout,
          line,
          id: `${SYMBOL_MAP[win.symbol as keyof typeof SYMBOL_MAP]}-${line.join("-")}`,
        };
      }
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

export const getSlotMachineInitialConfig = () => {
  return { reels: getDefaultReelsConfig().reels };
};

export const BETS = [1, 2, 3, 4, 5, 10, 20, 50, 100, 200, 250, 500, 1000, 2000];
export const DEFAULT_BET = 1;
export const DEFAULT_BALANCE = 1000;

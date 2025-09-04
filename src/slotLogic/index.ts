import { DEFAULT_BET, SYMBOL_TYPE, SYMBOLS_MULTIPLIERS } from "../configs/SymbolsConfig";

const REELS_AMOUNT = 3;
const ROWS_AMOUNT = 3;

let i = 0;

const LINES = [
  // STRAIGHT LINES
  [0, 0, 0],
  [1, 1, 1],
  [2, 2, 2],

  // DIAGONAL
  [0, 1, 2],
  [2, 1, 0],
];

const getReelsData = (): SYMBOL_TYPE[][] => {
  const symbolTypes = Object.values(SYMBOL_TYPE);
  const arr = generateRandomArray();
  const grid = new Array(3).fill(null).map(() => new Array(3).fill(null));
  arr.forEach((value, index) => {
    const i = Math.floor(index / 3);
    const j = index % 3;
    grid[i][j] = symbolTypes[value];
  });

  return grid;
};

const generateRandomArray = (): number[] => {
  const result: number[] = [];
  const counts: { [key: number]: number } = {};
  const length = Object.keys(SYMBOL_TYPE).length;

  for (let i = 0; i < length; i++) {
    counts[i] = 0;
  }

  while (result.length < 9) {
    const randomInt = Math.floor(Math.random() * length);
    if (counts[randomInt] < 3) {
      result.push(randomInt);
      counts[randomInt]++;
    }
  }

  return result;
};

const winningItemsCount = (data: { elements: string[]; line: number[] }): WinningItemsCount => {
  let count = 1;
  const elementType = data.elements[0];
  for (let i = 1; i < data.elements.length; i++) {
    const e = data.elements[i];
    if (e === elementType) {
      count++;
    } else {
      break;
    }
  }
  return { count, elementType, line: data.line };
};

const checkWinnings = (reelData: ReelsResult): WinningItemsCount[] => {
  const lines = LINES.map((line) => {
    return {
      elements: line.map((r, c) => reelData[c][r]),
      line,
    };
  });
  const linesInfo = lines.map((l) => winningItemsCount(l));
  return linesInfo.filter((l) => l.count >= 3);
};

export const spin = async (bet: number): Promise<SpinResult> => {
  const reels =
    i % 3 === 0
      ? [
          [SYMBOL_TYPE.BLUEBERRY, SYMBOL_TYPE.GIN, SYMBOL_TYPE.WHISKEY],
          [SYMBOL_TYPE.BLUEBERRY, SYMBOL_TYPE.BLUEBERRY, SYMBOL_TYPE.VODKA],
          [SYMBOL_TYPE.BLUEBERRY, SYMBOL_TYPE.STRAWBERRY, SYMBOL_TYPE.BLUEBERRY],
        ]
      : getReelsData();
  i++;
  const winningLines = checkWinnings(reels);

  const winningInfo = winningLines.map(({ elementType, line }) => {
    const winAmount = bet * SYMBOLS_MULTIPLIERS[elementType as keyof typeof SYMBOLS_MULTIPLIERS];
    return {
      symbol: elementType,
      line,
      winAmount: Math.random() > 0.5 ? winAmount * 3 : winAmount,
      id: `${elementType}-${line.join("-")}`,
    };
  });

  const totalWin = winningInfo.reduce((acc, curr) => acc + curr.winAmount, 0);

  return new Promise((resolve) =>
    setTimeout(() => {
      resolve({
        reels,
        winningInfo,
        totalWin,
      });
    }, 10)
  );
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

export const getDefaultPlayerInfo = async (): Promise<any> => {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve({
        balance: 10000,
        bet: DEFAULT_BET,
        id: Math.random() * 1000,
      });
    }, 100)
  );
};

export const getSlotMachineInitialConfig = () => {
  return { reels: getDefaultReelsConfig().reels };
};

export enum SYMBOL_TYPE {
  APPLE = "apple",
  BLUEBERRY = "blueberry",
  CHERRY = "cherry",
  LEMON = "lemon",
  STRAWBERRY = "strawberry",
  WATERMELON = "watermelon",
  // BLACKBERRY = "blackberry",
  // GRAPE = "grape",
  VODKA = "vodka",
  GIN = "gin",
  WHISKEY = "whiskey",
}

export const SYMBOLS_MULTIPLIERS = {
  [SYMBOL_TYPE.WHISKEY]: 20,
  [SYMBOL_TYPE.GIN]: 15,
  [SYMBOL_TYPE.VODKA]: 10,
  // [SYMBOL_TYPE.GRAPE]: 8,
  [SYMBOL_TYPE.WATERMELON]: 7,
  [SYMBOL_TYPE.APPLE]: 6,
  [SYMBOL_TYPE.BLUEBERRY]: 5,
  // [SYMBOL_TYPE.BLACKBERRY]: 4,
  [SYMBOL_TYPE.LEMON]: 3,
  [SYMBOL_TYPE.STRAWBERRY]: 2,
  [SYMBOL_TYPE.CHERRY]: 1,
};

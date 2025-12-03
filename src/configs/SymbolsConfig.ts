export enum SYMBOL_TYPE {
  APPLE = "apple",
  BLACKBERRY = "blackberry",
  CHERRY = "cherry",
  LEMON = "lemon",
  STRAWBERRY = "strawberry",
  WATERMELON = "watermelon",
  VODKA = "vodka",
  GIN = "gin",
  WHISKEY = "whiskey",
}
export enum COCKTAIL_TYPE {
  MOJITO = "mojito",
  WHISKEY_SOUR = "whiskey_sour",
  BLUEBERRY_GIN_FIZZ = "blueberry_gin_fizz",
  STRAWBERRY_GIN_SMASH = "strawberry_gin_smash",
  CHERRY_CAIPIROSKA = "cherry_caipiroska",
}

export const SYMBOL_MAP = {
  LE: SYMBOL_TYPE.LEMON,
  CH: SYMBOL_TYPE.CHERRY,
  AP: SYMBOL_TYPE.APPLE,
  ST: SYMBOL_TYPE.STRAWBERRY,
  BB: SYMBOL_TYPE.BLACKBERRY,
  WA: SYMBOL_TYPE.WATERMELON,
  VO: SYMBOL_TYPE.VODKA,
  GI: SYMBOL_TYPE.GIN,
  WH: SYMBOL_TYPE.WHISKEY,
};

export const COCKTAILS_MAP = {
  Mojito: COCKTAIL_TYPE.MOJITO,
  "Whiskey Gin Sour": COCKTAIL_TYPE.WHISKEY_SOUR,
  "Blueberry Gin Fizz": COCKTAIL_TYPE.BLUEBERRY_GIN_FIZZ,
  "Strawberry Gin Smash": COCKTAIL_TYPE.STRAWBERRY_GIN_SMASH,
  "Cherry Caipiroska": COCKTAIL_TYPE.CHERRY_CAIPIROSKA,
};

# Triple Win Slot

A 3×3 slot game built with Pixi.js, Lego (event/command framework), and Anime.js

## Tech Stack

- **Pixi.js** – 2D WebGL rendering
- **@armathai/lego** – Event-driven architecture, observable models, command mapping
- **@armathai/pixi-grid** – Responsive layout // Will add the docs for this later
- **Anime.js** – Animations (Make sure to use v3 docs - https://animejs.com/v3/documentation/)
- **Howler** – Audio
- **Vite** – Build tooling

---

## Project Structure

```
src/
├── app.ts                 # Application bootstrap, asset loading, resize handling
├── main.ts                # Entry point
├── MainStage.ts           # Root stage, manages Intro/Game views, UI layout
├── GameConfig.ts          # Game-specific config (paylines, initial reels)
├── config.ts              # Layout constants (WIDTH, HEIGHT, screen sizes)
│
├── assets/                # All game assets
│   ├── assetsNames/       # Asset registration (atlases, images, audio)
│   ├── atlas/             # Packed texture atlases (generated)
│   ├── images/            # Source images for atlases
│   └── uncompressed/      # Non-packed images (backgrounds, etc.)
│
├── commands/              # Event → Command mapping
│   ├── eventCommandPairs.ts   # Binds events to command handlers
│   └── GameCommands.ts        # Command implementations
│
├── configs/               # Configuration files
│   ├── constants.ts       # API URL, globals
│   ├── SymbolsConfig.ts   # Symbol enums, server→client mapping
│   ├── spritesConfig.ts   # Sprite configs (position, atlas, frame)
│   ├── textConfig.ts      # Text styles
│   └── gridConfigs/       # Layout configs per view (portrait/landscape)
│
├── events/                # Event name constants
│   ├── MainEvents.ts      # UI, game, slot machine events
│   └── ModelEvents.ts     # Model change events
│
├── models/                # Data layer (observable)
│   ├── Head.ts            # Root model, holds GameModel, PlayerModel, SoundModel
│   ├── GameModel.ts       # Game state, slot machine lifecycle
│   ├── SlotMachineModel.ts
│   ├── ReelModel.ts
│   ├── ElementModel.ts
│   ├── PlayerModel.ts
│   ├── SoundModel.ts
│   └── ObservableModel.ts # Base class for Lego observables
│
├── slotLogic/             # Spin logic, API communication
│   └── index.ts           # spin(), init, symbol mapping, BETS, defaults
│
├── utils/
│   ├── Utils.ts           # Helpers (makeSprite, lp, fitDimension, etc.)
│   └── SoundController.ts
│
└── views/                 # Pixi display objects
    ├── BackgroundView.ts
    ├── ForegroundView.ts  # Popups, overlays
    ├── GameView.ts        # Game screen, slot machine + dock
    ├── SlotMachineView.ts # Reels, win lines, animations
    ├── SlotForeground.ts  # Win presentation (cocktails, symbols)
    ├── ReelView.ts        # Single reel column
    ├── ElementView.ts     # Single symbol display
    ├── DockView.ts
    ├── IntroView.ts       # Intro screens (landscape/portrait)
    ├── IntroCard.ts
    └── ui/                # UI components (buttons, balance, bet, menu)
```

---

## Data Flow

```
User Action → Event → Command → Model Update → Observable Emit → View Update
```

Example (spin):

1. User clicks spin → `UIEvents.SpinButtonClick`
2. `onSpinButtonClickCommand` runs → `PlayerModel.spin()`, `SlotMachineModel.spin(bet)`
3. `SlotMachineModel` calls `spin()` in slotLogic → API request
4. `SlotMachineModel` receives result → `spinResult`, `reels` update
5. `SlotMachineModelEvents.StateUpdate` / `SpinResultUpdate` emitted
6. `SlotMachineView` reacts → drop animations, win lines, win presentation

---

## Key Files for Game Customization

| File                       | Purpose                                                      |
| -------------------------- | ------------------------------------------------------------ |
| `GameConfig.ts`            | Paylines, initial reel layout                                |
| `configs/SymbolsConfig.ts` | Symbol types, server→client mapping                          |
| `configs/constants.ts`     | API base URL                                                 |
| `slotLogic/index.ts`       | BETS, DEFAULT_BET, DEFAULT_BALANCE, spin/init logic          |
| `configs/spritesConfig.ts` | Sprite positions, atlases, frames                            |
| `views/ElementView.ts`     | Symbol rendering (atlas: `symbols.png`, frame: `{type}.png`) |
| `views/SlotForeground.ts`  | Win presentation (cocktails vs symbols)                      |

---

## How to Create a New Game

### 1. Symbols & Mapping

**File:** `src/configs/SymbolsConfig.ts`

- Add or change symbol enums (`SYMBOL_TYPE`, `COCKTAIL_TYPE` if needed).
- Update `SYMBOL_MAP` for server codes (e.g. `LE` → `LEMON`).
- Update `COCKTAILS_MAP` and `COCKTAIL_COLOR_MAP` if special wins change.

### 2. Game Config

**File:** `src/GameConfig.ts`

- Adjust `lines` (paylines) for different grid layouts.
- Set `initialReelsConfig.reels` with your symbol layout.
- Adjust other values according to the new design

### 3. Bet & Balance

**File:** `src/slotLogic/index.ts`
// Ideally we must get the data from the server

- Export `BETS` array.
- Set `DEFAULT_BET` and `DEFAULT_BALANCE`.

### 4. API

**File:** `src/configs/constants.ts`

- Set `BASE_URL` for your backend.

**File:** `src/slotLogic/index.ts`

- Adapt `spin()` and `initRequest()` to your API format.
- Update `SYMBOL_MAP` / `COCKTAILS_MAP` usage if server symbols differ.

### 5. Assets

**Symbol sprites**

- Add images to `src/assets/images/` (e.g. `apple.png`, `cherry.png`).
- Run `yarn generateAssets` to pack atlases.
- Ensure `ElementView` uses the correct atlas (default: `symbols.png`).

**Win presentation**

- Add cocktail/special images to `images/wins` (follow the naming 'cocktailName.png' and 'cocktailName_text.png').
- Update `SlotForeground` and `spritesConfig` for new win assets.
- Run `yarn generateAssets` to pack atlases.

**Background & UI**

- Replace background in `src/assets/uncompressed/`.
- Replace UI assets in `src/assets/images/` (e.g. `ui_l/`, `ui_p/`).
- Run `yarn generateAssets` after changes.

### 6. Layout

**Files:** `src/configs/gridConfigs/*.ts`

- Tweak layout for different screen sizes.

### 7. Intro

**File:** `src/views/IntroView.ts`

- Customize intro flow.

**File:** `src/views/IntroCard.ts`

- Change intro card content.

**Files:** `src/configs/gridConfigs/introViewGC.ts`

- Adjust intro layout.

### 8. Win Presentation (Different Win Types)

**File:** `src/views/SlotForeground.ts`

- If you only have symbol wins: simplify `showWin()` and remove cocktail logic.
- If you have different special wins: extend `showCocktails` or add new methods.
- Add `{symbol}.png` and `{symbol}_text.png` for special win assets.

---

## Quick Reference: Game Variant Checklist

| Step                  | Files to Touch                                  |
| --------------------- | ----------------------------------------------- |
| Change symbols        | `SymbolsConfig.ts`                              |
| Change paylines       | `GameConfig.ts`                                 |
| Change bets           | `slotLogic/index.ts`                            |
| Change API            | `constants.ts`, `slotLogic/index.ts`            |
| Change symbol visuals | `assets/images/`, `ElementView.ts`              |
| Change win visuals    | `SlotForeground.ts`, `spritesConfig.ts`, assets |
| Change layout         | `config.ts`, `gridConfigs/`                     |
| Change intro          | `IntroView.ts`, `IntroCard.ts`                  |

---

## Scripts

```bash
yarn dev          # Start dev server
yarn build        # Production build
yarn preview      # Preview production build
yarn generateAssets   # Pack images into atlases
yarn generateEventNames  # Generate event name constants
```

---

## Asset Generation

1. Put source images in `src/assets/images/` (grouped by atlas).
2. Run `yarn generateAssets`.
3. Atlases are written to `src/assets/atlas/`.
4. New atlases must be registered in `src/assets/assetsNames/atlases.ts`.

---

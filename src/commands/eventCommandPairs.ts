import { lego } from "@armathai/lego";
import { ForegroundViewEvents, MainGameEvents, SlotMachineViewEvents, UIEvents } from "../events/MainEvents";
import { SlotMachineModelEvents } from "../events/ModelEvents";
import Head from "../models/Head";
import {
  errorPopupHideCompleteCommand,
  initModelsCommand,
  maxBetButtonClickCommand,
  minusButtonClickCommand,
  onShowGameCommand,
  onSpinButtonClickCommand,
  plusButtonClickCommand,
  setBlockActivityCommand,
  slotMachineNewElementsDropCompleteCommand,
  slotMachineOldElementsDropCompleteCommand,
  slotMachineStateUpdateCommand,
  spinResultUpdateCommand,
  winLinesShowCompleteCommand,
  winningsShowCompleteCommand,
} from "./GameCommands";

export const unmapCommands = (): void => {
  eventCommandPairs.forEach((pair) => lego.command.off(pair.event, pair.command));
};

export const mapCommands = (): void => {
  eventCommandPairs.forEach((pair) => lego.command.on(pair.event, pair.command));
};

export const onSoundButtonClickCommand = () => {
  console.warn(13243);

  Head.soundModel?.toggleSoundState();
};

export const onMusicButtonClickCommand = () => {
  Head.soundModel?.toggleMusicState();
};

export const onFlashButtonClickCommand = () => {
  Head.gameModel?.toggleFlash();
};

export const eventCommandPairs: { event: any; command: any }[] = [
  {
    event: "initModels",
    command: initModelsCommand,
  },
  {
    event: MainGameEvents.ShowGame,
    command: onShowGameCommand,
  },
  {
    event: UIEvents.SpinButtonClick,
    command: onSpinButtonClickCommand,
  },
  {
    event: UIEvents.PlusButtonClick,
    command: plusButtonClickCommand,
  },
  {
    event: UIEvents.MinusButtonClick,
    command: minusButtonClickCommand,
  },
  {
    event: UIEvents.MaxBetButtonClick,
    command: maxBetButtonClickCommand,
  },
  {
    event: SlotMachineModelEvents.StateUpdate,
    command: slotMachineStateUpdateCommand,
  },
  {
    event: SlotMachineViewEvents.WinLinesShowComplete,
    command: winLinesShowCompleteCommand,
  },
  {
    event: SlotMachineViewEvents.WinningsShowComplete,
    command: winningsShowCompleteCommand,
  },
  {
    event: SlotMachineModelEvents.SpinResultUpdate,
    command: spinResultUpdateCommand,
  },
  {
    event: SlotMachineViewEvents.NewElementsDropComplete,
    command: slotMachineNewElementsDropCompleteCommand,
  },
  {
    event: SlotMachineViewEvents.OldElementsDropComplete,
    command: slotMachineOldElementsDropCompleteCommand,
  },
  {
    event: MainGameEvents.BlockActivity,
    command: setBlockActivityCommand,
  },
  {
    event: ForegroundViewEvents.ErrorPopupHideComplete,
    command: errorPopupHideCompleteCommand,
  },

  {
    event: UIEvents.SoundButtonClick,
    command: onSoundButtonClickCommand,
  },

  {
    event: UIEvents.MusicButtonClick,
    command: onMusicButtonClickCommand,
  },

  {
    event: UIEvents.TurboButtonClick,
    command: onFlashButtonClickCommand,
  },
];

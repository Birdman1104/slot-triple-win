import { lego } from "@armathai/lego";
import { MainGameEvents, SlotMachineViewEvents, UIEvents } from "../events/MainEvents";
import { SlotMachineModelEvents } from "../events/ModelEvents";
import {
  initModelsCommand,
  maxBetButtonClickCommand,
  minusButtonClickCommand,
  onShowGameCommand,
  onSpinButtonClickCommand,
  plusButtonClickCommand,
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
];

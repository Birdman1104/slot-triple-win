import { lego } from "@armathai/lego";
import { SlotMachineViewEvents } from "../events/MainEvents";
import Head from "../models/Head";
import { SlotMachineState } from "../models/SlotMachineModel";
import { getDefaultPlayerInfo } from "../slotLogic";

export const initModelsCommand = async (): Promise<void> => {
  const playerInfo = await getDefaultPlayerInfo();

  Head.init();
  Head.initGameModel();
  Head.initSoundModel();
  Head.initPlayerModel();
  Head.playerModel?.setPlayerInfo(playerInfo);
};

export const onSpinButtonClickCommand = () => {
  Head.playerModel?.spin();
  lego.event.emit(SlotMachineViewEvents.UpdateUIBalance);
  Head.gameModel?.slotMachine?.spin(Head.playerModel?.bet);
};

export const plusButtonClickCommand = (): void => {
  Head.playerModel?.increaseBet();
};

export const minusButtonClickCommand = (): void => {
  Head.playerModel?.decreaseBet();
};

export const maxBetButtonClickCommand = (): void => {
  Head.playerModel?.setMaxBet();
};

export const slotMachineOldElementsDropCompleteCommand = (): void => {
  Head.gameModel?.slotMachine?.setState(SlotMachineState.WaitingForResult);
};

export const slotMachineNewElementsDropCompleteCommand = (): void => {
  Head.gameModel?.slotMachine?.setState(SlotMachineState.ShowWinLines);
};

export const winLinesShowCompleteCommand = (): void => {
  Head.gameModel?.slotMachine?.setState(SlotMachineState.ShowWinnings);
};

export const winningsShowCompleteCommand = (): void => {
  Head.gameModel?.slotMachine?.setState(SlotMachineState.Idle);
};

export const spinResultUpdateCommand = (result: SpinResult): void => {
  Head.playerModel?.updateBalance(result.totalWin);
};

export const slotMachineStateUpdateCommand = (newState: SlotMachineState, oldState: SlotMachineState): void => {
  if (newState === SlotMachineState.WaitingForResult) {
    Head.gameModel?.slotMachine?.checkForResult();
  }
};

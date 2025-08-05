import { lego } from "@armathai/lego";
import { SlotMachineViewEvents } from "../events/MainEvents";
import { GameState } from "../models/GameModel";
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
  Head.gameModel?.setState(GameState.Intro);
};

export const onShowIntroCommand = (): void => {
  Head.gameModel?.setState(GameState.Intro);
};

export const onShowGameCommand = (): void => {
  Head.gameModel?.setState(GameState.Game);
  Head.gameModel?.initSlotMachine();
};

export const onSpinButtonClickCommand = () => {
  if (Head.playerModel && isNaN(Head.playerModel.bet)) return;
  if (Head.gameModel?.slotMachine?.state !== SlotMachineState.Idle) return;
  Head.playerModel?.spin();
  lego.event.emit(SlotMachineViewEvents.UpdateUIBalance);
  Head.gameModel?.slotMachine?.spin(Head.playerModel?.bet as number);
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
  //
};

export const onStopCompleteCommand = (): void => {
  Head.gameModel?.slotMachine?.setState(SlotMachineState.ShowWinLines);
};

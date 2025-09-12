import { lego } from "@armathai/lego";
import { SlotMachineViewEvents } from "../events/MainEvents";
import { GameState } from "../models/GameModel";
import Head from "../models/Head";
import { SlotMachineState } from "../models/SlotMachineModel";
import { getDefaultPlayerInfo } from "../slotLogic";
let playerInfo: PlayerInfo;
export const initModelsCommand = async (): Promise<void> => {
  playerInfo = await getDefaultPlayerInfo();

  Head.initGameModel();
  Head.initSoundModel();
  Head.initPlayerModel();
  Head.gameModel?.setState(GameState.Intro);
};

export const onShowIntroCommand = (): void => {
  Head.gameModel?.setState(GameState.Intro);
};

export const onShowGameCommand = (): void => {
  Head.gameModel?.setState(GameState.Game);
  Head.gameModel?.initSlotMachine();
  Head.playerModel?.setPlayerInfo(playerInfo);
  Head.gameModel?.idleSlotMachine();
};

export const onSpinButtonClickCommand = () => {
  if (Head.gameModel?.isBlockedAction) return;
  if (Head.playerModel && isNaN(Head.playerModel.bet)) return;
  if (Head.gameModel?.slotMachine?.state !== SlotMachineState.Idle) return;
  if (Head.gameModel?.state !== GameState.Game) return;
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
  if (newState === SlotMachineState.WaitingForResult) {
    Head.gameModel?.slotMachine?.checkForResult();
  }
};

export const slotMachineOldElementsDropCompleteCommand = (): void => {
  Head.gameModel?.slotMachine?.setState(SlotMachineState.WaitingForResult);
};

export const slotMachineNewElementsDropCompleteCommand = (): void => {
  Head.gameModel?.slotMachine?.setState(SlotMachineState.ShowWinLines);
};

export const setBlockActivityCommand = (isBlocked: boolean): void => {
  if (Head.gameModel) {
    Head.gameModel.isBlockedAction = isBlocked;
  }
};

export const errorPopupHideCompleteCommand = (): void => {
  Head.gameModel?.slotMachine?.setState(SlotMachineState.Idle);
};

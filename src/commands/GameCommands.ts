import { lego } from "@armathai/lego";
import { MainGameEvents, SlotMachineViewEvents, UIEvents } from "../events/MainEvents";
import { GameState } from "../models/GameModel";
import Head from "../models/Head";
import { SlotMachineState } from "../models/SlotMachineModel";
import { getDefaultPlayerInfo, sendInitRequest } from "../slotLogic";

let playerInfo: PlayerInfo;

export const initModelsCommand = async (): Promise<void> => {
  Head.initGameModel();
  Head.initSoundModel();
  Head.gameModel?.setState(GameState.Intro);

  try {
    const initOk = await sendInitRequest();

    if (!initOk) {
      throw new Error("Initialization failed");
    }
    playerInfo = await getDefaultPlayerInfo();

    Head.initPlayerModel();
    lego.event.emit(MainGameEvents.IntroReadyToPlay);
  } catch (error) {
    console.error("Initialization error:", error);
    lego.event.emit(UIEvents.ShowInitialError, error);
  }
};

export const onShowGameCommand = (): void => {
  Head.gameModel?.setState(GameState.Game);
  Head.gameModel?.initSlotMachine();
  Head.playerModel?.setPlayerInfo(playerInfo);
  Head.gameModel?.idleSlotMachine();
};

export const onSpinButtonClickCommand = () => {
  if (Head.playerModel && isNaN(Head.playerModel.bet)) return;
  if (Head.gameModel?.state !== GameState.Game) return;

  if (Head.gameModel.slotMachine && Head.gameModel.slotMachine.state === SlotMachineState.Error) {
    lego.event.emit(UIEvents.ErrorPopupClose);
    Head.gameModel.slotMachine.setState(SlotMachineState.Idle);
    return;
  }

  if (Head.gameModel?.slotMachine?.state !== SlotMachineState.Idle) {
    Head.gameModel?.slotMachine?.removeAutoSpin();
    return;
  }

  if (Head.gameModel?.isBlockedAction) return;

  if (Head.playerModel?.spin()) {
    lego.event.emit(SlotMachineViewEvents.UpdateUIBalance);
    Head.gameModel?.slotMachine?.spin(Head.playerModel?.bet as number);
  } else {
    Head.gameModel?.slotMachine?.setError();
  }
};

export const plusButtonClickCommand = (): void => {
  if (!Head.gameModel?.slotMachine?.isIdle()) return;
  Head.playerModel?.increaseBet();
};

export const minusButtonClickCommand = (): void => {
  if (!Head.gameModel?.slotMachine?.isIdle()) return;
  Head.playerModel?.decreaseBet();
};

export const winLinesShowCompleteCommand = (): void => {
  Head.gameModel?.slotMachine?.onWinLinesShowComplete();
};

export const winningsShowCompleteCommand = (): void => {
  Head.gameModel?.slotMachine?.onWinningsShowComplete();
};

export const spinResultUpdateCommand = (result: SpinResult): void => {
  Head.playerModel?.updateBalance(result.totalWin);
};

export const slotMachineStateUpdateCommand = (newState: SlotMachineState): void => {
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

export const onSoundButtonClickCommand = () => {
  Head.soundModel?.toggleSoundState();
};

export const onMusicButtonClickCommand = () => {
  Head.soundModel?.toggleMusicState();
};

export const onFlashButtonClickCommand = () => {
  Head.gameModel?.toggleFlash();
};

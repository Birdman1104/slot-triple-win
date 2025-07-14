import { getSlotMachineConfig } from "../slotLogic";
import { ObservableModel } from "./ObservableModel";
import { SlotMachineModel } from "./SlotMachineModel";

export enum GameState {
  Undefined = "undefined",
  ReadyToPlay = "readyToPlay",
  Idle = "idle",
  Requesting = "requesting",
  ShowWinSymbols = "showWinSymbols",
  ShowWinnings = "showWinnings",
}

export enum WIN_TYPE {
  NONE = "none",
  NORMAL = "normal",
  BIG = "big",
  HUGE = "huge",
  MEGA = "mega",
}

export class GameModel extends ObservableModel {
  private _state: GameState = GameState.Undefined;
  private _slotMachine: SlotMachineModel | null = null;

  constructor() {
    super("GameModel");
    this.makeObservable();
  }

  get state() {
    return this._state;
  }

  set state(value) {
    this._state = value;
  }

  get slotMachine() {
    return this._slotMachine;
  }

  set slotMachine(value) {
    this._slotMachine = value;
  }

  public init(): void {
    this.initializeMachineModel();
  }

  public destroy(): void {
    this.destroyMachineModel();
  }

  public idleSlotMachine(): void {
    if (this._slotMachine) {
      this._slotMachine.idle();
    }
  }

  private initializeMachineModel(): void {
    this._slotMachine = new SlotMachineModel();
    this._slotMachine.init(getSlotMachineConfig());
  }

  private destroyMachineModel(): void {
    (this._slotMachine as SlotMachineModel).destroy();
    this._slotMachine = null;
  }
}

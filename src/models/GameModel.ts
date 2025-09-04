import { getSlotMachineInitialConfig } from "../slotLogic";
import { ObservableModel } from "./ObservableModel";
import { SlotMachineModel } from "./SlotMachineModel";

export enum GameState {
  Undefined = "undefined",
  Intro = "intro",
  Game = "game",
}

export class GameModel extends ObservableModel {
  private _state: GameState = GameState.Undefined;
  private _slotMachine: SlotMachineModel | null = null;

  constructor() {
    super("GameModel");
    this.state = GameState.Undefined;
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

  public setState(newState: GameState): void {
    this._state = newState;
  }

  public init(): void {
    // this.initializeMachineModel();
  }

  public initSlotMachine(): void {
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
    this._slotMachine = new SlotMachineModel(getSlotMachineInitialConfig());
    this._slotMachine.init();
  }

  private destroyMachineModel(): void {
    (this._slotMachine as SlotMachineModel).destroy();
    this._slotMachine = null;
  }
}

import { lego } from "@armathai/lego";
import { UIEvents } from "../events/MainEvents";
import { spin, SpinError } from "../slotLogic";
import { last } from "../utils/Utils";
import { ObservableModel } from "./ObservableModel";
import { ReelModel } from "./ReelModel";

const DEFAULT_ERROR: ErrorResult = {
  errorCode: 500,
  errorText: "An unexpected error occurred. Please try again.",
};

export enum SlotMachineState {
  Unknown,
  Idle,
  Pending,
  DropOld,
  WaitingForResult,
  DropNew,
  ShowWinLines,
  ShowWinnings,
  Error,
}

export class SlotMachineModel extends ObservableModel {
  private _config: any = {};
  private _reels: ReelModel[] = [];
  private _state: SlotMachineState = SlotMachineState.Unknown;
  private canCheck = false;
  private _spinResult: SpinResult = {
    winningInfo: [
      {
        symbol: "",
        id: "",
        winAmount: 0,
        line: [],
      },
    ],
    totalWin: 0,
    reels: [],
  };
  private tempSpinResult!: SpinResult;
  private isResultReady = false;

  private _isAutoSpin = false;
  private _autoSpinCount = 0;

  private _errorResult: ErrorResult | null = null;

  public constructor(config: any) {
    super("SlotMachineModel");
    this._config = config;
    this._reels = this.generateReels();
    this.state = SlotMachineState.Unknown;

    this.makeObservable();
  }

  get state() {
    return this._state;
  }

  set state(value) {
    this._state = value;
  }

  get config() {
    return this._config;
  }

  set config(value) {
    this._config = value;
  }

  get reels() {
    return this._reels;
  }

  set reels(value) {
    this._reels = value;
  }

  get spinResult() {
    return this._spinResult;
  }

  set spinResult(value) {
    this._spinResult = value;
  }

  get errorResult() {
    return this._errorResult;
  }

  set errorResult(value) {
    this._errorResult = value;
  }

  get isAutoSpin(): boolean {
    return this._isAutoSpin;
  }

  set isAutoSpin(value: boolean) {
    this._isAutoSpin = value;
  }

  get autoSpinCount(): number {
    return this._autoSpinCount;
  }

  set autoSpinCount(value: number) {
    this._autoSpinCount = value;
  }

  public isIdle(): boolean {
    return this.state === SlotMachineState.Idle;
  }

  public init(): void {
    //
  }

  public setAutoSpin(value: number): void {
    if (this.state !== SlotMachineState.Idle) return;
    this.isAutoSpin = true;
    this.autoSpinCount = value;
  }

  public removeAutoSpin(): void {
    this.isAutoSpin = false;
    this.autoSpinCount = 0;
  }

  public setState(state: SlotMachineState): void {
    this.state = state;
  }

  public destroy(): void {
    //
  }

  public isLastReel(uuid: string): boolean {
    return last(this._reels).uuid === uuid;
  }

  public getReelIndex(uuid: string): number {
    return this._reels.indexOf(this._reels.find((r) => r.uuid === uuid) as ReelModel);
  }

  public getReelByUUID(uuid: string): ReelModel | undefined {
    return this._reels.find((r) => r.uuid === uuid);
  }

  public onWinLinesShowComplete(): void {
    this.state = SlotMachineState.ShowWinnings;
  }

  public onWinningsShowComplete(): void {
    this.state = SlotMachineState.Idle;

    if (this.isAutoSpin && this.autoSpinCount > 0) {
      this.autoSpinCount--;
      if (this.autoSpinCount === 0) {
        this.isAutoSpin = false;
      }
      lego.event.emit(UIEvents.SpinButtonClick);
    }
  }

  public spin(bet: number): void {
    // TODO check for NaN values
    if (isNaN(bet as number)) return;
    this.state = SlotMachineState.Pending;
    this.getSpinResult(bet);
  }

  public checkForResult(): void {
    if (this.isResultReady && this.state === SlotMachineState.WaitingForResult) {
      this.isResultReady = false;
      this.setNewElementsToReels(this.tempSpinResult.reels);
      this.setResult(this.tempSpinResult);
      setTimeout(() => {
        // TODO FIX THIS SHIT, needs to skip a frame then set to new state
        this.state = SlotMachineState.DropNew;
      }, 0);
    } else {
      this.canCheck = true;
    }
  }
  public idle(): void {
    this.state = SlotMachineState.Idle;
  }
  public setResult(spinResult: SpinResult): void {
    this._spinResult = spinResult;
    this._config = { reels: spinResult.reels };
  }

  private generateReels(config = this._config): ReelModel[] {
    return config.reels.map((reelConfig: any, index: number) => new ReelModel(reelConfig, index));
  }

  public setError(error: ErrorResult = DEFAULT_ERROR): void {
    this.state = SlotMachineState.Error;
    this.errorResult = error;
  }

  private async getSpinResult(bet: number): Promise<void> {
    try {
      const result = await spin(bet);

      this.state = SlotMachineState.DropOld;
      this.isResultReady = false;
      this.tempSpinResult = result;

      this.isResultReady = true;
      this.canCheck && this.checkForResult();
    } catch (error) {
      console.error("Error getting spin result:", error);

      if (error instanceof SpinError) {
        this.setError(error.toErrorResult());
      } else if (error instanceof Error) {
        this.setError({
          errorCode: 500,
          errorText: error.message || DEFAULT_ERROR.errorText,
        });
      } else {
        this.setError();
      }
    }
  }

  private setNewElementsToReels(result: ReelsResult): void {
    this.reels.forEach((reel, i) => reel.setNewElements(result[i]));
  }
}

import { spin } from "../slotLogic";
import { last } from "../utils/Utils";
import { ObservableModel } from "./ObservableModel";
import { ReelModel } from "./ReelModel";

export enum SlotMachineState {
  Unknown,
  Idle,
  RequestSent,
  ResponseReceived,
  ShowWinLines,
  ShowWinnings,
}

export class SlotMachineModel extends ObservableModel {
  private _config: any = {};
  private _reels: ReelModel[] = [];
  private _state: SlotMachineState = SlotMachineState.Unknown;
  private _spinResult: SpinResult = {
    winningInfo: [
      {
        symbol: "",
        winAmount: 0,
        line: [],
        id: "",
      },
    ],
    totalWin: 0,
    reels: [],
  };
  private tempSpinResult: SpinResult = { reels: [], winningInfo: [], totalWin: 0 };

  public constructor() {
    super("SlotMachineModel");

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

  public init(config: any): void {
    this._config = config;
    this._reels = this.generateReels();
    this.state = SlotMachineState.Idle;
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

  public async spin(bet: number): Promise<void> {
    this.state = SlotMachineState.RequestSent;
    this.tempSpinResult = await spin(bet);
    this.checkForResult();
  }

  public checkForResult(): void {
    setTimeout(() => {
      this.setNewElementsToReels(this.tempSpinResult.reels);
      this.setResult(this.tempSpinResult);
      this.state = SlotMachineState.ResponseReceived;
    }, 300);
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

  private setNewElementsToReels(result: ReelsResult): void {
    this.reels.forEach((reel, i) => reel.setNewElements(result[i]));
  }
}

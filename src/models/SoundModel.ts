import { ObservableModel } from "./ObservableModel";

export enum SoundState {
  Unknown = "Unknown",
  On = "On",
  Off = "Off",
}

export class SoundModel extends ObservableModel {
  private _state: SoundState;
  private _soundState: SoundState;
  private _musicState: SoundState;

  public constructor() {
    super("SoundModel");

    this._state = SoundState.Unknown;
    this._soundState = SoundState.Unknown;
    this._musicState = SoundState.Unknown;
    this.makeObservable();
  }

  get musicState(): SoundState {
    return this._musicState;
  }

  set musicState(value: SoundState) {
    this._musicState = value;
  }

  get soundState(): SoundState {
    return this._soundState;
  }

  set soundState(value: SoundState) {
    this._soundState = value;
  }

  get state(): SoundState {
    return this._state;
  }

  set state(value: SoundState) {
    this._state = value;
  }

  public init(): void {
    this._state = SoundState.On;
  }

  public toggleState(): void {
    this._state = this._state === SoundState.On ? SoundState.Off : SoundState.On;
  }

  public toggleMusicState(): void {
    this._musicState = this._musicState === SoundState.On ? SoundState.Off : SoundState.On;
  }

  public toggleSoundState(): void {
    this._soundState = this._soundState === SoundState.On ? SoundState.Off : SoundState.On;
  }
}

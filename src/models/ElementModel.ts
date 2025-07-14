import { ObservableModel } from "./ObservableModel";

export enum ElementState {
  Idle,
  Animation,
}

export class ElementModel extends ObservableModel {
  private _state: ElementState;
  private _type: string;
  private _index: string;

  public constructor(type: string, index: string) {
    super("ElementModel");
    this._state = ElementState.Idle;
    this._type = type;
    this._index = index;
    this.setCustomID(`ElementModel${this._index}`);
    this.makeObservable();
  }

  get state() {
    return this._state;
  }

  set state(value) {
    this._state = value;
  }

  get type() {
    return this._type;
  }

  set type(value) {
    this._type = value;
  }
}

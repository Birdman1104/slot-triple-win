import { ElementModel } from "./ElementModel";
import { ObservableModel } from "./ObservableModel";

export enum ReelState {
  Idle,
  DropOld,
  DropNew,
}

export class ReelModel extends ObservableModel {
  private _state: ReelState;
  private _config: any;
  private _elements: ElementModel[];
  private _index: number;

  public constructor(config: any, index: number) {
    super("ReelModel");
    this._state = ReelState.Idle;
    this._config = config;
    this._index = index;
    this._elements = this.generateElements();
    this.setCustomID(`ReelModel${this._index}`);
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

  get elements() {
    return this._elements;
  }

  set elements(value) {
    this._elements = value;
  }

  public setState(state: ReelState): void {
    this._state = state;
  }

  public getElementByUUID(uuid: string): ElementModel | undefined {
    return this._elements.find((el) => el.uuid === uuid);
  }

  public setNewElements(config: ReelResult): void {
    this._elements = config.map((elType, elementIndex) => new ElementModel(elType, `${this._index}${elementIndex}`));
  }

  private generateElements(): ElementModel[] {
    return this._config.map(
      (elType: any, elementIndex: number) => new ElementModel(elType, `${this._index}${elementIndex}`)
    );
  }
}

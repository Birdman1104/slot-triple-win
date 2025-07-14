import type { SYMBOL_TYPE } from "../configs/SymbolsConfig";
import { ObservableModel } from "./ObservableModel";

export class SlotModel extends ObservableModel {
  private _type: SYMBOL_TYPE | null = null;

  public constructor(
    private _i: number,
    private _j: number
  ) {
    super("SlotModel");
    this.makeObservable();
  }

  public get i(): number {
    return this._i;
  }

  public get j(): number {
    return this._j;
  }

  public get type(): SYMBOL_TYPE | null {
    return this._type;
  }

  public set type(value: SYMBOL_TYPE | null) {
    this._type = value;
  }
}

import { BETS } from "../slotLogic";
import { ObservableModel } from "./ObservableModel";

export class PlayerModel extends ObservableModel {
  private _balance: number = -1;
  private _bet: number = -1;
  private _playerID: number = -1;

  public constructor() {
    super("PlayerModel");
    this._balance = 0;
    this._bet = 0;

    this.makeObservable();
  }

  get playerID() {
    return this._playerID;
  }

  get balance() {
    return this._balance;
  }

  set balance(value) {
    this._balance = +value.toFixed(1);
  }

  get bet() {
    return this._bet;
  }

  set bet(value) {
    this._bet = value;
  }

  public init(): void {
    //
  }

  public spin(): void {
    if (this._balance >= this._bet) {
      const value = this._balance - this._bet;
      this._balance = +value.toFixed(1);
    }
  }

  public increaseBet(): void {
    const index = BETS.findIndex((el) => el === this._bet);
    if (index === BETS.length - 1) return; // TODO disable button
    this._bet = BETS[index + 1];
  }

  public decreaseBet(): void {
    const index = BETS.findIndex((el) => el === this._bet);
    if (index === 0) return; // TODO disable button
    this._bet = BETS[index - 1];
  }

  public setMaxBet(): void {
    this._bet = BETS[BETS.length - 1];
  }

  public setPlayerInfo(playerInfo: any): void {
    this._bet = playerInfo.bet;
    this._balance = +playerInfo.balance.toFixed(1);
    this._playerID = playerInfo.id;
  }

  public updateBalance(winning: number): void {
    const value = this._balance + winning;
    const n = +value.toFixed(1);
    this._balance = n;
    console.warn(this._balance, +value.toFixed(1));
  }
}

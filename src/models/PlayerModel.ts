import { GLOBALS } from "../configs/constants";
import { BETS } from "../slotLogic";
import { ObservableModel } from "./ObservableModel";

export class PlayerModel extends ObservableModel {
  private _balance: number = -1;
  private _bet: number = -1;
  private _playerID: number = -1;
  private _sessionID: string = "";
  private data: PlayerData;

  public constructor(playerData: PlayerData) {
    super("PlayerModel");
    this._balance = 0;
    this._bet = 0;

    this.data = playerData;

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

  get sessionID() {
    return this._sessionID;
  }

  set sessionID(value) {
    this._sessionID = value;
  }

  public init(): void {
    this.sessionID = sessionStorage.getItem(GLOBALS.sessionIdKey) || "";
  }

  public spin(): boolean {
    if (this._balance >= this._bet && this._sessionID === sessionStorage.getItem(GLOBALS.sessionIdKey)) {
      const value = this._balance - this._bet;
      this._balance = +value.toFixed(1);
      return true;
    } else {
      return false;
    }
  }

  public increaseBet(): void {
    const index = BETS.findIndex((el) => el === this._bet);
    if (index === -1 || index === BETS.length - 1) return;
    this._bet = BETS[index + 1];
  }

  public decreaseBet(): void {
    const index = BETS.findIndex((el) => el === this._bet);
    if (index === -1 || index === 0) return;
    this._bet = BETS[index - 1];
  }

  public setMaxBet(): void {
    this._bet = BETS[BETS.length - 1];
  }

  public updatePlayerData(): void {
    this.setPlayerData(this.data);
  }

  public setPlayerData(playerData: PlayerData): void {
    this._bet = playerData.bet;
    this._balance = +playerData.balance.toFixed(1);
    this._playerID = playerData.id;
  }

  public updateBalance(winning: number): void {
    const value = this._balance + winning;
    const n = +value.toFixed(1);
    this._balance = n;
  }
}

import { GameModel } from "./GameModel";
import { ObservableModel } from "./ObservableModel";
import { PlayerModel } from "./PlayerModel";
import { SoundModel } from "./SoundModel";

class HeadModel extends ObservableModel {
  private _gameModel: GameModel | null = null;
  private _soundModel: SoundModel | null = null;
  private _playerModel: PlayerModel | null = null;

  public constructor() {
    super("Head");
    this.makeObservable();
  }

  public set gameModel(value: GameModel) {
    this._gameModel = value;
  }

  public get gameModel(): GameModel | null {
    return this._gameModel;
  }

  set playerModel(value) {
    this._playerModel = value;
  }

  get playerModel() {
    return this._playerModel;
  }

  public set soundModel(value: SoundModel) {
    this._soundModel = value;
  }

  public get soundModel(): SoundModel | null {
    return this._soundModel;
  }

  public init(): void {
    //
  }

  public initGameModel(): void {
    this._gameModel = new GameModel();
    this._gameModel.init();
  }

  public initPlayerModel(playerInfo: PlayerData): void {
    this._playerModel = new PlayerModel(playerInfo);
    this._playerModel.init();
  }

  public destroyPlayerModel(): void {
    this._playerModel?.destroy();
    this._playerModel = null;
  }

  public initSoundModel(): void {
    this._soundModel = new SoundModel();
    this._soundModel.init();
  }
}

const Head = new HeadModel();

export default Head;

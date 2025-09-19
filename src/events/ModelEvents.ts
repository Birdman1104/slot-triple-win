export const ElementModelEvents = {
  StateUpdate: "ElementModelStateUpdate",
  TypeUpdate: "ElementModelTypeUpdate",
};

export const GameModelEvents = {
  StateUpdate: "GameModelStateUpdate",
  SlotMachineUpdate: "GameModelSlotMachineUpdate",
  IsBlockedActionUpdate: "GameModelIsBlockedActionUpdate",
  GameTypeUpdate: "GameModelGameTypeUpdate",
};

export const HeadEvents = {
  GameModelUpdate: "HeadGameModelUpdate",
  PlayerModelUpdate: "HeadPlayerModelUpdate",
  SoundModelUpdate: "HeadSoundModelUpdate",
};

export const PlayerModelEvents = {
  BalanceUpdate: "PlayerModelBalanceUpdate",
  BetUpdate: "PlayerModelBetUpdate",
};

export const ReelModelEvents = {
  StateUpdate: "ReelModelStateUpdate",
  ElementsUpdate: "ReelModelElementsUpdate",
};

export const SlotMachineModelEvents = {
  StateUpdate: "SlotMachineModelStateUpdate",
  ConfigUpdate: "SlotMachineModelConfigUpdate",
  ReelsUpdate: "SlotMachineModelReelsUpdate",
  SpinResultUpdate: "SlotMachineModelSpinResultUpdate",
  ErrorResultUpdate: "SlotMachineModelErrorResultUpdate",
};

export const SlotModelEvents = { TypeUpdate: "SlotModelTypeUpdate" };

export const SoundModelEvents = {
  MusicStateUpdate: "SoundModelMusicStateUpdate",
  SoundStateUpdate: "SoundModelSoundStateUpdate",
  StateUpdate: "SoundModelStateUpdate",
};

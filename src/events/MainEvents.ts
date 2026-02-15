export const WindowEvent = {
  Resize: "WindowEventResize",
  FocusChange: "WindowEventFocusChange",
};

export const MainGameEvents = {
  InitModels: "MainGameEventsInitModels",
  Resize: "MainGameEventsResize",
  ShowIntro: "MainGameEventsShowIntro",
  ShowGame: "MainGameEventsShowGame",
  BlockActivity: "MainGameEventsBlockActivity",
  IntroReadyToPlay: "MainGameEventsIntroReadyToPlay",
};

export const SlotMachineViewEvents = {
  OldElementsDropComplete: "SlotMachineViewEventsOldElementsDropComplete",
  NewElementsDropComplete: "SlotMachineViewEventsNewElementsDropComplete",
  WinLinesShowComplete: "SlotMachineViewEventsWinLinesShowComplete",
  WinningsShowComplete: "SlotMachineViewEventsWinningsShowComplete",
  StopComplete: "SlotMachineViewEventsStopComplete",

  UpdateUIBalance: "SlotMachineViewEventsUpdateUIBalance",
};

export const UIEvents = {
  SpinButtonClick: "UIEventsSpinButtonClick",
  PlusButtonClick: "UIEventsPlusButtonClick",
  MinusButtonClick: "UIEventsMinusButtonClick",

  MenuItemClick: "UIEventsMenuItemClick",

  SoundButtonClick: "UIEventsSoundButtonClick",
  MusicButtonClick: "UIEventsMusicButtonClick",
  InfoButtonClick: "UIEventsInfoButtonClick",
  TurboButtonClick: "UIEventsTurboButtonClick",
  HistoryButtonClick: "UIEventsHistoryButtonClick",

  AutoSpinNumberClick: "UIEventsAutoSpinNumberClick",

  ErrorPopupClose: "UIEventsErrorPopupClose",

  ShowInitialError: "UIEventsShowInitialError",
};

export const ReelViewEvents = {
  OldElementsDropComplete: "ReelViewEventsOldElementsDropComplete",
  NewElementsDropComplete: "ReelViewEventsNewElementsDropComplete",
};

export const ForegroundViewEvents = {
  ErrorPopupHideComplete: "ForegroundViewEventsErrorPopupHideComplete",
  InfoPopupHideComplete: "ForegroundViewEventsInfoPopupHideComplete",
};

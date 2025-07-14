export const WindowEvent = {
  Resize: "WindowEventResize",
  FocusChange: "WindowEventFocusChange",
};

export const MainGameEvents = {
  Resize: "MainGameEventsResize",
  MainViewReady: "MainGameEventsMainViewReady",
};

export const ReelViewEvents = {
  OldElementsDropComplete: "ReelViewEventsOldElementsDropComplete",
  NewElementsDropComplete: "ReelViewEventsNewElementsDropComplete",
};

export const SlotMachineViewEvents = {
  OldElementsDropComplete: "SlotMachineViewEventsOldElementsDropComplete",
  NewElementsDropComplete: "SlotMachineViewEventsNewElementsDropComplete",
  WinLinesShowComplete: "SlotMachineViewEventsWinLinesShowComplete",
  WinningsShowComplete: "SlotMachineViewEventsWinningsShowComplete",

  UpdateUIBalance: "SlotMachineViewEventsUpdateUIBalance",
};

export const UIEvents = {
  SpinButtonClick: "UIEventsSpinButtonClick",
  PlusButtonClick: "UIEventsPlusButtonClick",
  MinusButtonClick: "UIEventsMinusButtonClick",
  MaxBetButtonClick: "UIEventsMaxBetButtonClick",
};

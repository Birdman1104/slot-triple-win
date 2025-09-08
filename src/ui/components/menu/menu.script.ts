import { lego } from "@armathai/lego";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { SlotMachineViewEvents, UIEvents } from "../../../events/MainEvents";
import {
  PlayerModelEvents,
  SlotMachineModelEvents,
} from "../../../events/ModelEvents";
import Head from "../../../models/Head";
import { SlotMachineState } from "../../../models/SlotMachineModel";
import { DEFAULT_BET } from "../../../slotLogic";
import MenuBackgroundMobile from "../../MenuBackgroundMobile.vue";
import MenuBackgroundSvg from "../../MenuBackgroundSvg.vue";
import Modal from "../../Modal.vue";
import { MenuEnum } from "../../enums/ui-enums";
import { menuItems, spinCountItems } from "../../constants/modal-items-const";
export default {
  components: {
    MenuBackgroundSvg,
    MenuBackgroundMobile,
    Modal,
  },
  setup() {
    let tempBalance = -1;
    let bet = ref("");
    let balance = ref("");
    let slotState = SlotMachineState.Unknown;

    const isMobile = ref(window.innerWidth <= 768);
    const orientation = ref("");
    const toggleMenu = ref(false);
    const toggleSpinMenu = ref(false);
    const showStopButton = ref(false);

    const selectedItem = ref("");

    const initalSettings = {
      [MenuEnum.Sound]: "false",
      [MenuEnum.Music]: "false",
      [MenuEnum.Turbo]: "false",
    };
    const settings = ref({});
    const spinCountValue = ref("");
    const activeModal = ref<null | "menu" | "spinCount">(null);

    const spinButtonClick = () => {
      lego.event.emit(UIEvents.SpinButtonClick);
    };

    const plusButtonClick = () => lego.event.emit(UIEvents.PlusButtonClick);
    const minusButtonClick = () => lego.event.emit(UIEvents.MinusButtonClick);

    function handleResize() {
      isMobile.value = window.innerWidth <= 768;
    }

    onMounted(() => {
      window.addEventListener("resize", handleResize);
      orientation.value = screen.orientation.type;
      spinCountValue.value = localStorage.getItem("spinCount") ?? "";
      bet.value = Head.playerModel?.bet.toString() || "1";
      balance.value = Head.playerModel?.balance.toString() || "10000";

      screen.orientation.addEventListener("change", () => {
        orientation.value = screen.orientation.type;
      });
    });

    onBeforeUnmount(() => {
      window.removeEventListener("resize", handleResize);
    });

    function toggleMenuBar() {
      activeModal.value = activeModal.value === "menu" ? null : "menu";
      toggleMenu.value = !toggleMenu.value;
      getSettingsFromLocalStorage();
    }

    function toggleAmountBar() {
      activeModal.value =
        activeModal.value === "spinCount" ? null : "spinCount";
      toggleSpinMenu.value = !toggleSpinMenu.value;
    }

    function handleSelect(item: any) {
      if (activeModal.value === "spinCount") {
        spinCountValue.value = item.text;
        toggleAmountBar();
      } else {
        if (item.id === MenuEnum.Info) {
          toggleMenuBar();
        } else if (item.id === MenuEnum.History) {
          toggleMenuBar();
        } else {
          setSetingsToLoacalStorage(item);
        }
      }
    }

    function setSetingsToLoacalStorage(item: any): void {
      localStorage.setItem("settings", JSON.stringify(item));
    }

    function getSettingsFromLocalStorage(): void {
      let menuSettings = localStorage.getItem("settings");
      if (menuSettings != null) {
        settings.value = JSON.parse(menuSettings);
      } else {
        localStorage.setItem("settings", JSON.stringify(initalSettings));
      }
    }

    const updateTempBalance = (newBalance: number): void => {
      if (tempBalance === -1) {
        tempBalance = newBalance;
        const betElement = document.getElementById("balance");

        if (betElement) {
          betElement.textContent = `$ ${tempBalance}`;
        }
        return;
      }

      if (slotState === SlotMachineState.Idle) {
        tempBalance = newBalance;
        const betElement = document.getElementById("balance");

        if (betElement) {
          betElement.textContent = `$ ${tempBalance}`;
        }
      } else if (slotState === SlotMachineState.DropOld) {
        tempBalance = newBalance;
      }
    };

    const updateBalance = (): void => {
      const betElement = document.getElementById("balance");

      if (betElement) {
        betElement.textContent = ` $ ${tempBalance} `;
      }
    };

    const betUpdate = (bet: number) => {
      const betElement = document.getElementById("bet");
      if (betElement) {
        betElement.textContent = ` $ ${bet}`;
      }
    };

    const onSlotStateUpdate = (state: SlotMachineState): void => {
      if (state === SlotMachineState.Idle) {
        showStopButton.value = false;
      } else {
        showStopButton.value = true;
      }

      slotState = state;
    };

    lego.event.on(PlayerModelEvents.BetUpdate, betUpdate);
    lego.event.on(PlayerModelEvents.BalanceUpdate, updateTempBalance);
    lego.event.on(SlotMachineViewEvents.WinningsShowComplete, updateBalance);
    lego.event.on(SlotMachineModelEvents.StateUpdate, onSlotStateUpdate);

    return {
      isMobile,
      balance,
      bet,
      orientation,
      toggleMenu,
      toggleSpinMenu,
      settings,
      spinCountValue,
      activeModal,
      menuItems,
      spinCountItems,
      showStopButton,
      spinButtonClick,
      plusButtonClick,
      minusButtonClick,
      toggleMenuBar,
      toggleAmountBar,
      handleSelect,
    };
  },
};

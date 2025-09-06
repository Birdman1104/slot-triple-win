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
    const spinCountValue = ref("");
    const activeModal = ref<null | "menu" | "spinCount">(null);

    const menuItems = [
      { id: "sound", text: "Sound", icon: "/slot-triple-win/icons/sound.svg" },
      { id: "music", text: "Music", icon: "/slot-triple-win/icons/music.svg" },
      { id: "info", text: "Info", icon: "/slot-triple-win/icons/info.svg" },
      { id: "turbo", text: "Turbo", icon: "/slot-triple-win/icons/turbo.svg" },
      {
        id: "history",
        text: "History",
        icon: "/slot-triple-win/icons/history.svg",
      },
    ];

    const spinCountItems = [
      { id: "200", text: "200" },
      { id: "100", text: "100" },
      { id: "50", text: "50" },
      { id: "20", text: "20" },
      { id: "10", text: "10" },
    ];

    const spinButtonClick = () => {
      lego.event.emit(UIEvents.SpinButtonClick);
      showStopButton.value = true;
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
      if (localStorage.getItem("bet")) {
        bet.value = localStorage.getItem("bet");
      } else {
        localStorage.setItem("bet", DEFAULT_BET.toString());
        bet.value = localStorage.getItem("bet") ?? "";
      }

      if (localStorage.getItem("balance")) {
        balance.value = localStorage.getItem("balance");
      } else {
        localStorage.setItem(
          "balance",
          Head.playerModel?.balance.toString() ?? "0"
        );
        balance.value = localStorage.getItem("balance");
      }

      screen.orientation.addEventListener("change", () => {
        orientation.value = screen.orientation.type;
      });
    });

    onBeforeUnmount(() => {
      window.removeEventListener("resize", handleResize);
    });

    function toggleMenuBar() {
      toggleSpinMenu.value = false;
      selectedItem.value = localStorage.getItem("menu") ?? "";
      activeModal.value = activeModal.value === "menu" ? null : "menu";
      toggleMenu.value = !toggleMenu.value;
    }

    function toggleAmountBar() {
      toggleMenu.value = false;
      activeModal.value =
        activeModal.value === "spinCount" ? null : "spinCount";
      toggleSpinMenu.value = !toggleSpinMenu.value;
    }

    function handleSelect(item: any) {
      if (activeModal.value === "spinCount") {
        localStorage.setItem("spinCount", item.text);
        spinCountValue.value = item.text;
        toggleAmountBar();
      } else {
        localStorage.setItem("menu", item.id);
        selectedItem.value = item.id;
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
      localStorage.setItem("balance", tempBalance.toString());
    };

    const updateBalance = (): void => {
      const betElement = document.getElementById("balance");

      if (betElement) {
        betElement.textContent = ` $ ${tempBalance} `;
      }
      showStopButton.value = false;
    };

    const betUpdate = (bet: number) => {
      const betElement = document.getElementById("bet");
      if (betElement) {
        betElement.textContent = ` $ ${bet}`;
      }
    };

    const onSlotStateUpdate = (state: SlotMachineState): void => {
      // @narvita TODO - change the spin button to stop button, only when the state is
      // DropOld,
      // WaitingForResult,
      // DropNew,
      // ShowWinLines,
      // ShowWinnings,

      // set to SPIN button, when the state is IDLE
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
      selectedItem,
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

<template>
  <div
    class="close-button-wrapper flex-center relative"
    @pointerdown="toggleMenuBar"
  >
    <div class="btn-background flex-center menu">
      <div class="close-button flex-center">
        <Transition name="fade-scale">
          <Modal
            v-if="activeModal === 'menu'"
            :items="menuItems"
            :width="160"
            :modal="'menu'"
            customClass="bar-mobile-menu"
            @select="handleSelect"
          />
        </Transition>
        <img v-if="activeModal === 'menu'" src="/src/assets/icons/close.svg" />
        <img
          v-if="activeModal !== 'menu'"
          src="/src/assets/icons/menuBar.svg"
        />
      </div>
    </div>
  </div>

  <div class="menu-wrapper">
    <div class="flex-center amount-box">
      <div class="balance-wrapper flex-center">
        <span class="text">Balance: </span>
        <span id="balance" class="amount"> $ {{ balance }}</span>
      </div>
      <div class="balance-wrapper flex-center">
        <span class="text">Bet </span
        ><span id="bet" class="amount">$ {{ DEFAULT_BET }} </span>
      </div>
    </div>
    <div class="wrapper">
      <MenuBackgroundMobile />

      <div class="ui-overlay">
        <div class="section right-section flex-center">
          <div
            class="refresh-btn-wrapper flex-center relative"
            @pointerdown="toggleAmountBar"
          >
            <div class="btn-background flex-center">
              <div class="refresh-btn flex-center">
                <Transition name="fade-scale">
                  <Modal
                    v-if="activeModal === 'amount'"
                    :items="amountItems"
                    @select="handleSelect"
                    :width="50"
                    customClass="amount-mobile-menu"
                  />
                </Transition>
                <img src="../assets/icons/refresh.svg" />
              </div>
            </div>
          </div>

          <div class="balance-box flex-center">
            <div class="bet-button-wrapper flex-center">
              <div class="btn-background flex-center">
                <button
                  class="decrease-button bet-button flex-center"
                  @pointerdown="minusButtonClick"
                >
                  <img src="../assets/icons/arrow.svg" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="section middle-section flex-center">
          <div class="button-box">
            <button
              class="spin-button flex-center"
              @pointerdown="spinButtonClick"
            >
              <img src="../assets/icons/spin.svg" />
              <div class="dot"></div>
            </button>
          </div>
        </div>

        <div class="section right-section flex-center">
          <div class="balance-box flex-center">
            <div class="bet-button-wrapper flex-center">
              <div class="btn-background flex-center">
                <button
                  class="increase-button bet-button flex-center"
                  @pointerdown="plusButtonClick"
                >
                  <img src="../assets/icons/arrow.svg" />
                </button>
              </div>
            </div>
          </div>

          <div class="bonuse-btn-wrapper flex-center">
            <div class="btn-background flex-center">
              <div class="buy-btn flex-center">
                <span class="buy-btn-text"> Buy Bonus </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div></div>
</template>

<script setup lang="ts">
import { lego } from "@armathai/lego";
import { ref } from "vue";
import { DEFAULT_BET } from "../configs/SymbolsConfig";
import { SlotMachineViewEvents, UIEvents } from "../events/MainEvents";
import {
  PlayerModelEvents,
  SlotMachineModelEvents,
} from "../events/ModelEvents";
import Head from "../models/Head";
import { SlotMachineState } from "../models/SlotMachineModel";
import Modal from "../ui/Modal.vue";
import MenuBackgroundMobile from "./MenuBackgroundMobile.vue";

let tempBalance = -1;
let balance = Head.playerModel?.balance ?? 0;
let slotState = SlotMachineState.Unknown;

const activeModal = ref<null | "menu" | "amount">(null);

const menuItems = [
  { id: "sound", text: "Sound", icon: "/src/assets/icons/sound.svg" },
  { id: "music", text: "Music", icon: "/src/assets/icons/music.svg" },
  { id: "info", text: "Info", icon: "/src/assets/icons/info.svg" },
  { id: "turbo", text: "Turbo", icon: "/src/assets/icons/turbo.svg" },
  {
    id: "history",
    text: "History",
    icon: "/src/assets/icons/history.svg",
  },
];

const amountItems = [
  { id: "200", text: "200" },
  { id: "100", text: "100" },
  { id: "50", text: "50" },
  { id: "20", text: "20" },
  { id: "10", text: "10" },
];

const spinButtonClick = () => lego.event.emit(UIEvents.SpinButtonClick);
const plusButtonClick = () => lego.event.emit(UIEvents.PlusButtonClick);
const minusButtonClick = () => lego.event.emit(UIEvents.MinusButtonClick);

function toggleMenuBar() {
  activeModal.value = activeModal.value === "menu" ? null : "menu";
}

function toggleAmountBar() {
  activeModal.value = activeModal.value === "amount" ? null : "amount";
}

function handleSelect(item: any) {
  activeModal.value = null;
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
  } else if (slotState === SlotMachineState.RequestSent) {
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
  slotState = state;
};

lego.event.on(PlayerModelEvents.BetUpdate, betUpdate);
lego.event.on(PlayerModelEvents.BalanceUpdate, updateTempBalance);
lego.event.on(SlotMachineViewEvents.WinningsShowComplete, updateBalance);
lego.event.on(SlotMachineModelEvents.StateUpdate, onSlotStateUpdate);
</script>
<style scoped>
@font-face {
  font-family: "Jomhuria";
  src: url("../assets/fonts/Jomhuria-Regular.ttf") format("truetype");
  font-weight: 100;
  font-style: normal;
}

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.35s ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  transform: scale(0);
}

.fade-scale-enter-to,
.fade-scale-leave-from {
  transform: scale(1);
}

.balance-box {
  width: 100%;
}

span {
  display: block;
}

.btn-background {
  box-shadow:
    inset 0 4px 6px rgba(255, 255, 255, 0.7),
    inset 0 -4px 6px rgba(0, 0, 0, 0.1),
    0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  width: 55px;
  height: 55px;
}

.full-width {
  width: 100%;
}

.balance-wrapper {
  flex-direction: column;
  flex: 1;
}

.amount-box {
  display: flex;
  position: absolute;
  bottom: 12%;
  left: 0;
  z-index: 1000;
  width: 100%;
}

.section {
  flex: 1;
}

.relative {
  position: relative;
}

.middle-section {
  max-width: fit-content;
}

.left-section,
.refresh-btn-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: start;
}

.refresh-btn-wrapper {
  padding-left: 10px;
}

.right-section {
  justify-content: end;
  padding-right: 3%;
}

.text {
  font-size: 25px;
  color: rgba(255, 255, 255, 0.7);
  font-family: "Jomhuria";
  line-height: 30%;
}

.menu-wrapper {
  position: absolute;
  bottom: -3.5%;
}

.wrapper {
  position: relative;
  height: auto;
  width: 100%;
}

.ui-overlay {
  position: absolute;
  left: 0;
  bottom: 17%;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  border-radius: 100px;
}

.buy-btn {
  border-radius: 50%;
  background: radial-gradient(circle at -20% -20%, #ffffff, #dfd2c7);
  box-shadow:
    inset 0 4px 6px rgba(255, 255, 255, 0.7),
    inset 0 -4px 6px rgba(0, 0, 0, 0.1),
    0 4px 8px rgba(0, 0, 0, 0.2);
  border: 2px solid #d9d9d9;
}

.close-button,
.refresh-btn,
.buy-btn {
  width: 95%;
  height: 95%;
}

.close-button img,
.refresh-btn img {
  width: 30px;
  height: 30px;
}

.buy-btn-text {
  color: rgba(0, 113, 30, 1);
  font-size: 22px;
  text-align: center;
  word-wrap: break-word;
  font-family: "Jomhuria";
}

.button-box {
  border-radius: 50%;
  border: 1.3px solid transparent;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.25)),
    linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.25),
      rgba(153, 153, 153, 0.25)
    );

  background-origin: border-box;
  background-clip: content-box, border-box;

  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
  left: 50%;
}

.spin-button {
  background-color: rgba(255, 255, 255, 0.25);
  padding: 0;
  width: 80px;
  height: 80px;
  background: radial-gradient(circle at -20% -20%, #ffffff, #a89379);
  box-shadow: 0px 5.26px 10.53px rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border: none;
  color: white;
  text-align: center;
  text-decoration: none;
  font-size: 16px;
}

.spin-button img {
  width: 60px;
  height: 60px;
}

.dot {
  width: 14px;
  height: 14px;
  background-color: #00711e;
  border-radius: 50%;
  box-shadow: 2px 2px 2px 0px rgba(255, 255, 255, 0.4) inset;
}

.amount {
  color: rgba(255, 255, 255, 1);
  font-size: 35px;
  font-family: "Jomhuria";
}

.bet-button,
.close-button,
.refresh-btn {
  border-radius: 50%;
  background: radial-gradient(
    at left top,
    rgba(255, 255, 255, 0.55),
    rgba(168, 147, 121, 0.55)
  );
  border: none;
  box-shadow: 0px 5.26px 10.53px rgba(0, 0, 0, 0.1);
}

.bet-button-wrapper {
  flex-direction: column;
  margin-left: 10px;
}

.decrease-button,
.increase-button {
  width: 90%;
  height: 90%;
  padding: 0;
}

.medium {
  width: 50px;
  height: 50px;
}

.increase-button img {
  rotate: 180deg;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu {
  position: absolute;
  top: 15px;
  right: 16px;
}
</style>

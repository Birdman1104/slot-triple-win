<template>
  <div
    class="menu-wrapper"
    v-if="!isMobile || (isMobile && orientation === 'landscape-primary')"
  >
    <div class="wrapper">
      <MenuBackgroundSvg />
      <div class="ui-overlay">
        <div class="section left-section flex-center">
          <div
            class="close-button-wrapper flex-center relative"
            @click="toggleMenuBar"
          >
            <div class="btn-background flex-center">
              <div class="close-button flex-center">
                <Modal
                  v-if="activeModal === 'menu'"
                  :items="menuItems"
                  :width="160"
                  @select="handleSelect"
                />
                <img
                  v-if="activeModal === 'menu'"
                  src="/src/assets/images/icons/close.svg"
                />
                <img
                  v-if="activeModal !== 'menu'"
                  src="/src/assets/images/icons/menuBar.svg"
                />
              </div>
            </div>

            <div class="line"></div>
          </div>

          <div class="balance-wrapper full-width flex-center">
            <span class="text">Balance: </span>
            <span id="balance" class="amount"> $ {{ balance }}</span>
          </div>
        </div>

        <div class="section middle-section flex-center">
          <div class="button-box">
            <button class="spin-button flex-center" @click="spinButtonClick">
              <img src="../assets/images/icons/spin.svg" />
              <div class="dot"></div>
            </button>
          </div>
        </div>

        <div class="section right-section flex-center">
          <div
            class="refresh-btn-wrapper flex-center relative"
            @click="toggleAmountuBar"
          >
            <div class="btn-background flex-center">
              <div class="refresh-btn flex-center">
                <Modal
                  v-if="activeModal === 'amount'"
                  :items="amountItems"
                  @select="handleSelect"
                  :width="50"
                />
                <img src="../assets/images/icons/refresh.svg" />
              </div>
            </div>
            <div class="line"></div>
          </div>

          <div class="balance-box flex-center flex-center">
            <div class="balance-wrapper flex-center">
              <span class="text">Bet </span
              ><span id="bet" class="amount">$ {{ DEFAULT_BET }} </span>
            </div>

            <div class="bet-button-wrapper flex-center">
              <div class="btn-background small flex-center">
                <button
                  class="increase-button bet-button flex-center"
                  @click="plusButtonClick"
                >
                  <img src="../assets/images/icons/arrow.svg" />
                </button>
              </div>
              <div class="btn-background small flex-center">
                <button
                  class="decrease-button bet-button flex-center"
                  @click="minusButtonClick"
                >
                  <img src="../assets/images/icons/arrow.svg" />
                </button>
              </div>
            </div>
          </div>

          <div class="bonuse-btn-wrapper flex-center">
            <div class="line"></div>
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

  <div v-if="isMobile && orientation === 'portrait-primary'">
    <UIMobileView />
  </div>
</template>

<script setup lang="ts">
import { lego } from "@armathai/lego";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { DEFAULT_BET } from "../configs/SymbolsConfig";
import { SlotMachineViewEvents, UIEvents } from "../events/MainEvents";
import { PlayerModelEvents } from "../events/ModelEvents";
import MenuBackgroundSvg from "../ui/MenuBackgroundSvg.vue";
import Modal from "../ui/Modal.vue";
import UIMobileView from "../ui/UIMobileView.vue";

let tempBalance = -1;
let balance = -1;

const isMobile = ref(window.innerWidth <= 768);
const orientation = ref("");
const activeModal = ref<null | "menu" | "amount">(null);

const menuItems = [
  { id: "sound", text: "Sound", icon: "/src/assets/images/icons/sound.svg" },
  { id: "music", text: "Music", icon: "/src/assets/images/icons/music.svg" },
  { id: "info", text: "Info", icon: "/src/assets/images/icons/info.svg" },
  { id: "turbo", text: "Turbo", icon: "/src/assets/images/icons/turbo.svg" },
  {
    id: "history",
    text: "History",
    icon: "/src/assets/images/icons/history.svg",
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

function handleResize() {
  isMobile.value = window.innerWidth <= 768;
}

onMounted(() => {
  window.addEventListener("resize", handleResize);
  orientation.value = screen.orientation.type;

  screen.orientation.addEventListener("change", () => {
    orientation.value = screen.orientation.type;
    console.log(orientation.value, "here");
  });
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});

function toggleMenuBar() {
  activeModal.value = activeModal.value === "menu" ? null : "menu";
}

function toggleAmountuBar() {
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
  } else {
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

lego.event.on(PlayerModelEvents.BetUpdate, betUpdate);
lego.event.on(PlayerModelEvents.BalanceUpdate, updateTempBalance);
lego.event.on(SlotMachineViewEvents.WinningsShowComplete, updateBalance);
</script>

<style scoped>
@font-face {
  font-family: "Jomhuria";
  src: url("../assets/fonts/Jomhuria-Regular.ttf") format("truetype");
  font-weight: 100;
  font-style: normal;
}

.line {
  width: 1px;
  height: 60px;
  background: linear-gradient(
    to bottom,
    rgba(192, 177, 165, 0) 0%,
    rgba(255, 255, 255, 1) 50%,
    rgba(153, 153, 153, 0) 100%
  );
}

.balance-box {
  width: 100%;
}

.btn-background {
  box-shadow:
    inset 0 4px 6px rgba(255, 255, 255, 0.7),
    inset 0 -4px 6px rgba(0, 0, 0, 0.1),
    0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  margin: 5px;
  width: 55px;
  height: 55px;
}

.full-width {
  width: 100%;
}

.balance-wrapper {
  flex-direction: column;
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

.left-section {
  justify-content: start;
  padding-left: 3%;
}

.right-section {
  justify-content: end;
  padding-right: 3%;
}

.text {
  font-size: 25px;
  color: rgba(255, 255, 255, 0.7);
  font-family: "Jomhuria";
}

.menu-wrapper {
  position: absolute;
  bottom: 0;
  width: 65%;
  display: flex;
  align-self: center;
  left: 17.5%;
}

.wrapper {
  position: relative;
  height: auto;
  width: 100%;
}

.ui-overlay {
  position: absolute;
  top: 0;
  left: 0;
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
  transform: translateX(-4.3%);
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
  font-size: 30px;
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

.small {
  width: 28px;
  height: 28px;
  margin: 0;
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
</style>
<style>

@media screen and (max-width: 1300px) {
  .btn-background {
    width: 45px !important;
    height: 45px !important;
  }
  .small {
    width: 23px !important;
    height: 23px !important;
  }
  .spin-button {
    width: 70px !important;
    height: 70px !important;
  }
}

@media screen and (max-width: 1024px) and (orientation: landscape) {
  .btn-background {
    width: 35px !important;
    height: 35px !important;
  }
  .small {
    width: 18px !important;
    height: 18px !important;
  }
  .spin-button {
    width: 50px !important;
    height: 50px !important;
  }

  .spin-button img {
    width: 40px !important;
    height: 40px !important;
  }

  .close-button img,
  .refresh-btn img {
    width: 25px !important;
    height: 25px !important;
  }
  .buy-btn-text {
    font-size: 18px !important;
  }
  .line {
    height: 40px !important;
  }
    .text {
    font-size: 20px !important;
  }
  .amount {
    font-size: 18px !important;
  }
}

@media screen and (max-width: 768px) and (orientation: landscape) {
  .btn-background {
    width: 25px !important;
    height: 25px !important;
  }
  .small {
    width: 15px !important;
    height: 15px !important;
  }
  .spin-button {
    width: 40px !important;
    height: 40px !important;
  }

  .spin-button img {
    width: 30px !important;
    height: 30px !important;
  }

  .close-button img,
  .refresh-btn img {
    width: 20px !important;
    height: 20px !important;
  }

  .buy-btn-text {
    font-size: 13px !important;
  }

  .text {
    font-size: 16px !important;
  }
  .amount {
    font-size: 18px !important;
  }
}
</style>

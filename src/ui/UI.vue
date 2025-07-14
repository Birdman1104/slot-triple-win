<!-- src/components/UI.vue -->
<template>
    <div class="ui-overlay">
        <span>Balance: </span><span id='balance' class='balance-amount'>{{ balance }} $</span>
        <button class='spin-button' @click="spinButtonClick">Spin</button>
        <button class='minus-button bet-button' @click="minusButtonClick">-</button>
        <span>Bet Amount: </span><span id='bet' class='bet-amount'>{{ DEFAULT_BET }} $</span>
        <button class='plus-button bet-button' @click="plusButtonClick">+</button>
    </div>
</template>

<script setup lang="ts">

import { lego } from '@armathai/lego';
import { DEFAULT_BET } from '../configs/SymbolsConfig';
import { SlotMachineViewEvents, UIEvents } from '../events/MainEvents';
import { PlayerModelEvents } from '../events/ModelEvents';

let tempBalance = -1;
let balance = -1

const spinButtonClick = () => lego.event.emit(UIEvents.SpinButtonClick)
const plusButtonClick = () => lego.event.emit(UIEvents.PlusButtonClick);
const minusButtonClick = () => lego.event.emit(UIEvents.MinusButtonClick);

const updateTempBalance = (newBalance: number): void => {
    if (tempBalance === -1) {
        tempBalance = newBalance;
        const betElement = document.getElementById('balance');

        if (betElement) {
            betElement.textContent = `${tempBalance} $`;
        }
    } else {
        tempBalance = newBalance;
    }

}

const updateBalance = (): void => {
    const betElement = document.getElementById('balance');

    if (betElement) {
        betElement.textContent = `${tempBalance} $`;
    }
}

const betUpdate = (bet: number) => {
    const betElement = document.getElementById('bet');
    if (betElement) {
        betElement.textContent = `${bet} $`;
    }
}


lego.event.on(PlayerModelEvents.BetUpdate, betUpdate)
lego.event.on(PlayerModelEvents.BalanceUpdate, updateTempBalance);
lego.event.on(SlotMachineViewEvents.WinningsShowComplete, updateBalance);

</script>

<style scoped>
.ui-overlay {
    position: absolute;
    bottom: 10px;
    left: 40%;
    z-index: 10;
    background-color: aqua;
}

.spin-button {
    background-color: #04AA6D;
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
}

.bet-button,
.balance-amount {
    margin-left: 10px;
    margin-right: 10px;
}
</style>

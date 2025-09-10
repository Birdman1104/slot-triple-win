<template>
  <div class="modal-overlay" @click.stop>
    <div
      class="modal-content"
      :class="['modal-content', props.customClass]"
      :style="{ width: props.width + 'px', height: props.height + 'px' }"
    >
      <ul>
        <li
          v-for="item in items"
          :key="item.id"
          @pointerdown.stop="selectItem(item, $event)"
          class="modal-item"
          :class="['modal-item', props.itemsClass]"
        >
          <div
            class="icon"
            v-if="item.icon"
            :class="{
              selected: isSelected(item),
            }"
          >
            <img :src="item.icon" />
          </div>
          <span>{{ item.text }} </span>
        </li>
      </ul>
    </div>
    <div class="modal-wrapper" @pointerdown="handleClose($event)"></div>
  </div>
</template>

<script setup>
import { lego } from "@armathai/lego";
import { defineEmits, onBeforeUnmount, onMounted, ref } from "vue";
import { UIEvents } from "../events/MainEvents";
import { MenuEnum } from "./enums/ui-enums";
const isMobile = ref(window.innerWidth <= 768);
const selected = ref(false);
const selectedItemId = ref(null);

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  width: {
    type: Number,
    default: 160,
  },
  height: {
    type: Number,
    default: 250,
  },
  selectedItems: {
    type: {},
    default: {},
  },
  customClass: {
    type: String,
    default: "",
  },
  itemsClass: {
    type: String,
    default: "",
  },
  modal: {
    type: String,
    default: "",
  },
});
const selectedItems = ref(props.selectedItems);

const emits = defineEmits(["close", "select"]);

function selectItem(item, event) {
  lego.event.emit(UIEvents.MenuItemClick, item.id);
  if (props.modal !== "menu") {
    emits("select", item, event);
    return;
  }
  if (
    (item.id == MenuEnum.History || item.id == MenuEnum.Info) &&
    props.modal === "menu"
  ) {
    emits("select", item, event);
    return;
  } else {
    selectedItems.value[item.id] =
      selectedItems.value[item.id] === "true" ? "false" : "true";
    emits("select", { ...selectedItems.value }, event);
  }
}

function isSelected(item) {
  if (
    (item.id == MenuEnum.History || item.id == MenuEnum.Info) &&
    props.modal === "menu"
  ) {
    return false;
  } else {
    return selectedItems.value[item.id] === "true";
  }
}

function handleResize() {
  close();
}

function handleClose(event) {
  emits("close", event);
}

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
.modal-wrapper {
  position: fixed;
  left: 0;
  width: 100vw;
  top: 0;
  height: 100vh;
  z-index: 2;
}

.modal-overlay {
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50%;
  z-index: 3;
  position: absolute;
}

span {
  display: block;
  height: 25px;
}

.close-btn {
  position: absolute;
  right: 10px;
  top: 10px;
  width: 30px;
}

ul,
li {
  margin: 0;
  padding: 0;
  font-family: "JomhuriaRegular";
  color: rgba(255, 255, 255, 1);
  font-size: 30px;
}

.modal-content {
  bottom: 50px;
  position: absolute;
  padding: 1.5rem;
  height: 250px;
  border-radius: 52px;
  backdrop-filter: blur(18px);
  background-color: rgba(255, 255, 255, 0.25);
  border: 1.5px solid rgba(255, 255, 255, 0.5);
  overflow: hidden;
  z-index: 100;
}

.modal-item {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 6px;
  transition: background 0.2s;
}

.modal-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 35% 40%,
    rgba(255, 255, 255, 0.26),
    rgba(168, 147, 121, 0.26)
  );
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  border: 1px;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 1px;
  border: 2px solid transparent;
}

.icon.selected {
  border: 2px solid transparent;
  border-radius: 50%;
  background:
    linear-gradient(to right, #00be32, #00711e) border-box,
    radial-gradient(circle, rgba(0, 113, 30, 1), rgba(0, 142, 38, 1))
      padding-box;
  background-clip: content-box, border-box;
}

:deep(.modal-content.bar-mobile-menu) {
  right: 10px;
  top: 60px;
  width: 160px;
  left: unset;
  border-top-right-radius: 15px;
}

:deep(.modal-content.amount-mobile-menu) {
  left: 10px;
  border-bottom-left-radius: 10px;
}

:deep(.centerd-text) {
  justify-content: center;
}
</style>

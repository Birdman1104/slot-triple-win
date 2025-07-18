<template>
  <div class="modal-overlay" @click.self="close">
    <div
      class="modal-content"
      :class="['modal-content', props.customClass]"
      :style="{ width: props.width + 'px' }"
    >
      <img
        @click="close"
        class="close-btn"
        v-if="isMobile && props.modal === 'menu'"
        src="/src/assets/images/icons/close.svg"
      />
      <ul>
        <li
          v-for="item in items"
          :key="item.id"
          @click="selectItem(item)"
          class="modal-item"
        >
          <button
            class="icon"
            v-if="item.icon"
            :class="{ selected: selectedItemId === item.id }"
          >
            <img :src="item.icon" />
          </button>
          <span>{{ item.text }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, onMounted, onBeforeUnmount } from "vue";
const isMobile = ref(window.innerWidth <= 768);
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
  customClass: {
    type: String,
    default: "",
  },
  modal: {
    type: String,
    default: "",
  },
});

const emits = defineEmits(["close", "select"]);

function selectItem(item) {
  selectedItemId.value = item.id;
  emits("select", item);
}

function handleResize() {
  close();
}

function handleClose() {
  isMobile.value = window.innerWidth <= 768;
}

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
@font-face {
  font-family: "Jomhuria";
  src: url("../assets/fonts/Jomhuria-Regular.ttf") format("truetype");
  font-weight: 100;
  font-style: normal;
}

.modal-overlay {
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
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
  font-family: "Jomhuria";
  color: rgba(255, 255, 255, 1);
  font-size: 30px;
}

.modal-content {
  bottom: 100%;
  left: 0;
  position: absolute;
  background: white;
  padding: 1.5rem;
  border-radius: 10px;

  height: 230px;
  border-radius: 52px;
  backdrop-filter: blur(25px);
  background-color: rgba(255, 255, 255, 0.25); /* same as fill-opacity: 0.25 */
  border: 1.5px solid rgba(255, 255, 255, 0.5);
  overflow: hidden; /* ensures blur stays within bounds */
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
  border-image: linear-gradient(0deg, white, #999) 1;
  background-origin: border-box;
  background-clip: content-box, border-box;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 1px;
}

.icon.selected {
  background: radial-gradient(
    circle at center,
    rgba(0, 255, 0, 0.4),
    rgba(0, 128, 0, 0.6)
  );
  border: 2px solid rgba(0, 128, 0, 0.5);
  background: green !important;
}

:deep(.modal-content.bar-mobile-menu) {
  top: 0;
  right: 0;
  width: 160px;
  left: unset;
  border-top-right-radius: 10px;
}

:deep(.modal-content.amount-mobile-menu) {
  bottom: 110%;
  left: 10px;
  border-bottom-left-radius: 10px;
}
</style>

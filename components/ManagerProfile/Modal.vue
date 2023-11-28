<template>
  <div class="modal-container">
    <div ref="modalContainer" class="body">
      <div class="close" @click="$emit('close')"><Icon icon="Cancel" :size="24"></Icon></div>

      <div
        class="modal"
        :style="{
          width: customWidth,
        }"
      >
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref } from 'vue';

export default {
  name: 'Modal',
  props: {
    customWidth: {
      type: String,
      default: '456px',
    },
  },
  setup({ emit }) {
    const modalContainer = ref(null);

    onMounted(async () => {
      await nextTick();
      document.addEventListener('click', handleClickOutside);
    });

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
    });
    const handleClickOutside = (event) => {
      if (modalContainer.value && !modalContainer.value.contains(event.target)) {
        $emit('close');
      }
    };
  },
};
</script>

<style scoped lang="scss">
.modal-container {
  z-index: 999999999;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(26, 29, 41, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  .body {
    margin: auto;
    .close {
      width: 40px;
      height: 40px;
      background: $default-bg;
      border: 1px solid $not-active-border;
      border-radius: 24px;
      margin-bottom: 12px;
      margin-left: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      &:hover {
        cursor: pointer;
      }
    }
    .modal {
      display: flex;
      flex-direction: column;
      padding: 32px;
      gap: 24px;
      width: 456px;

      background: $default-bg;
      border-radius: 16px;
    }
  }
}
</style>

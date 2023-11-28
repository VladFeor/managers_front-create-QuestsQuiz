<template>
  <transition name="modal">
    <div @click="closeModal" class="zoom-image-mask">
      <div @click="closeModal" class="zoom-image-close">
        <!-- <Icon name="Delete" :size="24" /> -->
      </div>
      <div class="zoom-image-wrapper">
        <div class="zoom-image-container">
          <!-- <div class="zoom-image-container" :style="`background-image: url(${image})`"> -->
          <img class="zoom-image-container_picture" :src="image" alt="" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  image: { type: String, defalut: '' },
});

const emit = defineEmits(['close']);

onMounted(() => {
  document.addEventListener('keyup', handleKeyUp);
});

onBeforeUnmount(() => {
  document.removeEventListener('keyup', handleKeyUp);
});

const closeModal = () => {
  emit('close');
};

const handleKeyUp = (event) => {
  if (event.keyCode === 27) {
    closeModal();
  }
};
</script>

<style lang="scss">
.zoom-image {
  &-mask {
    position: fixed;
    z-index: 999989;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: table;
    transition: opacity 0.3s ease;
  }

  &-wrapper {
    display: table-cell;
    vertical-align: middle;
  }

  &-container {
    display: flex;
    justify-content: center;
    align-items: center;
    background-repeat: no-repeat;
    background-size: cover;
    // height: 160px;
    // width: 100%;
    overflow: hidden;
    width: 700px;
    height: 500px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
    background-color: #fff;
    margin: 0 auto;
    &_picture {
      width: auto;
      max-height: 500px;
      height: auto;
    }
  }
  &-close {
    position: absolute;
    top: 5%;
    right: 5%;
    transform: rotate(45deg);
    &__icon {
      fill: white;
      cursor: pointer;
      transform: scale(2.5);
    }
  }
}
</style>

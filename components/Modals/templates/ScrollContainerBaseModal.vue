<template>
    <div class="modal-overlay" v-if="visible" @click.self="closeModal">
      <div
        class="modal-container"
        :style="{
          width: width + 'px',
          height: customHeight,
          top: top + 'px',
          right: rightCustom || rightCustom === 0 ? rightCustom + 'px' : right + 'px',
          bottom: bottom + 'px',
          maxHeight: maxHeight,
          padding
        }"
      >
        <div class="scroll-container">
            <div v-if="props.title" class="modal-header">
                <h2>{{ props.title }}</h2>
            </div>
            <div
                class="modal-body"
                ref="modalContainer"
                :class="`${bodyClasses ? bodyClasses : ''} ${isScrollOff ? 'isScrollOff' : ''}`"
            >
                <slot></slot>
            </div>
        </div>    
        <button
          v-if="!isCloseBtnInvisible"
          class="close-modal-btn"
          :class="{ btnLeft }"
          @click="closeModal"
        >
          <Icon name="Delete" size="24" />
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, watchEffect } from 'vue';
  
  const props = defineProps({
    visible: { type: Boolean, default: false },
    title: { type: String, default: '' },
    width: { type: Number, default: 400 },
    top: { type: Number, default: window.innerHeight / 2 - 300 },
    customHeight: { type: Number, default: 'fit-content' },
    maxHeight: { type: Number, default: 'auto' },
    rightCustom: { type: Number, default: null },
    bottom: { type: Number, default: 0 },
    btnLeft: { type: Boolean, default: false },
    isConfirm: { type: Boolean, default: false },
    isCloseBtnInvisible: { type: Boolean, default: false },
    isScrollOff: { type: Boolean, default: false },
    bodyClasses: { type: String, default: false },
    padding: {type: String, default:undefined},
  });
  const emit = defineEmits(['close', 'openConfirmationModal']);
  
  const visible = ref(props.visible);
  const right = computed(() => window.innerWidth / 2 - props.width / 2);
  
  function openModal() {
    visible.value = true;
  }
  
  function closeModal() {
    if (props.isCloseBtnInvisible) return;
    if (props.isConfirm) {
      emit('openConfirmationModal');
      return;
    }
    visible.value = false;
    emit('close', visible.value);
  }
  
  watchEffect(() => {
    if (visible.value) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });
  
  watchEffect(() => {
    visible.value = props.visible;
  });
  
  const modalContainer = ref(null);
  
  </script>
  
  <style lang="scss" scoped>
  .close-modal-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    width: 40px;
    height: 40px;
    background: #f5f5fd;
    border-radius: 24px;
    color: #38405b;
    top: -40px;
    right: -40px;
    cursor: pointer;
    &.btnLeft {
      top: 20px;
      right: 0;
      left: -50px;
    }
  }
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(26, 29, 41, 0.4);
    backdrop-filter: blur(4px);
    z-index: 999999;
  }
  
  .modal-container {
    position: absolute;
    background: #f5f5fd;
    border-radius: 16px;
    z-index: 100;
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #1A1D29;
  }
  
  .modal-header h2 {
    margin: 0;
    font-size: 1.25rem;
  }
  
  .modal-header button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    font-size: 1.5rem;
  }
  
  .edit-condition-modal, .add-contition-modal {
    .scroll-container {
      overflow-y: scroll;
      height: 100%;
      padding-right: 16px;

        &::-webkit-scrollbar {
            width: 6px;
            height: 90%;
        }
    
        &::-webkit-scrollbar-track {
            border-radius: 10px;
            margin-top: 10px;
            margin-bottom: 10px;
        }
    
        &::-webkit-scrollbar-thumb {
            background: $secondary;
            border-radius: 10px;
        }
    
        &::-webkit-scrollbar-thumb:hover {
            background: $secondary;
        }
      
        .modal-body {
            overflow-y: visible;
        }
    }
    .modal-header {
      margin-bottom: 24px;
      justify-content: center;
  
      h2 {
        font-size: 24px;
        font-weight: 400;
        line-height: 40px;
      }
    }
  }
  </style>
  
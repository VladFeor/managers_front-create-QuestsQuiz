<template>
  <div class="dropdown" ref="dropdown">
    <button class="dropdown-btn" @click="toggleDropdown">
      <div></div>
      <div></div>
      <div></div>
    </button>
    <div class="dropdown-content" @click="emit('action')" v-if="isDropdownOpen">
      <span>Reject</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

onMounted(() => {
  document.addEventListener('click', closeDropdown);
});

const emit = defineEmits(['action']);

function closeDropdown(event) {
  if (!event.target.closest('.dropdown')) {
    isDropdownOpen.value = false;
  }
}

const isDropdownOpen = ref(false);

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
}
</script>

<style lang="scss" scoped>
.dropdown {
  position: relative;
}
.dropdown-btn {
  width: 40px;
  height: 40px;
  background: #eaeafb;
  border-radius: 8px;
  border: none;
  position: relative;
  overflow: inherit;
}

.dropdown-btn > div {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 4px;
  height: 4px;
  background: #38405b;
  border-radius: 50%;
}

.dropdown-btn div:nth-child(1) {
  left: 30%;
}

.dropdown-btn div:nth-child(2) {
  left: 50%;
}

.dropdown-btn div:nth-child(3) {
  left: 70%;
}

.dropdown-content {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: -10px;
  left: 30%;
  transform: translateY(100%) translateX(-50%);
  z-index: 300;
  width: 80px;
  height: 48px;
  background-color: #f9f9f9;
  box-shadow: 0px 4px 16px rgba(56, 64, 91, 0.24);
  border-radius: 8px;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;

  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  font-feature-settings: 'zero' on;
  color: #38405b;
  &:hover {
    background: #eaeafb;
    &::after {
      background: #eaeafb;
    }
  }
  &::after {
    content: '';
    position: absolute;
    width: 28px;
    height: 18px;
    background: #f9f9f9;
    transform: rotate(45deg) translateX(-50%);
    z-index: -1;
    top: 10px;
    left: 65%;
  }
}
</style>

<template>
  <div class="loader">
    <div class="circle"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isLoading = ref(true);
</script>

<style scoped>
.loader {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  z-index: 9999999;
}

.circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 4px solid #fff;
  border-top-color: #ccc;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

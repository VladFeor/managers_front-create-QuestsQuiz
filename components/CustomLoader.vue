<template>
  <div class="custom-loading-screen">
    <img :src="defaultLogo" alt="" />
  </div>
</template>

<script setup>
import defaultLogo from '@/assets/images/default-loader-img.png';
</script>

<style lang="scss" scoped>
.custom-loading-screen {
  width: 100%;
  height: 100vh;
  position: absolute;
  z-index: 9999999999998;
  display: flex;
  justify-content: center;
  align-items: center;

  @keyframes scale-in-out {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
      opacity: 0.7;
    }
    100% {
      transform: scale(1);
    }
  }
  img {
    animation: scale-in-out 1s infinite;
    width: 50px;
    height: auto;
  }
  background-color: #f5f5fd;
}
</style>

<template>
  <div class="more-btn">
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.more-btn {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  // padding: 4px;
  gap: 8px;
  width: 24px;
  height: 24px;
  background: #f5f5fd;
  border: 1px solid #eaeafb;
  border-radius: 16px;
}
.dot {
  width: 2.67px;
  height: 2.67px;
  background: #38405b;
}
</style>

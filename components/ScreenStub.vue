<template>
  <div class="screen-stub">
    <img class="header" src="@/assets/images/logo.png" width="134" height="24" />
    <div class="msg">
      <span class="title"
        >{{ device }} version <br />
        under development
      </span>
      <span class="message"
        >Please rotate your tablet to landscape orientation to view Talentum</span
      >
      <div class="view-desktop-btn" @click="setDesktop">View Desktop Version</div>
    </div>
  </div>
</template>
<script setup>
const device = computed(() => {
  const width = window.innerWidth;
  if (width <= 880) {
    return 'Mobile';
  } else if (width > 880 && width < 1024) {
    return 'Tablet';
  } else if (width >= 1024 && width < 1330) {
    return 'Small Laptop';
  }
});

onMounted(() => {
  localStorage.scale = false;
});

const setDesktop = () => {
  if (device.value === 'Tablet') {
    localStorage.scale = 0.5;
  } else if (device.value === 'Mobile') {
    localStorage.scale = 0.3;
  } else if (device.value === 'Small Laptop') {
    localStorage.scale = 0.75;
  }
  window.location.href = '/';
};
</script>
<style scoped lang="scss">
.screen-stub {
  height: 100vh;
  width: 100vw;
  background: url('@/assets/images/stub-bg.png') no-repeat;
  background-size: cover;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 9999999999999;
  .header {
    margin: 24px auto;
  }
  .msg {
    display: flex;
    flex-direction: column;
    text-align: center;
    gap: 32px;
    margin-top: 25vh;

    .title {
      color: $white;
      text-align: center;
      font-family: 'Basis Grotesque Pro';
      font-size: 48px;
      font-style: normal;
      font-weight: 350;
      line-height: 64px;
    }
    .message {
      color: $default-border;
      text-align: center;
      font-family: 'Basis Grotesque Pro';
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 24px;
      margin: 0 25px;
    }
    .view-desktop-btn {
      cursor: pointer;
      display: flex;
      padding: 4px 8px;
      align-items: center;
      margin: 0 auto;
      gap: 8px;
      border-radius: 8px;
      background: $default-bg;
      color: $secondary;
      width: fit-content;
      font-family: 'Basis Grotesque Pro';
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: 20px;
    }
  }
}
</style>

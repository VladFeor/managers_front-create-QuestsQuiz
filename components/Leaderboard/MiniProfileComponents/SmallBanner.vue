<template>
  <div class="main">
    <div
      class="background-block"
      :class="{ 'default-block': !banner }"
      :style="{ backgroundImage: `url(${banner})` }"
    ></div>
  </div>
</template>
<script setup>
const props = defineProps({
  banner: {
    type: String,
    default: '',
  },
});
</script>

<style scoped lang="scss">
.main {
  width: 600px;
  height: 120px;
  position: absolute;
  border-radius: 16px 16px 0 0;
  overflow: hidden;
  left: 0;
  top: 0;
  z-index: 0;
  .default-block {
    background: url('@/assets/images/default-back.png') !important;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    width: 100%;
    height: 100%;
  }
  .background-block {
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    width: 100%;
    height: 100%;
  }
}
</style>

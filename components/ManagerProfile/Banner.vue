<template>
  <div class="main">
    <div
      class="background-block"
      :class="{ 'default-block': !banner }"
      :style="{ backgroundImage: `url(${banner})` }"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'Banner',
  props: {
    banner: {
      type: String,
      default: '',
    },
  },
};
</script>

<style scoped lang="scss">
.main {
  width: 100vw;
  height: 260px;
  position: absolute;
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

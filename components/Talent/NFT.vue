<template>
  <div class="nft">
    <div class="overlay">
      <span class="title">NFT Name Personal Art Level 1</span>
      <span class="name">Project Name</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NFT',
  props: {
    nft: {
      type: Object,
      default: () => {}
    }
  }
};
</script>

<style scoped lang="scss">
.nft {
  border-radius: 8px;
  overflow: hidden;
  width: auto;
  width: 103px;
  height: 103px;
  background: url('@/assets/images/nft.png');
  background-size: cover;
  background-repeat: no-repeat;
  .overlay {
    display: none;
  }
  &:hover {
    .overlay {
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      position: absolute;
      width: 103px;
      height: 103px;
      padding: 8px;
      border-radius: 8px;
      background: rgba($black, 0.5);
      z-index: 0;
      .title {
        font-family: 'Basis Grotesque Pro';
        font-style: normal;
        font-weight: 500;
        font-size: 12px;
        line-height: 16px;
        letter-spacing: 0.014em;
        width: 100%;
        font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
        color: $white;
      }
      .name {
        font-family: 'Basis Grotesque Pro';
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 16px;
        display: flex;
        align-items: flex-end;
        letter-spacing: 0.014em;
        font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
        color: $white;
      }
    }
  }
}
</style>

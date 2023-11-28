<template>
  <div class="card">
    <img src="@/assets/images/Colaborators.png" alt="" />
    <div class="soon">Coming soon!</div>
  </div>
</template>

<script>
export default {
  name: 'CollaborationsCard',
};
</script>

<style scoped lang="scss">
.card {
  width: 360px;
  height: 292px;
  background: $default-badge-border;
  display: flex;
  flex-direction: column;
  border: 1px dashed $colabs-bg;
  border-radius: 16px;
  align-content: center;
  align-items: center;
  img {
    margin-top: 25%;
    width: 192px;
    height: 80px;
  }
  .soon {
    margin-top: 24px;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    color: $default;

  }
}
</style>

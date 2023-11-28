<template>
  <div>
    <BaseLineChart :data="[]" :labels="['June', 'July', 'Aug', 'Sep', 'Oct', 'Nov']"></BaseLineChart>
    <div class="icon">
      <Icon :size="48" :icon="icon" />
      <div>{{title}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmptyChart',
  props: {
    icon: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
  },
};
</script>

<style scoped lang="scss">
.icon {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  bottom: 212px;
  div {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    margin-top: 10px;
    color: $colabs-bg;
  }
}
</style>

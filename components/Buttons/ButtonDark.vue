<template>
  <div class="btn">
    <Icon v-if="icon && revers" :icon="icon" :size="24" class="icon mr-2"></Icon>
    <span>{{ text }}</span>
    <Icon v-if="icon && !revers" :icon="icon" :size="24" class="icon"></Icon>
  </div>
</template>

<script>
export default {
  name: 'ButtonDark',
  props: {
    icon: {
      type: String,
      default: '',
    },
    revers: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      default: 'Dafault Text',
    },
  },
};
</script>

<style scoped lang="scss">
.btn {
  border-radius: 8px;
  display: flex;
  align-items: center;
  padding: 7px 12px;
  width: 100%;
  text-align: center;
  background: $default-border;
  justify-content: center;
  &:hover {
    background: $default;
    cursor: pointer;
    span {
      color: $white;
    }
    .icon {
      filter: invert(91%) sepia(93%) saturate(26%) hue-rotate(246deg) brightness(107%)
        contrast(100%);
    }
  }
  span {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    margin-right: 8px;
    color: $default;
  }
}
</style>

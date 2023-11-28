<template>
  <button>
    <Icon :icon="icon" :size="24"></Icon>
  </button>
</template>

<script>
export default {
  name: 'SocialButton',
  props: {
    icon: {
      type: String,
      default: 'Tik',
    },
  },
};
</script>

<style scoped lang="scss">
button {
  width: 40px;
  height: 40px;
  background: $white;
  border: 1px solid $default-badge-border;
  border-radius: 32px;
  padding: 8px;
  &:hover {
    border: 1px solid $default;
  }
}
</style>

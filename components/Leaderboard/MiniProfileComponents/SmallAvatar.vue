<template>
  <div class="main">
    <div
      class="avatar"
      :class="{ 'default-avatar': !avatar }"
      :style="{ backgroundImage: `url(${avatar})` }"
    >
      <div class="overlay"></div>
      <Tooltip class="rating" tooltipText="Avarage Rating">
        <Icon name="Crown" class="rating__icon" :size="16" />
        <span>{{ rating }}</span>
      </Tooltip>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  avatar: {
    type: String,
    default: '',
  },
  rating: {
    type: Number,
    default: 0,
  },
});
</script>
<style scoped lang="scss">
.main {
  border-radius: 100px;
  border: 3px solid $default-bg;
  background: $default-badge-border;
  z-index: 98;
  position: relative;

  .default-avatar {
    background: url('@/assets/images/default-avatar.png') !important;
    background-repeat: no-repeat;
    background-size: contain;
    display: flex;
    border-radius: 100px;
    align-items: center;
    height: 128px;
    width: 128px;
  }
  .avatar {
    background-size: cover;
    display: flex;
    align-items: center;
    border-radius: 100px;
    background-position: center;
    height: 128px;
    width: 128px;
  }

  .rating {
    position: absolute;
    display: flex;
    align-items: center;
    right: -3px;
    bottom: -3px;
    gap: 4px;
    padding: 3px 8px;
    background: $orange;
    border: 1px solid $orange;
    border-radius: 6px;

    &__icon {
      filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(46deg) brightness(104%) contrast(200%);
    }

    span {
      font-size: 12px;
      line-height: 16px;
      color: $white;
    }
  }
}
</style>

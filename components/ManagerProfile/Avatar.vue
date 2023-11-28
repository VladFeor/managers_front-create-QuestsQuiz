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

<script>
export default {
  name: 'AvatarUploader',
  props: {
    avatar: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 0,
    },
  },
};
</script>
<style scoped lang="scss">
.main {
  border-radius: 100px;
  border: 3px solid $default-bg;
  background: $default-badge-border;
  z-index: 98;
  .default-avatar {
    background: url('@/assets/images/default-avatar.png') !important;
    background-repeat: no-repeat;
    background-size: contain;
    display: flex;
    height: 160px;
    width: 160px;
    border-radius: 100px;
    align-items: center;
  }
  .avatar {
    background-size: cover;
    display: flex;
    height: 160px;
    width: 160px;
    align-items: center;
    border-radius: 100px;
    position: relative;

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
        filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(46deg) brightness(104%)
          contrast(200%);
      }

      span {
        font-size: 12px;
        line-height: 16px;
        color: $white;
      }
    }
  }
}
</style>

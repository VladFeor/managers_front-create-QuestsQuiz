<template>
  <card>
    <div
      class="avatar"
      :style="`background-image: url(${avatar ? avatar : `${defaultImg}`})`"
      style="background-size: cover"
    ></div>
    <div class="content">
      <span class="name">{{ name }}</span>
      <slot></slot>
    </div>
  </card>
</template>

<script>
import defaultImg from '@/assets/images/default-avatar.png';
export default {
  name: 'AmbassadorCard',
  data() {
    return {
      defaultImg,
    };
  },
  props: {
    avatar: { type: String, default: '' },
    name: {
      type: String,
      default: 'artem',
    },
  },
};
</script>

<style scoped lang="scss">
.avatar {
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  width: 88px;
  height: 88px;
  border-radius: 100%;
  overflow: hidden;
}
.content {
  display: flex;
  flex-direction: column;
  margin-left: 16px;
  width: calc(100% - 104px);
  .name {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    line-height: 24px;
    margin-bottom: 8px;
    color: $default;
  }
}
</style>

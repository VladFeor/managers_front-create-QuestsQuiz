<template>
  <div class="reward">
    <img :src="reward.project.logo || defaultBg" />
    <div class="role">{{ reward.role_name }}</div>
    <div class="project">at {{ reward.project.name }}</div>
  </div>
</template>

<script>
import defaultBg from '@/assets/images/default-avatar.png';

export default {
  name: 'DiscordRoleReward',
  props: {
    reward: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      defaultBg,
    };
  },
};
</script>

<style scoped lang="scss">
.reward {
  padding: 3px;
  width: auto;
  max-width: 100%;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  display: flex;
  align-items: center;
  font-feature-settings: 'zero' on;
  border: 1px solid $default-border;
  border-radius: 8px;
  img {
    width: 24px;
    height: 24px;
    margin-right: 8px;
    border-radius: 6px;
  }
  .role {
    color: $default;
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .project {
    margin-left: 4px;
    color: $colabs-bg;
  }
}
</style>

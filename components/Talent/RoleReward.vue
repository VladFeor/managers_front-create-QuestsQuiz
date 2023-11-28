<template>
  <div class="rewards" :class="{ fixedHeight: !rewards.length }">
    <div class="header">
      <span>Discord Role Rewards</span>
      <Icon v-if="rewards.length" icon="Discord-Default" :size="24"></Icon>
    </div>
    <div class="content" v-if="rewards.length">
      <DiscordRoleReward
        v-for="reward in rewards"
        :key="reward.id"
        :reward="reward"
      ></DiscordRoleReward>
    </div>
    <div class="empty-list" v-else>
      <icon icon="icons8-discord-zero" class="icon" :size="48"></icon>
      <span>There’s no reward yet</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  rewards: {
    type: Array,
    default: [],
  },
});
</script>

<style scoped lang="scss">
.rewards {
  background: $white;
  border: 1px solid $default-border;
  border-radius: 16px;
  padding: 16px;

  &.fixedHeight {
    height: 184px;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    span {
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 500;
      font-size: 18px;
      line-height: 24px;
      font-feature-settings: 'zero' on;
      color: $secondary;
    }
  }
  .content {
    margin-top: 24px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
  }
  .empty-list {
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 8px;
    margin-top: 24px;
    padding: 2px 0px 20px;

    * {
      margin: auto;
    }
    span {
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      text-align: center;
      font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
      color: $colabs-bg;
    }
  }
}
</style>

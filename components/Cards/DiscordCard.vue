<template>
  <div v-if="task" class="discord-card">
    <div class="discord-project">
      <div class="discord-project_title">{{ task.project.name }}</div>
      <div v-if="task.project.medium_username" class="discord-project_subtitle">
        {{ task.project.medium_username ? task.project.medium_username : '' }}
      </div>
    </div>
    <div v-if="isDisabled" class="discord-link">
      <span>Join the {{ task.verifier.discord_guild_name }} Server</span>
      <Icon name="Discord-Default" :size="26" />
    </div>
    <div v-else class="discord-link">
      <a :href="task.verifier.invite_link" target="_blank"
        >Join the {{ task.verifier.discord_guild_name }} Server</a
      >
      <Icon name="Discord-Default" :size="26" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  task: { type: Object, default: null },
  isDisabled: { type: Boolean, default: false },
});
</script>

<style lang="scss" scoped>
.discord-link {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 7px 12px 7px 16px;
  gap: 8px;
  width: fit-content;
  height: 40px;
  background: #dad9f7;
  border-radius: 8px;

  a {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: #38405b;
  }
}
.discord-card {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  gap: 24px;
  width: 600px;
  height: 74px;
  background: #f5f5fd;
  border: 1px solid #dad9f7;
  border-radius: 8px;
  .discord-project {
    &_title {
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
      display: flex;
      align-items: center;
      font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
      color: #38405b;
    }
    &_subtitle {
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;
      display: flex;
      align-items: center;
      letter-spacing: 0.014em;
      font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
      color: #6a6d8f;
    }
  }
}
</style>

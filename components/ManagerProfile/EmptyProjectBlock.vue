<template>
  <div class="empty-project-list">
      <Icon icon="icons8-futurama-bender" :size="48" class="icon"></Icon>
      <div class="title">The manager is not involved in any project yet</div>
      <InviteToProject></InviteToProject>
  </div>
</template>

<script>
import InviteToProject from "./InviteToProject";
export default {
  name: "EmptyProjectBlock",
  components: {InviteToProject}
}
</script>

<style scoped lang="scss">
.empty-project-list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0px 0px 16px;
  gap: 32px;
  width: 100%;
  height: 312px;
  background: $default-badge-border;
  border-radius: 16px;
  .title {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $secondary;
  }
  .icon {
    max-height: 48px !important;
    max-width: 48px !important;
  }
}
</style>
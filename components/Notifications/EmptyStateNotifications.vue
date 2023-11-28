<template>
  <div class="empty">
    <Icon name="icons8-futurama-zoidberg" :size="48"></Icon>
    <span class="title">There are no unread notifications</span>
  </div>
</template>
<script setup></script>
<style scoped lang="scss">
.empty {
  display: flex;
  padding: 80px 0px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  width: 100%;
  align-self: stretch;
  .title {
    color: $colabs-bg;
    text-align: center;
    font-variant-numeric: lining-nums tabular-nums slashed-zero;

    font-family: 'Basis Grotesque Pro';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px; /* 150% */
  }
}
</style>

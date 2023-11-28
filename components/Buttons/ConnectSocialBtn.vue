<template>
  <div class="connect-twitter-btn">
    <Icon :name="props.name + '-Default'" :size="20" /> <span>Connect {{ props.name }}</span>
  </div>
</template>

<script setup>
const props = defineProps({
  name: { type: String, default: '' },
});
</script>

<style lang="scss" scoped>
.connect-twitter-btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 12px;
  gap: 8px;
  min-width: 159px;
  width: fit-content;
  height: 40px;
  background: #eaeafb;
  border: 1px solid #dad9f7;
  border-radius: 8px;
  cursor: pointer;

  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  font-feature-settings: 'zero' on;
  color: $default;
}
</style>

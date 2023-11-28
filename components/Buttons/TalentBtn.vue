<template>
  <div class="talent-btn">
    <Talent :text="props.name" :img="avatar ? avatar : ''" />
    <Icon class="close-talent-btn" @click="emit('remove', props.id)" name="Delete" size="20" />
  </div>
</template>

<script setup>
const props = defineProps({
  name: { type: String, default: 'Adison Culhane' },
  avatar: { type: String, default: '' },
  id: { type: Number, default: 0 },
});
const emit = defineEmits(['remove']);
</script>

<style lang="scss" scoped>
.talent-btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 12px;
  gap: 8px;
  width: fit-content;
  // height: 40px;
  background: $white;
  border: 1px solid $default-border;
  border-radius: 8px;
}
.close-talent-btn {
  cursor: pointer;
}
</style>

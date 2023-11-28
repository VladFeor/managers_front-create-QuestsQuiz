<template>
  <Modal @close="$emit('close')">
    <div class="title">Project Owner Changing</div>
    <div class="sub-title">You are going to change the project owner</div>
    <div class="info">
      <Talent
        :img="po ? po.avatar : me.avatar || defaultBg"
        :text="po ? po.name : me.name"
      ></Talent>
      <Icon icon="WIP" :size="24"></Icon>
      <Talent :img="talent.avatar || defaultBg" :text="talent.name"></Talent>
    </div>

    <div class="flex justify-between gap-x-4">
      <BaseButton text="Cancel" type="secondary" @click="$emit('close')" />
      <BaseButton text="Confirm" type="normal" @click="$emit('changeRole')" />
    </div>
  </Modal>
</template>
<script setup>
import defaultBg from '@/assets/images/default-avatar.png';
import { useUserStore } from '~/store';
const myStore = useUserStore();
const me = computed(() => myStore.getUser);
const props = defineProps({
  talent: {
    type: Object,
    default: () => {},
  },
  po: {
    type: Object,
    default: () => {},
  },
});
</script>
<style scoped lang="scss">
.info {
  display: flex;
  padding: 20px 16px;
  justify-content: center;
  align-items: center;
  gap: 24px;
  align-self: stretch;
  border-radius: 8px;
  border: 1px solid #eaeafb;
  margin: 24px 0;
  background: #fff;
  overflow: hidden;
}
.title {
  color: $section-title;
  text-align: center;
  /* Heading 4 */
  font-size: 24px;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 400;
  line-height: 40px;
}
.sub-title {
  color: $section-title;
  text-align: center;
  font-size: 16px;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
}
</style>

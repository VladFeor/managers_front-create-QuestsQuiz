<template>
  <Modal @close="$emit('close')" customWidth="360px">
    <div class="container-modal">
      <span class="title">Removing from the Talentum</span>
      <span>
        <span class="sub-title" v-if="needWithdraw"
          >You are going to remove {{ talents.length }} talents from the selected Talentum, some of
          them are pending withdrawal, the rest can be removed now</span
        >
        <span class="sub-title" v-else>You are going to remove {{ talents.length }} talents </span>

        <span v-if="!needWithdraw" class="sub-title">from the Talentum platform</span>
      </span>

      <div class="container-item">
        <Talent
          v-for="talent in talents"
          :key="talent.id"
          :text="talent.name"
          :img="talent.logo || defaultBg"
          reduceLength="15"
        />
      </div>
    </div>
    <div class="controller">
      <div class="cancel" @click="$emit('close')">Cancel</div>
      <div v-if="!needWithdraw" class="save" @click="apply">Remove</div>
    </div>
  </Modal>
</template>
<script setup>
import defaultBg from '@/assets/images/default-avatar.png';
const props = defineProps({
  talents: { type: Array, default: () => [] },
  needWithdraw: { type: Boolean, default: false },
});
const emit = defineEmits(['remove', 'close']);

const open = ref(true);
const currentProject = ref(props.project);
const apply = () => {
  emit('remove');
};
</script>
<style scoped lang="scss">
* {
  font-family: 'Basis Grotesque Pro';
  text-align: center;
}
.title {
  font-size: 24px;
  color: $section-title;
  line-height: 40px;
}
.sub-title {
  font-size: 16px;
  color: $section-title;
  line-height: 24px;
}
.controller {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  .cancel {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 7px 12px;
    gap: 8px;
    width: 100%;
    height: 40px;
    background: $default-border;
    border-radius: 8px;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $default;

    &:hover {
      cursor: pointer;
      background: $not-active-border;
    }
  }
  .save {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 7px 12px;
    gap: 8px;
    width: 100%;

    height: 40px;
    background: $orange;
    border-radius: 8px;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $white;
    &:hover {
      cursor: pointer;
      background: $orange-active;
    }
  }
}
.container-item {
  margin: 0 auto;
  width: 296px;
  display: flex;
  padding: 16px;
  gap: 16px;
  flex-direction: column;
  border-radius: 8px;
  border: 1px solid $default-badge-border;
  background: $white;
}
.container-modal {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>

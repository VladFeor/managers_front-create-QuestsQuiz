<template>
  <Modal @close="$emit('close')">
    <div class="container-modal">
      <span class="title">Removing from the Project</span>
      <div class="container-item" v-if="project">
        <Talent :text="project.name" :img="project.logo || defaultBg" reduceLength="15" square />
      </div>
      <SelectProject
        top
        class="m-auto w-full relative"
        @select="currentProject = $event"
        v-else
      ></SelectProject>
      <span class="sub-title" v-if="needWithdraw"
        >You are going to remove {{ talents.length }} talents <br />from the selected project,
        <br />some of them are pending withdrawal, the rest can be removed now</span
      >
      <span class="sub-title" v-else
        >You are going to remove {{ talents.length }} talents <br />from the selected project</span
      >

      <div class="container-item">
        <div class="item" v-for="talent in talents" :key="talent.id">
          <Talent :text="talent.name" :img="talent.logo || defaultBg" reduceLength="15" />
          <div class="status" v-if="talent.withdrawal_requests_exists">Pending</div>
        </div>
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
  project: { type: Object, default: () => {} },
  needWithdraw: { type: Boolean, default: false },
});
const emit = defineEmits(['remove', 'close']);

const open = ref(true);
const currentProject = ref(props.project);
const apply = () => {
  let res = {
    project: currentProject.value,
  };

  emit('remove', res);
};
</script>
<style scoped lang="scss">
* {
  font-family: 'Basis Grotesque Pro';
  text-align: center;
}
.title {
  font-size: 24px;
  color: #1a1d29;
  line-height: 40px;
}
.sub-title {
  font-size: 16px;
  color: #1a1d29;
  line-height: 24px;
}

.controller {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  .cancel {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 7px 12px;
    gap: 8px;
    width: 156px;
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
    width: 156px;
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
  padding: 8px 16px;
  gap: 16px;
  flex-direction: column;
  border-radius: 8px;
  border: 1px solid #eaeafb;
  background: #fff;
  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .status {
      color: #aaa7cc;
      text-align: right;
      font-size: 12px;
      font-family: 'Basis Grotesque Pro';
      font-weight: 500;
      line-height: 16px;
      letter-spacing: 0.168px;
    }
  }
}
.container-modal {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>

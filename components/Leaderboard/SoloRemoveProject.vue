<template>
  <Modal @close="$emit('close')">
    <div class="container-modal">
      <span class="title">Removing from the Project</span>
      <span class="sub-title">You’re going to remove</span>
      <div class="container-item">
        <Talent :text="talent.name" :img="talent.avatar || defaultBg" reduceLength="15" />
      </div>
      <span class="sub-title">from selected Project</span>
      <div class="container-item" v-if="project">
        <Talent :text="project.name" :img="project.logo || defaultBg" reduceLength="15" square />
      </div>
      <SelectProject
        class="m-auto w-full"
        @select="currentProject = $event"
        v-else
        top
      ></SelectProject>

      <span class="sub-title" v-if="needWithdraw"
        >First, you have to approve <br />
        all withdrawal requests.
      </span>
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
  talent: { type: Object, default: () => {} },
  project: { type: Object, default: () => {} },
  needWithdraw: { type: Boolean, default: false },
});
const emit = defineEmits(['remove', 'close']);

const open = ref(true);
const currentProject = ref(props.project);
const apply = () => {
  let res = {
    talent: props.talent,
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
  margin-top: 50px;
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
  display: flex;
  padding: 8px 16px;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  border: 1px solid #eaeafb;
  background: #fff;
}
.container-modal {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>

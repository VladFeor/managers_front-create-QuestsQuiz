<template>
  <Modal @close="$emit('close')" customWidth="360px">
    <div class="container-modal" v-if="talents.length > 1">
      <span class="title">Invite to the Project</span>
      <div class="container-item" v-if="project">
        <Talent :text="project.name" :img="project.logo || defaultBg" reduceLength="15" square />
      </div>
      <SelectProject
        top
        class="m-auto w-full relative h-14"
        @select="currentProject = $event"
        v-else
      ></SelectProject>
      <span
        class="sub-title"
        v-if="talents.find((i) => i.invitation_status && i.invitation_status === 'accepted')"
        >You are going to invite {{ talents.length }} talents <br />
        to the selected project, some of them <br />
        have already joined this project</span
      >
      <span class="sub-title" v-else
        >You are going to invite {{ talents.length }} talents <br />
        to the selected project</span
      >

      <div class="container-item" :class="{ 'blur-bottom': talents.length > 5 }">
        <div class="item" v-for="talent in talents" :key="talent.id">
          <Talent :text="talent.name" :img="talent.logo || defaultBg" reduceLength="15" />
          <div
            class="status"
            v-if="talent.invitation_status && talent.invitation_status === 'accepted'"
          >
            Already joined
          </div>
          <div
            class="status"
            v-if="talent.invitation_status && talent.invitation_status === 'pending'"
          >
            Pending
          </div>
        </div>
      </div>
    </div>
    <div class="container-modal" v-if="talents.length === 1">
      <span class="title">Invite to the Project</span>
      <div>
        <span class="sub-title" v-if="invintationStatus"
          >You are going to invite {{ talents.length }} talents <br />
          to the selected project, some of them <br />
          have already joined this project</span
        >
        <div v-else class="container-modal__talent">
          <span class="sub-title"> You are going to invite </span>
          <div class="container-item container-item__one">
            <div class="item" v-for="talent in talents" :key="talent.id">
              <Talent :text="talent.name" :img="talent.logo || defaultBg" reduceLength="15" />
              <div
                class="status"
                v-if="talent.invitation_status && talent.invitation_status === 'accepted'"
              >
                Already joined
              </div>
              <div
                class="status"
                v-if="talent.invitation_status && talent.invitation_status === 'pending'"
              >
                Pending
              </div>
            </div>
          </div>
          <span class="sub-title"> to the selected project </span>
        </div>
      </div>

      <div class="container-item" v-if="project">
        <Talent :text="project.name" :img="project.logo || defaultBg" reduceLength="15" square />
      </div>
      <SelectProject
        top
        class="m-auto w-full relative h-14"
        @select="currentProject = $event"
        v-else
      ></SelectProject>
    </div>
    <div class="controller" :style="{ marginTop: talents.length === 1 ? '40px' : '0px' }">
      <div class="cancel" @click="$emit('close')">Cancel</div>
      <div class="save" @click="apply">Invite</div>
    </div>
  </Modal>
</template>
<script setup>
import defaultBg from '@/assets/images/default-avatar.png';
const props = defineProps({
  talents: { type: Array, default: () => [] },
  project: { type: Object, default: () => {} },
});
const emit = defineEmits(['remove', 'close']);

const open = ref(true);
const currentProject = ref(props.project);

const invintationStatus = computed(() =>
  props.talents.find((i) => i.invitation_status && i.invitation_status === 'accepted'),
);

const apply = () => {
  let res = {
    project: currentProject.value,
  };

  emit('invite', res);
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

  &__one {
    margin-top: 40px;
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
  max-height: 258px;
  overflow: hidden;
  position: relative;

  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .status {
      color: $colabs-bg;
      text-align: right;
      font-size: 12px;
      font-family: 'Basis Grotesque Pro';
      font-weight: 500;
      line-height: 16px;
      letter-spacing: 0.168px;
    }
  }

  &__one {
    width: fit-content;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    padding: 8px 16px;
  }
}
.blur-bottom {
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 73px;
    background: linear-gradient(180deg, rgba(245, 245, 253, 0) 0%, rgba(245, 245, 253, 1) 100%);
  }
}
.container-modal {
  display: flex;
  flex-direction: column;
  gap: 24px;

  &__talent {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-bottom: 16px;
  }
}
</style>

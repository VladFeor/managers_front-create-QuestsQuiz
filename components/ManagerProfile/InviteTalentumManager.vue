<template>
  <div class="invite" @click="show = true">
    Invite to the Project <Icon class="icon-ref" name="Refferals" :size="24"></Icon>
  </div>
  <Modal @close="show = false" v-if="show">
    <div class="modal">
      <div class="title">Inviting the Talentum Manager to a New Project</div>
      <div class="sub-title">
        Select the project to which you want to invite the talentum manager and assign his role
      </div>
      <SelectProject
        :default="defaultProject ?? null"
        @select="project = $event"
        style="max-width: 336px"
        top
      />
      <SelectRole :options="roles" @input="role = $event" />

      <div class="flex justify-between gap-x-4">
        <BaseButton text="Cancel" type="secondary" @click="$emit('close')" />
        <BaseButton text="Send Invitation" type="normal" @click="sendInvite()" />
      </div>
    </div>
  </Modal>
</template>
<script setup>
import { useAssetsStore, useManagersStore } from '~/store';
import AxiosService from '~/service/axiosService';
import { computed } from 'vue';
const asset = useAssetsStore;
const managerStore = useManagersStore();

const roles = computed(() =>
  useAssetsStore().getRoles.filter(
    (role) => role.name !== 'Talentum Manager' && role.name !== 'Project Owner',
  ),
);
const email = ref('');
const emit = defineEmits(['close']);
const props = defineProps({
  defaultProject: {
    type: Object,
    default: null,
  },
});
const manager = computed(() => managerStore.getManager);
const project = ref(0);
const role = ref(0);
const nuxtApp = useNuxtApp();
const show = ref(false);
const sendInvite = () => {
  AxiosService.post(useRuntimeConfig().public.apiBaseV2 + 'managers', {
    project_id: project.value.id,
    role_id: role.value.id,
    email: manager.value.email,
  })
    .then(() => {
      managerStore.getAllManagersAction();
      nuxtApp.$alert.show('Success', {
        type: 'success',
        timeout: 5000,
      });
      emit('close');
    })
    .catch((e) => {
      nuxtApp.$alert.show(e.response.data.message, {
        type: 'error',
        timeout: 5000,
      });
    });
};
</script>

<style scoped lang="scss">
.modal {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 12px 32px;
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
.invite {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 7px 12px;
  gap: 8px;
  height: 40px;
  background: $orange;
  border-radius: 8px;
  color: $white;
  width: fit-content;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  cursor: pointer;
  .icon-ref {
    filter: invert(0%) sepia(138%) saturate(0) hue-rotate(358deg) brightness(272%) contrast(147%);
  }
  &:hover {
    background: $orange-active;
  }
}
</style>

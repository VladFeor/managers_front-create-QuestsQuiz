<template>
  <Modal @close="$emit('close')">
    <div class="modal">
      <div class="title">Inviting a New Manager to Talentum</div>
      <div class="sub-title" v-if="role.name !== 'Talentum Manager'">
        Select the project to which you want to invite a manager and assign his role
      </div>
      <SelectProject
        v-if="role.name !== 'Talentum Manager'"
        :default="defaultProject ?? null"
        @select="project = $event"
        style="max-width: 336px"
        top
      />
      <SelectRole :options="roles" @input="role = $event" />
      <div class="sub-title">
        Write the email address where the invitation will be sent or select from the list of users
      </div>
      <SelectUser
        withTalents
        @blur="email = $event"
        @select="talent = $event"
        style="max-width: 336px"
      />
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
const asset = useAssetsStore;
const managerStore = useManagersStore();

const roles = computed(() => useAssetsStore().getRoles);
const email = ref('');
const emit = defineEmits(['close']);
const props = defineProps({
  defaultProject: {
    type: Object,
    default: null,
  },
});
const talent = ref(0);
const project = ref(0);
const role = ref(0);
const nuxtApp = useNuxtApp();

const sendInvite = () => {
  AxiosService.post(useRuntimeConfig().public.apiBaseV2 + 'managers', {
    project_id: role.value.name !== 'Talentum Manager' ? project.value.id : null,
    role_id: role.value.id,
    email: talent.value.email || email.value,
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
      console.log(e);
      if (e.response.data.errors) {
        const parseErrors = Object.values(e.response.data.errors);
        parseErrors.forEach((errorItem) => {
          nuxtApp.$alert.show(errorItem.join('\n'), {
            type: 'error',
            timeout: 5000,
          });
        });
      } else {
        nuxtApp.$alert.show(e.response.data.message, {
          type: 'error',
          timeout: 5000,
        });
      }
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
</style>

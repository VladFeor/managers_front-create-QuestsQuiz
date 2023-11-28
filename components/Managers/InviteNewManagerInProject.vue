<template>
  <Modal @close="$emit('close')">
    <div class="modal">
      <div class="title">Inviting a New Manager to {{ project.name }}</div>
      <div class="sub-title">Assign the role for a new manager</div>
      <SelectRole @input="role = $event" :options="rolesList" />
      <div class="sub-title">
        Write the email address where the invitation will be sent or select from the list of users
      </div>
      <SelectUser @blur="email = $event" style="max-width: 336px" @select="talent = $event" />
      <div class="flex justify-between gap-x-4">
        <BaseButton text="Cancel" type="secondary" @click="$emit('close')" />
        <BaseButton text="Send Invitation" type="normal" @click="changeRoleCheck" />
      </div>
    </div>
  </Modal>
  <ProjectOwnerChange
    v-if="showPoChange"
    @changeRole="changeProjectOwner()"
    @close="showPoChange = false"
    :talent="talent.name ? talent : { name: email }"
  ></ProjectOwnerChange>
</template>
<script setup>
import { useAssetsStore, useManagersStore, useUserStore } from '~/store';
import AxiosService from '~/service/axiosService';
import { computed, inject, ref } from 'vue';
const myStore = useUserStore();
const nuxtApp = useNuxtApp();
const email = ref('');
const managerStore = useManagersStore();
const myProject = computed(() => myStore.getUserProjectId);
const talent = ref(0);
const asset = useAssetsStore;
const props = defineProps({
  project: {
    type: Object,
    default: () => {},
  },
});
const roles = inject('roles');
const {
  isSuperAdmin,
  isProjectOwner,
  isProjectManager,
  isProjectAdministrator,
  isCatapultManager,
} = roles;
const rolesList = computed(() => {
  console.log('useAssetsStore().getRoles', useAssetsStore().getRoles);
  if (isSuperAdmin.value) {
    return useAssetsStore().getRoles;
  } else if (isProjectAdministrator.value) {
    return useAssetsStore().getRoles.filter(
      (i) => i.name !== 'Talentum Manager' && i.name !== 'Project Owner',
    );
  } else {
    return useAssetsStore().getRoles.filter((i) => i.name !== 'Talentum Manager');
  }
});
const emit = defineEmits(['close']);
const role = ref('');
const showPoChange = ref(false);

const changeRoleCheck = () => {
  if (role.value.name === 'Project Owner' && isProjectOwner.value) {
    showPoChange.value = true;
  } else {
    sendInvite();
  }
};
function changeProjectOwner() {
  console.log(props.talent);
  if (!props.talent) {
    sendInvite();
    return;
  }
  AxiosService.put(
    useRuntimeConfig().public.apiBaseV2 + `projects/${myProject.value}/owner/${props.talent.id}`,
    {},
  )
    .then(() => {
      managerStore.getAllManagersInProjectAction(myProject.value);
      nuxtApp.$alert.show('Success', {
        type: 'success',
        timeout: 5000,
      });
      emit('close');
    })
    .catch((e) => {
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
}

const sendInvite = () => {
  console.log(talent);
  AxiosService.post(useRuntimeConfig().public.apiBaseV2 + 'managers', {
    project_id: props.project.id,
    role_id: role.value.id,
    email: talent.value.email || talent.value.name || email.value,
  })
    .then(() => {
      managerStore.getAllManagersInProjectAction(myProject.value);
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
</style>

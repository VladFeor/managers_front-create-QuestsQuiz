<template>
  <Modal @close="$emit('close')">
    <div class="modal">
      <div class="title">Inviting the Talentum Manager to {{ project.name }}</div>
      <div class="sub-title">Assign the role for talentum manager</div>
      <SelectRole @input="role = $event" :options="rolesList"></SelectRole>

      <div class="flex justify-between gap-x-4">
        <BaseButton text="Cancel" type="secondary" @click="$emit('close')" />
        <BaseButton text="Send Invitation" type="normal" @click="$emit('send', role)" />
      </div>
    </div>
  </Modal>
</template>
<script setup>
import { useAssetsStore } from '~/store';
import { computed, inject } from 'vue';
const props = defineProps({
  project: {
    type: Object,
    default: () => {},
  },
});
const asset = useAssetsStore;
const role = ref(null);

const roles = inject('roles');
const {
  isSuperAdmin,
  isProjectOwner,
  isProjectManager,
  isProjectAdministrator,
  isCatapultManager,
} = roles;
const rolesList = computed(() => {
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

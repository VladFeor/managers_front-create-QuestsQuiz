import { computed } from 'vue';
import { useUserStore } from '~/store/user';

export default function useRoles() {
  const userStore = useUserStore();

  const isProjectAdministrator = computed(() => userStore.hasRole('projectadministrator'));
  const isSuperAdmin = computed(() => userStore.hasRole('superadmin'));
  const isAdminSupport = computed(() => userStore.hasRole('adminsupport'));
  const isProjectManager = computed(() => userStore.hasRole('projectmanager'));
  const isProjectOwner = computed(() => userStore.hasRole('projectowner'));
  const isCatapultManager = computed(() => userStore.hasRole('talentummanager'));
  return {
    isProjectOwner,
    isSuperAdmin,
    isProjectAdministrator,
    isAdminSupport,
    isProjectManager,
    isCatapultManager,
  };
}

/*

----USAGE IN COMPONENT----
<script setup>
import { inject } from 'vue';

const roles = inject('roles');

const { isSuperAdmin, isAdminSupport, isUser } = roles;
</script>
 */

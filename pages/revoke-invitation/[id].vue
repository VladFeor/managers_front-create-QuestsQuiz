<template></template>
<script setup>
import AxiosService from '~/service/axiosService';

import { useAuthStore } from '~/store';
import { useRouter, useRoute } from 'vue-router';

const auth = useAuthStore();
definePageMeta({ layout: 'auth' });

const token = computed(() => auth.getToken);
const router = useRouter();
const route = useRoute();

try {
  AxiosService.get(useRuntimeConfig().public.apiBase + `invitations/revoke/${route.params.id}`)
    .then((response) => {
      AxiosService.get(useRuntimeConfig().public.apiBase + `invitations/revoke/${route.params.id}`)
        .then(() => {
          if (token.value) {
            router.push(`/projects/${response.data.project_id}`);
          } else {
            router.push(`/login`);
          }
        })
        .catch((e) => {
          router.push(`/login`);
        });
    })
    .catch((e) => {
      router.push(`/login`);
    });
} catch (e) {
  router.push(`/login`);
}
</script>
<style scoped lang="scss"></style>

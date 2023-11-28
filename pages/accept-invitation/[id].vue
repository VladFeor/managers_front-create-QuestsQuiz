<template></template>
<script setup>
import AxiosService from '~/service/axiosService';
definePageMeta({ layout: 'auth' });

import { useAuthStore } from '~/store';
import { useRouter, useRoute } from 'vue-router';

const auth = useAuthStore();

const token = computed(() => auth.getToken);
const router = useRouter();
const route = useRoute();

AxiosService.get(useRuntimeConfig().public.apiBase + `invitations/verify/${route.params.id}`)
  .then(async (response) => {
    localStorage.email = response.data.email;
    localStorage.in_code = route.params.id;
    if (response.data.request_registration) {
      console.log(response.data.email);
      await router.push(`/sign-up`);
    } else {
      AxiosService.get(useRuntimeConfig().public.apiBase + `invitations/accept/${route.params.id}`)
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
    }
  })
  .catch((e) => {
    router.push(`/login`);
  });
</script>
<style scoped lang="scss"></style>

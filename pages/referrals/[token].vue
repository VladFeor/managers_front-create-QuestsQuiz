<script setup>
import AxiosService from '~/service/axiosService';
import { useRoute } from 'vue-router';
const route = useRoute();
const router = useRouter();

onMounted(() => {
  AxiosService.get(useRuntimeConfig().public.apiBase + `invitations/parse/${route.params.token}`)
    .then((res) => {
      console.log(res);
      router.push(`/projects/${res.data.project_id}`);
    })
    .catch((e) => {
      router.push('/');
      console.error(e);
    });
});
</script>
<template></template>

<template>
  <ProjectDetailPage :project-id="route.params.id" />
</template>

<script setup>
  import { ProjectDetailPage } from "@/components";
  const route = useRoute();
</script>

<style scoped lang="scss">

</style>
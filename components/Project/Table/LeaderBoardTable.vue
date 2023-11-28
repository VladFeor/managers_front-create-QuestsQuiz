<template>
  <LeaderboardProject :search="search" :default-project="project" />
</template>

<script setup>
import { Leaderboard } from '@/components/'
import {ref} from "vue";
const props = defineProps({
  project: {
    type: Object,
    default: null
  }
})
const search = ref('');
</script>

<style scoped lang="scss">

</style>
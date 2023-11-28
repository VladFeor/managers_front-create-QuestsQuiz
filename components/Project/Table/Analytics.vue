<template>
  <div class="text-gray-900 text-[24px] font-normal leading-10 mt-12 mb-4">
    Social Networks Followers
  </div>
  <SocialNetworksChart v-if="project" :project-id="project.id" />
  <div class="text-gray-900 text-[24px] font-normal leading-10 mt-12 mb-4">Tasks</div>
  <TasksChart v-if="project" :project-id="project.id" />
  <div class="text-gray-900 text-[24px] font-normal leading-10 mt-12 mb-4">Talents Activity</div>
  <TalentsActivityChart :project-id="project.id" />
  <div class="text-gray-900 text-[24px] font-normal leading-10 mt-12 mb-4">USDT Has Been Paid</div>
  <USDTHasBeenPaidChart :dates-chars="datesChars" :project-id="project.id" />
</template>

<script setup>
import { defineProps } from 'vue';
import { SocialNetworksChart, TasksChart } from '@/components/';
const props = defineProps({
  project: {
    type: Object,
    default: false,
  },
});
const datesChars = [
  { title: 'D', id: 'd' },
  { title: 'W', id: 'w' },
  { title: 'M', id: 'm' },
  { title: 'Q', id: 'm3' },
  { title: 'Y', id: 'y' },
];
</script>

<style scoped lang="scss"></style>

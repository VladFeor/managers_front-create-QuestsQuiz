<template>
  <ContentBox class="h-auto w-full p-4 bg-white min-h-[184px] mt-[24px]">
    <h5 class="font-medium text-[#6A6D8F] text-lg leading-6">Upcoming Events</h5>
    <template v-if="project.events && project.events.length > 0">
      <ProjectEvent
        v-for="event in project.events"
        :event="event"
        class="mt-6"
        @remove="$emit('remove', event)"
      />
    </template>
    <ProjectEventEmpty v-else class="mt-6" />

    <!--    <button type="button" v-if="isSuperAdmin || isProjectOwner"-->
    <!--            class="w-[151px] h-8 px-2 py-[4px] bg-orange-500 rounded-lg flex justify-start items-center gap-2 mt-6">-->
    <!--      <div class="justify-start items-start gap-[10px] flex">-->
    <!--        <div class="text-white text-[14px] font-medium leading-tight">Create an Event</div>-->
    <!--        <img src="@/assets/icons/create-white.svg" height="24" />-->
    <!--      </div>-->
    <!--    </button>-->
  </ContentBox>
</template>

<script setup lang="ts">
const props = defineProps(['project']);
const roles: any = inject('roles') || {};
const { isSuperAdmin, isProjectOwner } = roles;
</script>

<style scoped lang="scss"></style>

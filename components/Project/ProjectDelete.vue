<template>
  <div class="relative h-10">
    <div @click="showDeleteButton = !showDeleteButton"
         :class="`cursor-pointer w-10 h-10 p-2 rounded-lg justify-start items-center gap-2 inline-flex ml-6
         ${hoverElement || showDeleteButton || projectDeleteWindow ? 'bg-slate-700' : 'bg-[#EAEAFB]'}`"
         @mouseover="hoverElement = true"
         @mouseleave="hoverElement = false"
    >
      <img v-if="!hoverElement && !showDeleteButton && !projectDeleteWindow" class="w-6 h-6" src="@/assets/icons/more-black.svg"  alt=""/>
      <img v-if="showDeleteButton || hoverElement || projectDeleteWindow" class="w-6 h-6" src="@/assets/icons/more.svg"  alt=""/>
    </div>
    <div
        v-if="showDeleteButton"
        class="z-10 cursor-pointer absolute right-0 top-12 w-[165px] h-12 p-2 bg-white rounded-lg shadow flex-col justify-start items-start gap-2 inline-flex"
        @click="deleteProject"
    >
      <div class="px-2 py-1 rounded-lg justify-start items-center gap-2 inline-flex">
        <div class="justify-start items-center gap-2.5 flex">
          <div class="text-orange-700 text-[14px] font-medium leading-tight">Delete Project...</div>
          <img class="w-6 h-6" src="@/assets/icons/delete.svg"  alt=""/>
          <img class="w-6 h-6 absolute -top-3 right-1.5 drop-shadow -z-10" src="@/assets/icons/polygon-arrow-up.svg"  alt=""/>
        </div>
      </div>
    </div>
  </div>
  <BaseModal
      :width="480"
      :visible="projectDeleteWindow"
      @close="projectDeleteWindow = false"
  >
    <div class="flex flex-col items-center p-8">
      <Icon :large="true" name="icons8-futurama-bender" :size="80" />
      <div class="mt-6 h-10 justify-between items-center gap-1 inline-flex">
        <div class="text-gray-900 text-[24px] font-normal leading-10">Project Deletion</div>
      </div>
      <div class="mt-6 w-[416px] text-center text-gray-900 text-[16px] font-normal leading-normal">
        You are going to permanently delete the project.
        All project related tasks, history of operations and other will also be deleted. This action is irreversible.
      </div>
      <div class="mt-6 flex justify-between w-full">
        <button @click="projectDeleteWindow = false" type="button" class="w-[196px] h-10 bg-violet-200 rounded-lg justify-center items-center gap-2 inline-flex">
          <div class="text-slate-700 text-[16px] font-medium leading-normal">Cancel</div>
        </button>
        <button @click="sendDeleteProject" type="button" class="w-[196px] h-10 bg-orange-500 rounded-lg justify-center items-center gap-2 inline-flex">
          <div class="text-white text-[16px] font-medium leading-normal">Delete</div>
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
  import { useProjectsStore } from "~/store";
  import { defineProps } from 'vue';
  import {useNuxtApp} from "#app";
  import { useRouter, useRoute } from 'vue-router';
  const router = useRouter();
  const props = defineProps({
    project: {
      type: Object,
      default: null
    }
  })
  const project = toRef(props, 'project');
  const showDeleteButton = ref(false)
  const projectDeleteWindow = ref(false);
  const hoverElement = ref(false);
  const projectStore = useProjectsStore()
  const nuxtApp = useNuxtApp()
  const deleteProject = () => {
    projectDeleteWindow.value = true
    showDeleteButton.value = false
    return true
  }
  const sendDeleteProject = async () => {
    projectDeleteWindow.value = false
    showDeleteButton.value = false
    await projectStore.removeProjectAction({ id: project.value.id })
    nuxtApp.$alert.show('Project has been deleted', {
      type: 'success',
      timeout: 5000,
    });
    await router.push('/projects');
  }
</script>

<style scoped lang="scss">

</style>
<template>
  <div class="relative h-10 z-10">
    <div @click="showDeleteButton = !showDeleteButton"
         :class="`cursor-pointer w-10 h-10 p-2 rounded-lg justify-start items-center gap-2 inline-flex ml-6
         ${hoverElement || showDeleteButton ? 'bg-slate-700' : 'bg-[#EAEAFB]'}`"
         @mouseover="hoverElement = true"
         @mouseleave="hoverElement = false"
    >
      <img v-if="!hoverElement && !showDeleteButton" class="w-6 h-6" src="@/assets/icons/more-black.svg"  alt=""/>
      <img v-if="showDeleteButton || hoverElement" class="w-6 h-6" src="@/assets/icons/more.svg"  alt=""/>
    </div>
    <div
        v-if="showDeleteButton"
        class="!z-10 cursor-pointer absolute right-0 bottom-12 w-[165px] h-20 p-2 bg-white rounded-lg shadow-[0_4px_16px_0px_rgba(56,64,91,0.24)] flex-col justify-start items-start gap-2 inline-flex"
        @click="deleteProject"
    >
      <div class="px-2 py-1 rounded-lg justify-start items-center gap-2 inline-flex w-full h-full">
        <div class="justify-center items-start gap-2 flex flex-col">
          <button
              type="button"
              class="h-8 text-slate-700 text-[14px] font-medium leading-tight flex items-center"
              @click="$emit('unread', report); showDeleteButton = false"
          >
            Mark as Unread
          </button>
          <button
              type="button"
              @click="$emit('delete', report); showDeleteButton = false"
              class="h-8 text-slate-700 text-[14px] font-medium leading-tight flex items-center"
          >
            Delete Report
          </button>
          <img class="w-4 h-4 absolute -bottom-2.5 right-3 drop-shadow -z-10" src="@/assets/icons/polygon-arrow-down.svg"  alt=""/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import {useNuxtApp} from "#app";
import { useRouter, useRoute } from 'vue-router';
const router = useRouter();
const props = defineProps({
  report: {
    type: Object,
    default: null
  }
})
const showDeleteButton = ref(false)
const hoverElement = ref(false);
const nuxtApp = useNuxtApp()
</script>

<style scoped lang="scss">

</style>
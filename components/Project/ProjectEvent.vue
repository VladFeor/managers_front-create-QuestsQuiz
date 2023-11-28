<template>
  <div class="w-full h-[64px] rounded-lg flex">
    <div class="flex flex-col items-center h-full w-[64px] bg-[#DAD9F7] rounded-l-lg border border-[#DAD9F7] px-[10px] pt-[8px] pb-[2px]">
      <div class="text-xs leading-4 tracking-[.014em] font-medium h-4 text-[#38405B]">{{ started_at_month }}</div>
      <h4 class="h-10 font-normal text-2xl leading-10 w-[15px] text-[#38405B]">{{ started_at_day }}</h4>
    </div>
    <div class="flex justify-start items-center bg-[#F5F5FD] rounded-r-lg w-[calc(100%-64px)] px-3">
      <div class="flex flex-col">
        <div class="h-6 font-medium text-base leading-6 text-[#38405B]">{{ event.title }}</div>
        <div class="mt-1 text-xs font-medium leading-4 tracking-[.014em] text-[#6A6D8F] slashed-zero">{{ started_at_time }}–11:00</div>
      </div>

      <div class="flex ml-auto" v-if="isSuperAdmin">
        <DeleteBadge
          @confirm="removeEvent"
          is-confirm
          default-bg-class="bg-transparent"
          hover-bg-class="bg-[#DAD9F7]"
          active-bg-class="bg-slate-700"
          :default-bg-icon="delete_gray"
          :hover-bg-icon="delete_slate"
          :active-bg-icon="delete_white"
          confirmDeleteText="Confirm deletion of this event. This action is irreversible"
        />
      </div>

    </div>
  </div>
</template>

<script setup>
  import delete_gray from '@/assets/icons/delete-gray.svg'
  import delete_slate from '@/assets/icons/delete-slate.svg'
  import delete_white from '@/assets/icons/delete-white.svg'
  import { useEventsStore } from "~/store";
  import {useNuxtApp} from "#app";
  const nuxtApp = useNuxtApp();
  const eventsStore = useEventsStore()
  const emits = defineEmits(['delete'])
  const props = defineProps(['event']);
  const event = toRef(props, 'event');
  const date = new Date(props.event.started_at);
  const endDate = new Date(props.event.ended_at);
  const started_at_day = computed(() => date.getDay())
  const started_at_month = computed(() => date.toLocaleString('default', { month: 'long' }))
  const started_at_time = computed(() => date.getHours().toString() + ':' + date.getMinutes().toString());
  const ended_at_time = computed(() => endDate.getHours().toString() + ':' + endDate.getMinutes().toString());
  const roles = inject('roles');
  const {
    isProjectAdministrator,
    isSuperAdmin,
    isProjectManager,
    isProjectOwner
  } = roles;
  const removeEvent = () => {
    eventsStore.removeEventAction({ id: event.value.id })
    nuxtApp.$alert.show('Event has been deleted', {
      type: 'success',
      timeout: 5000,
    });
    emits('remove', event)
  }
</script>

<style scoped lang="scss">

</style>
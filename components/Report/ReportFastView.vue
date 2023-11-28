<template>
  <div class="p-10 flex flex-col h-full relative reports-fast-view" v-if="report">
    <div class="flex justify-between">
      <h3 class="text-[32px] font-normal leading-10 h-10 w-[335px] text-[#38405B]">Report</h3>
      <div class="flex" v-if="!loading">
        <div class="bg-[#EAEAFB] rounded-md w-8 h-8 justify-center items-center flex ml-2">
          <Icon class="cursor-pointer" name="Left" :size="20" @click="$emit('prevRow')" />
        </div>
        <div class="bg-[#EAEAFB] rounded-md w-8 h-8 justify-center items-center flex ml-2">
          <Icon class="cursor-pointer" name="Right" :size="20" @click="$emit('nextRow')" />
        </div>
      </div>
    </div>

    <div
      class="flex flex-col mt-8 font-medium text-[#6A6D8F] py-[20px] px-[24px] bg-white rounded-lg border border-[#DAD9F7] h-auto"
    >
      <div class="flex justify-between">
        <div class="flex items-center">
          <Badge :text="formatDateCurrent(report.created_at)" transparent />
        </div>
        <div class="flex items-center">
          <div class="text-[#AAA7CC] text-xs font-medium leading-none tracking-tight mr-[8px]">
            From
          </div>
          <div
            @click="goToTalent"
            class="cursor-pointer flex items-center justify-start max-w-36 hover:bg-[#F5F5FD] bg-white px-[8px] py-[4px] rounded-lg"
          >
            <Talent
              :text="reduceStringLength(report.ambassador.name, 10)"
              :img="report.ambassador.avatar || defaultAvatar"
            />
          </div>
          <div class="text-[#AAA7CC] text-xs font-medium leading-none tracking-tight mx-[8px]">
            on
          </div>
          <div
            @click="goToProject"
            class="cursor-pointer flex items-center justify-start max-w-32 hover:bg-[#F5F5FD] bg-white px-[8px] py-[4px] rounded-lg"
          >
            <Talent
              :square="true"
              :text="reduceStringLength(report.project.name, 10)"
              :img="report.project.logo || defaultLogo"
            />
          </div>
        </div>
      </div>

      <div class="mt-6 text-gray-900 text-2xl font-normal leading-10">
        {{ report.type.type }}
      </div>
      <div class="my-4 text-[#1A1D29] text-base font-normal leading-normal break-all">
        {{ report.text }}
      </div>
      <div class="mt-auto text-slate-400 text-xs font-medium leading-none tracking-tight">
        Report ID {{ report.id }}
      </div>
    </div>

    <div class="flex h-10 mt-auto">
      <button
        @click="$emit('resolve', report)"
        type="button"
        class="w-[464px] h-10 px-3 py-1.5 bg-violet-200 rounded-lg justify-center items-center gap-2 inline-flex"
      >
        <div class="text-slate-700 text-base font-medium leading-normal">Resolve</div>
      </button>
      <ReportMenu @unread="$emit('unread', report)" @delete="$emit('delete', report)" />
    </div>
  </div>
</template>

<script setup>
import defaultAvatar from '@/assets/images/default-avatar.png';
import defaultLogo from 'assets/images/protocol-oasis-bg.png';
import { formatDateCurrent, reduceStringLength } from '~/util/helpers';
import { useRouter } from 'vue-router';
const router = useRouter();
const props = defineProps({
  report: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const goToProject = () => {
  let projectId = props.report.project.id;

  router.replace(`/projects/${projectId}`);
};
const goToTalent = () => {
  let talentId = props.report.ambassador.id;

  router.replace(`/talent/${talentId}`);
};
</script>

<style scoped lang="scss">
.reports-fast-view {
  font-family: 'Basis Grotesque Pro', serif;
}
</style>

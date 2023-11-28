<template>
  <div class="p-10 flex flex-col h-full" v-if="currentRow">
    <div class="flex justify-between">
      <h3 class="text-[32px] font-normal leading-10 h-20 w-[335px] text-[#38405B]">
        Direction Confirmation Request
      </h3>
      <div class="flex" v-if="!requestsLoading">
        <div
          class="bg-[#EAEAFB] rounded-md w-8 h-8 justify-center items-center flex ml-2"
          v-if="index !== 0"
        >
          <Icon class="cursor-pointer" name="Left" :size="20" @click="emit('prevRow')" />
        </div>
        <div
          class="bg-[#EAEAFB] rounded-md w-8 h-8 justify-center items-center flex ml-2"
          v-if="index !== 9"
        >
          <Icon class="cursor-pointer" name="Right" :size="20" @click="emit('nextRow')" />
        </div>
      </div>
    </div>
    <div class="mt-8 font-medium text-[#6A6D8F] text-xs flex">
      <div class="flex items-center">
        <div class="mr-2">From</div>
        <nuxt-link :to="`/talent/${currentRow.talent.props.talentId}`">
          <Talent :text="currentRow.talent.props.text" :img="currentRow.talent.props.img" />
        </nuxt-link>
      </div>
      <div class="flex items-center ml-5">
        <div class="mr-2">Waiting</div>
        <div
          v-if="currentRow.waiting.props.text.diffInDays > 0"
          class="border border-[#DAD9F7] py-[3px] px-2 rounded-md"
        >
          <span
            :class="
              currentRow.waiting.props.text.diffInDays > 3 ? 'text-[#CC2D14]' : 'text-[#38405B]'
            "
          >
            {{ currentRow.waiting.props.text.diffInDays }} days
          </span>
          <span class="text-[#6A6D8F]"> since </span>
          <span
            :class="
              currentRow.waiting.props.text.diffInDays > 3 ? 'text-[#CC2D14]' : 'text-[#38405B]'
            "
          >
            {{ currentRow.waiting.props.text.diffInDaysSince }}
          </span>
        </div>
        <div v-else>
          <span class="text-[#38405B]">{{ currentRow.waiting.props.text.diffInHours }} hours</span>
        </div>
      </div>
    </div>
    <div class="mt-4 max-h-[420px] h-auto overflow-y-auto bg-[#E0ECFF] rounded-[16px] p-6">
      <div
        :class="`py-[3px] px-[8px] h-6 w-fit rounded-md flex items-center justify-center
            directions ${getBadgeTypeByName(currentRow.direction.props.text)} active
          `"
      >
        <div class="text-xs font-medium leading-4">
          {{ currentRow.direction.props.text }}
        </div>
      </div>

      <div class="mt-4 text-base text-[#1A1D29] font-normal">
        Check the links that confirm the competence of the talent
      </div>

      <div class="mt-4">
        <PortfolioCard :key="currentRow.talent.props.id" :sources="currentRow.portfolio" />
      </div>
    </div>
    <nuxt-link :to="`/talent/${currentRow.talent.props.talentId}`" class="mt-4 lg:mt-10 ml-auto">
      <button
        type="button"
        @click="viewFullTalentsProfile()"
        class="flex items-center justify-center text-base text-[#6A6D8F]"
      >
        <div>View Full Talent’s Profile</div>
        <Icon class="ml-2" name="Right-Arrow" :size="30" />
      </button>
    </nuxt-link>
  </div>
</template>

<script setup lang="ts">
import { getBadgeTypeByName } from '~/util/helpers';
const props = defineProps(['currentRow', 'requestsLoading', 'index']);
const emit = defineEmits(['nextRow', 'prevRow']);
const viewFullTalentsProfile = () =>
  location.replace(`/talent/${props.currentRow.talent.props.talentId}`);
</script>

<style scoped lang="scss">
::-webkit-scrollbar {
  width: 4px;
}
/* Track */
::-webkit-scrollbar-track {
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #6a6d8f;
  border-radius: 4px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #6a6d8f;
}
</style>

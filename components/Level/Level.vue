<template>
  <div class="flex items-center">
    <div class="level-container w-12 bg-[#F5F5FD] border border-[#EAEAFB] h-4 flex items-center justify-evenly rounded-[4px]">
      <div
          class="h-[12px] w-[7px] rounded-sm bg-[#EAEAFB]"
          v-for="i in [1,2,3,4,5]"
          :key="keyRandom"
      >
        <LevelItem :i="i" :level="level"/>
      </div>
    </div>
    <span class="text text-base leading-6 ml-2 text-[#1a1d29]">{{ text }}</span>
  </div>
</template>

<script>
import { keyRandom } from "~/util/helpers";
export default {
  name: 'Level',
  methods: {keyRandom},
  props: {
    text: {
      type: String,
      default: '',
    },
    level: {
      type: String,
      required: true,
      validator: (value) => {
        return [1, 2, 3, 4, 5].includes(value);
      },
    },
  },
};
</script>

<style scoped lang="scss">

</style>

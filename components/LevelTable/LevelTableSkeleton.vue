<template>
  <div class="requests-table w-full">
    <div
      class="header bg-[#EAEAFB] h-[64px] w-full rounded-[16px] flex flex-row items-center pl-6 pr-4 animate-pulse"
    >
      <div v-for="col in cols" :class="`grow-0 shrink-0 bg-white ml-3 h-4 rounded-lg ${col.basis}`"></div>
    </div>
    <div
        class="mt-2 bg-white body h-[64px] w-full rounded-[16px] flex flex-row items-center pl-6 pr-4 animate-pulse"
        v-for="(row, index) in rows"
        :key="keyRandom"
    >
        <div v-for="col in cols" :class="`grow-0 shrink-0 bg-[#EAEAFB] ml-3 h-4 rounded-lg ${col.basis}`"></div>
    </div>
  </div>
</template>

<script setup>
import { keyRandom } from "~/util/helpers";
const cols = ref(
    [
      { prop: 'talent', label: '', basis: 'basis-[30%]' },
      { prop: 'waiting', label: '', basis: 'basis-[20%]' },
      { prop: 'upto', label: '', basis: 'basis-[10%]' },
      { prop: 'upto', label: '', basis: 'basis-[10%]' },
      { prop: 'upto', label: '', basis: 'basis-[5%]' },
      { prop: 'upto', label: '', basis: 'basis-[5%]' },
    ]
)
const rows = ref(
    [
      { prop: 'talent' },
      { prop: 'waiting' },
      { prop: 'current_level' },
      { prop: 'level_arrow' },
    ]
)


</script>

<style scoped lang="scss"></style>

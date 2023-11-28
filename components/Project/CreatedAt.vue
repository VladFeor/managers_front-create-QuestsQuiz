<template>
  <div class="rounded-md border border-[#DAD9F7] py-[3px] px-[8px] h-6 flex items-center" v-if="text">
    <span class="text-xs leading-4 font-medium h-4 text-[#38405B]">{{ formatDate(text) }}</span>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    text: {
      type: String,
      default: null
    }
  })
  function formatDate(dateStr: any) {
    if(!dateStr) return null;
    let formattedDate = dateStr.substr(0, 10)
    const parts: number[] = formattedDate.split('-');
    const date = new Date(parts[0], parts[1] - 1, parts[2]);

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
</script>

<style scoped lang="scss">

</style>
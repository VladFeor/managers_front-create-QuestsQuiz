<template>
  <div class="flex justify-center items-center flex-col containerInfo">
    <Icon :large="true" name="icons8-futurama-bender" :size="40" />
    <p class="text-[#AAA7CC] text-base leading-6 font-normal mt-[11px]">
      You haven’t created any gates yet
    </p>
  </div>
</template>

<script setup lang="ts">
import Icon from '~/components/Icon.vue';
</script>

<style scoped lang="scss">
.containerInfo > svg > path {
  fill: #aaa7cc;
}
</style>

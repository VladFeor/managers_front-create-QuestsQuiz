<template>
  <div
      class="animate-pulse h-[260px] w-[calc(100%+88px)] bg-banner -ml-12 -mt-12 bg-[#EAEAFB]"
  />
  <div class="animate-pulse">
    <div class="h-[160px] -mt-20 flex justify-between">
      <div class="flex items-end">
        <div
            class="h-full w-[160px] bg-profile object-contain rounded-2xl border-3 border-[#F5F5FD] bg-profile-default"
        />
      </div>
    </div>
    <div class="w-full mt-10 mb-10 flex">
      <ContentBox class="min-h-72 w-2/3 p-6 bg-[#EAEAFB]" />
      <div class="flex flex-wrap w-1/3 ml-10">
        <ContentBox class="min-h-48 w-full p-6 bg-[#EAEAFB]" />
        <ContentBox class="min-h-48 w-full p-6 bg-[#EAEAFB] mt-6" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import {ContentBox} from "~/components";
</script>

<style scoped lang="scss">
.bg-banner {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.bg-default-banner {
  background: url("@/assets/images/def-cover-project.svg") no-repeat center;
}

.bg-profile {
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}

.bg-profile-default {
  background: url("@/assets/images/Project-Avatar.svg") no-repeat center;
}

</style>
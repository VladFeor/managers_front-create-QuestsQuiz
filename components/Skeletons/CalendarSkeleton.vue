<template>
  <div
    style="border-radius: 16px"
    role="status"
    class="max-w-md p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse md:p-6"
  >
    <div class="flex items-center justify-between">
      <div>
        <div class="h-2.5 bg-gray-300 rounded-full w-10 mb-2.5"></div>
        <div class="w-20 h-2 bg-gray-200 rounded-full"></div>
      </div>
      <div class="h-2.5 bg-gray-300 rounded-full w-6"></div>
    </div>
    <div class="flex items-center justify-between pt-4">
      <div>
        <div class="h-2.5 bg-gray-300 rounded-full w-12 mb-2.5"></div>
        <div class="w-28 h-2 bg-gray-200 rounded-full"></div>
      </div>
      <div class="h-2.5 bg-gray-300 rounded-full w-8"></div>
    </div>
    <div class="flex items-center justify-between pt-4">
      <div>
        <div class="h-2.5 bg-gray-300 rounded-full w-14 mb-2.5"></div>
        <div class="w-32 h-2 bg-gray-200 rounded-full"></div>
      </div>
      <div class="h-2.5 bg-gray-300 rounded-full w-10"></div>
    </div>
    <div class="flex items-center justify-between pt-4">
      <div>
        <div class="h-2.5 bg-gray-300 rounded-full w-18 mb-2.5"></div>
        <div class="w-36 h-2 bg-gray-200 rounded-full"></div>
      </div>
      <div class="h-2.5 bg-gray-300 rounded-full w-12"></div>
    </div>
    <div class="flex items-center justify-between pt-4">
      <div>
        <div class="h-2.5 bg-gray-300 rounded-full w-22 mb-2.5"></div>
        <div class="w-40 h-2 bg-gray-200 rounded-full"></div>
      </div>
      <div class="h-2.5 bg-gray-300 rounded-full w-14"></div>
    </div>
    <span class="sr-only">Loading...</span>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.max-w-md {
  width: 360px;
  height: 420px;
}
</style>

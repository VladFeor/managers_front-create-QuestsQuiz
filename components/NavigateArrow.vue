<template>
  <div
      class="w-8 h-8 relative bg-violet-50 rounded-lg flex items-center justify-center"
      @click="$emit('clickFromComponent', value)"
  >
    <Icon name="Right-Arrow" :size="24" />
  </div>
</template>

<script setup>
  const props = defineProps({
    value: {
      type: Object,
      default: null
    }
  })
</script>

<style scoped lang="scss">

</style>
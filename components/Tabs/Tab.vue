<template>
  <div class="tab" :class="active == 'true' ? 'active' : ''">
    <slot></slot>
  </div>
</template>

<script setup>
const props = defineProps(['active']);
</script>

<style>
.tab {
  display: none;
}
.tab.active {
  display: block;
}
</style>

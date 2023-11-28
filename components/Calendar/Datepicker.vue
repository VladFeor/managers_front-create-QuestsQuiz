<template>
  <div class="datepicker-wrapper">
    <span style="color: #000">sdvfvfsv</span>
    <!-- <VueDatePicker v-model="date"></VueDatePicker> -->
  </div>
</template>

<script setup>
import { ref } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const date = ref();
</script>

<style lang="scss">
.datepicker-wrapper {
  height: 200px;
}
</style>

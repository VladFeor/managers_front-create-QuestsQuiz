<template>
  <div class="mt-7">
    <Tasks
        @pagData="setPagData($event)"
        :search="pagData.search"
        :default-project="project"
    />
  </div>
</template>

<script setup>

import {reactive} from "vue";
const props = defineProps({
  project: {
    type: Object,
    default: null
  }
})
const pagData = reactive({
  status: 'available',
  page: 1,
  search: '',
});
const setPagData = (data) => {
  pagData.status = data.status;
  pagData.page = data.page;
  pagData.search = data.search;
  if (data.reward_type) {
    pagData.reward_type = data.reward_type;
  } else {
    pagData.reward_type = '';
  }
  if (data.priority) {
    pagData.priority = data.priority;
  } else {
    pagData.priority = '';
  }
  if (data.activity_id) {
    pagData.activity_id = data.activity_id;
  } else {
    pagData.activity_id = '';
  }
  if (data.project_id) {
    pagData.project_id = data.project_id;
  } else {
    pagData.project_id = '';
  }
};
</script>


<style scoped lang="scss">

</style>
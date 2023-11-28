<template>
  <div class="new-project">
    <div class="head">
      <Talent :text="data.project_name" square :img="data.project_avatar || defaultBg"></Talent>
      <!--      <Icon :name="getCuttencyIcon(data.project_coin_type.code.toLowerCase())" :size="24" />-->
    </div>
    <div class="tags">
      <Badge
        :text="i"
        v-for="i in data.project_tags.slice(0, 2)"
        type="transparent"
        :key="i"
      ></Badge>

      <badge
        v-if="data.project_tags.length > 2"
        :text="`+${data.project_tags.length - 2}`"
        type="transparent"
      ></badge>
    </div>
  </div>
</template>
<script setup>
import { getCuttencyIcon } from '@/util/helpers';
import defaultBg from '@/assets/images/default-avatar.png';

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});
</script>

<style scoped lang="scss">
.new-project {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .tags {
    display: flex;
    gap: 4px;
    align-items: center;
  }
}
</style>

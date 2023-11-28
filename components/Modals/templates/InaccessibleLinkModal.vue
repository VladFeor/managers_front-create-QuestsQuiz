<template>
  <BaseModal @close="$router.push(link)" :width="520" :visible="!close">
    <div class="flex gap-[24px] items-center flex-col p-[32px]">
      <Icon name="icons8-futurama-bender" large :size="80"></Icon>
      <div class="title">{{ title }}</div>
      <div class="text">{{ text }}</div>
      <base-button
        @click="
          $router.push(link);
          close = true;
        "
        :text="button"
        type="normal"
      ></base-button>
    </div>
  </BaseModal>
</template>
<script setup>
const close = ref(false);
const props = defineProps({
  text: {
    type: String,
    default:
      'The task you are trying to access is no longer available. It may have been completed or deleted. Please contact your project manager or administrator for further assistance.',
  },
  title: {
    type: String,
    default: 'Task Unavailable',
  },
  button: {
    type: String,
    default: 'Go to the Homepage',
  },
  link: {
    type: String,
    default: '/',
  },
});
</script>

<style scoped lang="scss">
.title {
  color: $section-title;
  font-variant-numeric: slashed-zero;
  font-family: 'Basis Grotesque Pro';
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 40px; /* 166.667% */
}
.text {
  color: $section-title;
  text-align: center;
  font-variant-numeric: lining-nums tabular-nums slashed-zero;
  font-family: 'Basis Grotesque Pro';
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
}
</style>

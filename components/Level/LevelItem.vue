<template>
  <div :class="`h-[12px] w-[7px] rounded-sm ${i <= level ? 'bg-[#FC660C]' : 'bg-[#EAEAFB]'}`">
  </div>
</template>

<script>
export default {
  name: 'Level',
  props: {
    i: {
      type: Number,
      required: true,
    },
    level: {
      type: Number,
      required: true,
      validator: (value) => {
        return [1, 2, 3, 4, 5].includes(value);
      },
    },
  },
};
</script>

<style scoped lang="scss">

</style>

<template>
  <button
      v-if="hover && hoverIndex === index || multi || visible"
      :class="`
        'flex items-center justify-center py-1 px-2 w-20 rounded-[8px] text-sm font-medium leading-5'
        ${type === 'dismiss' && !multi && 'bg-[#F5F5FD] text-[#6A6D8F]'}
        ${type === 'levelup' && !multi && 'bg-[#DAD9F7] text-[#38405B]'}
        ${type === 'dismiss' && multi && 'bg-[#DAD9F7] text-[#38405B]'}
        ${type === 'levelup' && multi && 'bg-[#FC660C] text-white'}
        ${fullWidth && 'w-full'}
        ${height ? height : 'h-8'}
    `">
    {{ text }}
  </button>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    default: "levelup",
  },
  multi: {
    type: Boolean,
    default: false,
  },
  visible: {
    type: Boolean,
    default: false,
  },
  hover: {
    type: Boolean,
    default: false,
  },
  hoverIndex: {
    type: Number,
    default: null,
  },
  index: {
    type: Number,
    default: null,
  },
  text: {
    type: String,
    default: 'Level Up',
  },
  fullWidth: {
    type: String,
    default: '',
  },
  height: {
    type: String,
    default: 'h-8'
  }
})

// export default {
//   name: 'LevelUpButton',
//   props: {
//     hover: {
//       type: Boolean,
//       default: false,
//     },
//     hoverIndex: {
//       type: Number,
//       default: null,
//     },
//     index: {
//       type: Number,
//       default: null,
//     },
//     text: {
//       type: String,
//       default: '',
//     }
//   },
// };
</script>

<style scoped lang="scss">

</style>

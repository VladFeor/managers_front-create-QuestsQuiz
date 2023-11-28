<template>
  <div class="w-auto h-6 pl-2 pr-2.5 py-[3px] rounded-md border border-violet-200 gap-1.5">
    <div class="gap-2.5 flex items-center h-full">
      <img :src="getImgSrc()" class="h-[8px]" alt="" />
      <div class="text-right text-slate-700 text-[12px] font-medium leading-none tracking-wide">
        {{ setStatusName(status) }}
      </div>
    </div>
  </div>
</template>

<script setup>
import available_marker from 'assets/icons/available_marker.svg';
import done_marker from 'assets/icons/done_marker.svg';
import inprogress_marker from 'assets/icons/inprogress_marker.svg';
import upcoming_marker from 'assets/icons/upcoming_marker.svg';
import overdue_marker from 'assets/icons/overdue_marker.svg';

const props = defineProps({
  status: {
    type: String,
    default: '',
  },
});

const setStatusName = (name) => {
  if (name === 'finished') {
    return 'Done';
  }
  if (name === 'overdue') {
    return 'Overdue';
  }
  if (name === 'upcoming') {
    return 'Upcoming';
  }
  if (name === 'available') {
    return 'In Progress';
  }
  if (name === '') {
    return null;
  }
};
const getImgSrc = () => {
  return setStatusName(props.status) === 'Available'
    ? available_marker
    : setStatusName(props.status) === 'Done'
    ? done_marker
    : setStatusName(props.status) === 'In Progress'
    ? inprogress_marker
    : setStatusName(props.status) === 'Upcoming'
    ? upcoming_marker
    : props.status === 'Overdue'
    ? overdue_marker
    : null;
};
</script>

<style scoped></style>

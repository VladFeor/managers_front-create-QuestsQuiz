<template>
  <div class="w-auto h-6 pl-2 pr-2.5 py-[3px] rounded-md border border-violet-200 gap-1.5">
    <div class="gap-2.5 flex items-center h-full">
      <img :src="getImgSrc()" class="h-[8px]" alt="" />
      <div class="text-right text-slate-700 text-[12px] font-medium leading-none tracking-wide">
        {{ reduce ? reduceStringLength(setStatusName(status), reduce) : setStatusName(status) }}
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
import pendingIcon from '@/assets/icons/tasks/waiting_for_review.svg';
import overdueIcon from '@/assets/icons/tasks/overdue.svg';
import { reduceStringLength } from '@/util/helpers';

const props = defineProps({
  status: {
    type: String,
    default: '',
  },
  reduce: {
    type: Number,
    default: 0,
  },
});

const setStatusName = (name) => {
  if (name === 'done') {
    return 'Done';
  }
  if (name === 'overdue' || name === 'overdue_by_manager') {
    return 'Overdue';
  }
  if (name === 'rejected') {
    return 'Rejected';
  }
  if (name === 'available') {
    return 'Available';
  }
  if (name === 'upcoming') {
    return 'Upcoming';
  }
  if (name === 'waiting_for_review') {
    return 'Waiting for Review';
  }
  if (name === 'on_revision') return 'On Revision';
  if (name === 'in_progress') {
    return 'In Progress';
  }
  if (name === 'returned') {
    return 'Returned';
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
    : setStatusName(props.status) === 'On Revision'
    ? pendingIcon
    : setStatusName(props.status) === 'In Progress'
    ? inprogress_marker
    : setStatusName(props.status) === 'Upcoming'
    ? upcoming_marker
    : setStatusName(props.status) === 'Waiting for Review'
    ? pendingIcon
    : setStatusName(props.status) === 'On Revision'
    ? pendingIcon
    : setStatusName(props.status) === 'Returned'
    ? pendingIcon
    : setStatusName(props.status) === 'Rejected'
    ? overdue_marker
    : setStatusName(props.status) === 'Overdue'
    ? overdue_marker
    : null;
};
</script>

<style scoped></style>

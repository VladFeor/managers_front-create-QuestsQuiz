<template>
  <div class="notification-card mb-3 cursor-pointer" @click="redirect()">
    <div
      class="image"
      :style="`background: url(${logo || defaultBg}) no-repeat; border-radius: ${
        isProject ? '8px' : '32px'
      }`"
      style="background-size: cover"
    ></div>
    <div class="content">
      <div
        class="time"
        @mouseover="showText = true"
        @mouseleave="showText = false"
        @click.stop="showText && !read ? $emit('read') : () => {}"
      >
        {{ diffTime }}
        <div :class="read ? 'read' : 'unread'"></div>
        <div v-if="showText && !read" class="mark cursor-pointer" @click.stop="$emit('read')">
          Mark as read
        </div>
      </div>
      <div v-html="title" class="title"></div>
      <div class="component" v-if="!isEmptySlot">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script setup>
import defaultBg from '@/assets/images/talentumAvatar.svg';
import { useRouter } from 'vue-router';
import { computed } from 'vue';
import { useUserStore } from '~/store';
const router = useRouter();

const props = defineProps({
  logo: {
    type: String,
    default: defaultBg,
  },
  data: {
    type: Object,
    default: () => {},
  },
  time: {
    type: String,
    default: '2023-07-26T14:25:08.000000Z',
  },
  title: {
    type: String,
    default: '',
  },
  read: {
    type: Boolean,
    default: false,
  },
  isEmptySlot: {
    type: Boolean,
    default: false,
  },
  isProject: {
    type: Boolean,
    default: false,
  },
});
const userStore = useUserStore();

const projectID = computed(() => userStore.getUserProjectId);
const emit = defineEmits(['read']);

const redirect = () => {
  if (props.data.project_id && !props.data.task_id) {
    router.push(`/projects/${props.data.project_id}`);
  } else if (props.data.task_id) {
    router.push(
      props.data.task_type !== 'user_task'
        ? `/tasks/task/${props.data.task_id}`
        : `/tasks/review-task/${props.data.task_id}`,
    );
  } else if (props.data.ambassador_id) {
    router.push(`/talent/${props.data.ambassador_id}`);
  } else {
    if (projectID.value || props.data.project_id) {
      router.push({
        path: `/inner-wallet/${props.data.project_id || projectID.value}`,
        query: { status: 2 },
      });
    }
  }
  emit('read');
};
const now = ref(new Date());
const showText = ref(false);
const diffTime = computed(() => {
  const endDate = new Date(props.time);
  const diffMilliseconds = now.value.getTime() - endDate.getTime();

  if (diffMilliseconds < 0) {
    return 'Moment ago';
  }

  const diffSeconds = diffMilliseconds / 1000;
  const minutes = Math.floor(diffSeconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) {
    return years === 1 ? 'a year ago' : `${years} years ago`;
  } else if (months > 0) {
    return months === 1 ? 'a month ago' : `${months} months ago`;
  } else if (weeks > 0) {
    return weeks === 1 ? 'a week ago' : `${weeks} weeks ago`;
  } else if (days > 0) {
    return days === 1 ? 'a day ago' : `${days} days ago`;
  } else if (hours > 0) {
    return hours === 1 ? 'an hour ago' : `${hours} hours ago`;
  } else if (minutes < 1) {
    return 'moment ago';
  } else {
    return minutes === 1 ? 'a minute ago' : `${minutes} minutes ago`;
  }
});
</script>
<style scoped lang="scss">
.notification-card {
  display: flex;
  gap: 16px;
  width: 100%;
  height: fit-content;

  .image {
    display: flex;
    width: 40px;
    min-width: 40px;
    height: 40px;
    padding: 4px;
    justify-content: center;
    align-items: center;
    border-radius: 32px;
  }
  .content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    width: 100%;
    .time {
      color: $secondary;
      font-variant-numeric: lining-nums tabular-nums slashed-zero;
      font-family: 'Basis Grotesque Pro';
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 16px;
      letter-spacing: 0.168px;
      display: flex;
      align-items: center;
      gap: 8px;
      .unread {
        width: 8px;
        height: 8px;
        border-radius: 100%;
        background: $orange;
      }
      .read {
        width: 8px;
        height: 8px;
        border-radius: 100%;
        background: $default;
      }
      .mark {
        color: $default;
      }
    }
    .title {
      color: $secondary;
      font-variant-numeric: lining-nums tabular-nums slashed-zero;
      font-family: 'Basis Grotesque Pro';
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 24px;
    }
    .component {
      display: flex;
      padding: 8px;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 8px;
      width: 100%;
      align-self: stretch;
      border-radius: 8px;
      border: 1px solid $default-badge-border;
      background: $default-bg;
    }
  }
}
</style>

<template>
  <div class="rework-modal">
    <div class="rework-modal_content mb-3">
      <div class="rework-modal_title">Returning the Task for Rework</div>
      <div v-if="report" class="rework-modal_user-card">
        <div class="rework-modal_user-card_header">
          <Talent :text="report.userable.name" :img="report.userable.avatar" />
          <div class="rework-modal_user-card_date">{{ formatDate(report.created_at) }}</div>
        </div>
        <div class="report_link-btns">
          <div v-if="report.link" class="report_link-btn">
            <a :href="report.link" target="_blank" class="report_link-btn_inner">
              <Icon name="Insert-Link" :size="24" /><span>{{
                reduceStringLength(report.link, 20)
              }}</span>
            </a>
          </div>
          <div v-for="file in report.files" :key="file.id" class="report_link-btn">
            <a :href="file.url" target="_blank" class="report_link-btn_inner" v-if="isPdf(file)">
              <Icon name="Copy" :size="24" /><span>{{
                reduceStringLength(file.name ? file.name : 'file name', 20)
              }}</span>
            </a>

            <div class="report_link-btn_inner" v-else @click="zoomInImage(file.url)">
              <Icon name="Copy" :size="24" /><span>{{ reduceStringLength(file.url, 20) }}</span>
            </div>
          </div>
        </div>

        <div class="rework-modal_user-card_desc">
          {{ report.comment }}
        </div>
      </div>
      <div class="rework-modal_message">
        <div class="rework-modal_message-title">Message</div>
        <div class="rework-modal_message-subtitle">
          Explain the reason for the task return. Describe what needs to be improved.
        </div>
        <TextArea v-model="description" />
      </div>
    </div>
    <div class="rework-modal_btn">
      <BaseButton text="Return for Rework" type="normal" @click="emit('action')" />
    </div>
  </div>
  <ZoomImage v-if="isOpenZoom" @close="closeZoomModal" :image="activeImage" />
</template>

<script setup>
import { formatDate, reduceStringLength } from '@/util/helpers';

import { ref } from 'vue';

const props = defineProps({
  task: { type: Object, default: null },
});
const emit = defineEmits(['action', 'input']);

const taskPropRef = toRef(props, 'task');
const activeImage = ref(null);
const isOpenZoom = ref(false);
const isPdf = (file) => {
  return file.mime_type.indexOf('pdf') !== -1;
};
const closeZoomModal = () => {
  isOpenZoom.value = false;
};
const zoomInImage = (image) => {
  activeImage.value = image;
  isOpenZoom.value = true;
  document.body.classList.add('hide-scroll');
};

onMounted(() => {
  console.log('props.task', props.task);
  if (props.task) {
    const items = props.task.reports.filter(
      (item) => item.status === 'waiting_for_review' || item.status === 'resent_for_review',
    );
    const counts = items.length;
    report.value = counts > 1 ? items[counts - 1] : items[0];
  }
});

watch(taskPropRef, (value) => {
  console.log('taskPropRef', value);
  if (value) {
    const items = value.reports.filter(
      (item) => item.status === 'waiting_for_review' || item.status === 'resent_for_review',
    );
    const counts = items.length;
    report.value = counts > 1 ? items[counts - 1] : items[0];
  }
});

const description = ref('');
const report = ref(null);

watch(description, (value) => {
  if (value) {
    emit('input', value);
  }
});
</script>

<style lang="scss" scoped>
.report {
  &_link-btns {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  &_link-btn {
    display: flex;
    padding: 8px 16px 8px 12px;
    align-items: center;
    gap: 8px;
    color: var(--secondary-50-oxford-blue, #38405b);
    text-align: right;
    font-variant-numeric: lining-nums tabular-nums slashed-zero;
    border-radius: 6px;
    border: 1px solid var(--secondary-80-moon-raker, #dad9f7);
    background: var(--secondary-95-selago, #f5f5fd);
    /* Label */
    font-family: 'Basis Grotesque Pro';
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 16px; /* 133.333% */
    letter-spacing: 0.168px;
    cursor: pointer;
    &_inner {
      span {
        margin-left: 8px;
      }
    }
  }
}
.rework-modal {
  height: 96vh;
  overflow-y: scroll;
  overflow-x: hidden;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  padding: 40px;
  &_user-card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 16px;
    gap: 24px;
    width: 520px;
    min-height: 232px;
    max-height: 500px;
    overflow: hidden;
    height: fit-content;
    background: #eaeafb;
    border-radius: 16px;
    &_desc {
      width: 100%;
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      // display: flex;
      // align-items: center;
      font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
      color: #1a1d29;
      word-wrap: break-word;
      max-height: 400px;
      overflow: auto;
    }
    &_btns {
      display: flex;
      justify-content: flex-start;
      gap: 16px;
    }
    &_btn {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 8px 16px 8px 12px;
      gap: 8px;
      width: fit-content;
      height: 40px;
      background: #f5f5fd;
      border: 1px solid #dad9f7;
      border-radius: 6px;
    }
    &_text {
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;
      text-align: right;
      letter-spacing: 0.014em;
      font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
      color: #38405b;
    }
    &_header {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
    &_date {
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;
      text-align: right;
      letter-spacing: 0.014em;
      font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
      color: #6a6d8f;
    }
  }
  &_content {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    gap: 40px;
  }
  &_title {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 32px;
    line-height: 40px;
    font-feature-settings: 'zero' on;
    color: #1a1d29;
  }
  &_message {
    display: flex;
    flex-direction: column;
    gap: 5px;
    &-title {
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
      font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
      color: #1a1d29;
    }
    &-subtitle {
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;
      letter-spacing: 0.014em;
      font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
      color: #6a6d8f;
    }
  }
  &_btn {
    display: flex;
    justify-content: flex-start;
    width: 240px;
  }
}
</style>

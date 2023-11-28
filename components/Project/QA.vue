<template>
  <div class="container mt-[24px]">
    <div class="flex justify-between items-center gap-[8px] w-full">
      <div class="flex text items-center">Q&A Request</div>
      <Switch type="small" @checked="showCreating()" :checked-prop="hasQuestions" />
    </div>
    <div class="qa" v-if="hasQuestions">
      <div class="flex justify-between items-center w-full">
        <div class="flex gap-[8px] items-center mb-[8px]">
          <Icon name="QA" :size="24"></Icon>
          <div class="title">Q&A Request</div>
        </div>
        <div @click="showEdit()">
          <Icon name="More" :size="24" class="cursor-pointer"></Icon>
        </div>
      </div>
      <div class="test" v-for="(i, idx) in hasQuestions.questions" :key="i.id">
        {{ idx + 1 }}. {{ i.value }}
      </div>
    </div>
  </div>
  <BaseModal :visible="addModal" @close="closeModal()" width="480" :top="130">
    <div class="flex flex-col gap-[24px] modal">
      <span class="title">Q&A</span>
      <div class="type">
        <Icon name="QA" :size="24"></Icon>
        <span v-if="!isEditing">Q&A Request </span>
        <span v-else>Editing Q&A </span>
      </div>
      <div class="max-h-[256px] overflow-y-auto flex flex-col w-full gap-y-[16px]">
        <Question
          v-for="(i, index) in questions"
          :count="index + 1"
          v-model="i.value"
          @remove="remove(index)"
          :key="index"
          :can-delete="questions.length > 1"
        ></Question>
      </div>
      <div class="add cursor-pointer" @click="add()" v-if="questions.length < 15">
        Add Question <Icon name="Add" :size="16"></Icon>
      </div>
      <div class="flex items-center justify-between gap-[24px] mt-[32px]">
        <button-dark text="Cancel" @click="closeModal()"></button-dark>
        <base-button type="normal" text="Save" @click="save()"></base-button>
      </div>
    </div>
  </BaseModal>
</template>
<script setup>
import { ref } from 'vue';
import { useProjectsStore } from '~/store/projects';
const isEditing = ref(false);
const addModal = ref(false);
const props = defineProps({
  project: {
    type: Object,
    default: () => {},
  },
});
const nuxtApp = useNuxtApp();

const closeModal = () => {
  addModal.value = false;
  console.log(isEditing.value);
  if (!isEditing.value) {
    projectsStore.getProjectAction(props.project.id);
  }
};
const hasQuestions = computed(() =>
  props.project.survey_form &&
  props.project.survey_form.questions &&
  props.project.survey_form.questions.length
    ? props.project.survey_form
    : false,
);
const projectsStore = useProjectsStore();

import AxiosService from '@/service/axiosService';
const runtimeConfig = useRuntimeConfig();

const showCreating = () => {
  if (!hasQuestions.value) {
    addModal.value = true;
  } else {
    AxiosService.delete(runtimeConfig.public.apiBase + `survey/${props.project.id}`).then(() => {
      projectsStore.getProjectAction(props.project.id);
    });
  }
};
const showEdit = () => {
  addModal.value = true;
  isEditing.value = true;
};

const newArr = computed(() => {
  if (hasQuestions.value) {
    return hasQuestions.value.questions.map((item, index) => {
      return {
        count: index,
        value: item.value,
        id: item.id,
      };
    });
  } else {
    return [
      {
        count: 1,
        value: '',
      },
    ];
  }
});
const questions = ref(newArr.value);

const add = () => {
  questions.value.push({ count: newArr.value.length + 1, value: '' });
};
const remove = (index) => {
  questions.value.splice(index, 1);
};
const save = () => {
  questions.value = questions.value.filter((i) => i.value && i.value.trim());
  if (questions.value.length) {
    if (hasQuestions.value) {
      AxiosService.put(runtimeConfig.public.apiBase + `survey/${props.project.id}`, {
        title: 'qa',
        description: 'qa',
        questions: questions.value,
      })
        .then(() => {
          projectsStore.getProjectAction(props.project.id);
          addModal.value = false;
        })
        .catch((e) => {
          if (e.response.data.errors) {
            const parseErrors = Object.values(e.response.data.errors);
            parseErrors.forEach((errorItem) => {
              nuxtApp.$alert.show(errorItem.join('\n'), {
                type: 'error',
                timeout: 5000,
              });
            });
          } else {
            nuxtApp.$alert.show(e.response.data.message, {
              type: 'error',
              timeout: 5000,
            });
          }
        });
    } else {
      AxiosService.post(runtimeConfig.public.apiBase + `survey/${props.project.id}`, {
        title: 'qa',
        description: 'qa',
        questions: questions.value,
      })
        .then(() => {
          projectsStore.getProjectAction(props.project.id);
          addModal.value = false;
        })
        .catch((e) => {
          if (e.response.data.errors) {
            const parseErrors = Object.values(e.response.data.errors);
            parseErrors.forEach((errorItem) => {
              nuxtApp.$alert.show(errorItem.join('\n'), {
                type: 'error',
                timeout: 5000,
              });
            });
          } else {
            nuxtApp.$alert.show(e.response.data.message, {
              type: 'error',
              timeout: 5000,
            });
          }
        });
    }
  } else {
    addModal.value = false;
  }
};
</script>
<style scoped lang="scss">
.modal {
  display: flex;
  flex-direction: column;
  padding: 32px;
  gap: 24px;
}
.container {
  width: 360px;
  display: flex;
  padding: 16px;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  align-self: stretch;
  border-radius: 16px;
  border: 1px solid $default-border;
  background: $white;
  .text {
    color: $secondary;
    font-variant-numeric: slashed-zero;
    font-family: 'Basis Grotesque Pro';
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
  }
  .qa {
    display: flex;
    width: 100%;
    padding: 8px;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 8px;
    border-radius: 8px;
    background: $default-bg;
    .title {
      color: $default;
      font-variant-numeric: lining-nums tabular-nums slashed-zero;
      font-family: 'Basis Grotesque Pro';
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: 24px;
    }
    .test {
      color: $section-title;
      font-variant-numeric: lining-nums tabular-nums slashed-zero;
      font-family: 'Basis Grotesque Pro';
      word-break: break-word;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 24px;
      margin-left: 7px;
      margin-right: 7px;
    }
  }
}
.modal {
  .title {
    color: $section-title;
    font-variant-numeric: slashed-zero;
    font-family: 'Basis Grotesque Pro';
    font-size: 24px;
    font-style: normal;
    font-weight: 500;
    line-height: 40px;
    text-align: center;
  }
  .type {
    display: flex;
    padding: 16px;
    align-items: flex-start;
    gap: 8px;
    align-self: stretch;
    border-radius: 16px;
    border: 1px solid $default-border;
    background: $default-badge-border;
    span {
      color: $default;
      font-variant-numeric: lining-nums tabular-nums slashed-zero;
      font-family: 'Basis Grotesque Pro';
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: 24px;
    }
  }
  .add {
    display: flex;
    padding: 7px 12px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    align-self: stretch;
    border-radius: 6px;
    background: #dad9f7;
    color: #38405b;
    font-variant-numeric: lining-nums tabular-nums slashed-zero;
    font-family: 'Basis Grotesque Pro';
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 16px;
    letter-spacing: 0.168px;
    width: 100%;
  }
}
</style>

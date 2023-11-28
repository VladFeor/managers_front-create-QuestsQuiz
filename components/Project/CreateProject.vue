<template>
  <div class="wrapper p-10" :class="isFastProjectActive === 1 && 'h-full'">
    <div>
      <div class="flex justify-between items-center">
        <h3 class="font-normal text-[32px] leading-10 text-[#1A1D29] h-10">Create a New Project</h3>
        <div class="text-sm">
          <FilterToggle
            centered
            class="!min-h-[40px] !flex !items-center"
            :buttons="projectOptions"
            :id="isFastProjectActive"
            @select="setIsFastProjectActive($event)"
          />
        </div>
      </div>
      <div class="mt-10">
        <p class="font-medium text-base leading-6 text-[#1A1D29] h-6">
          Project Owner Email Address
        </p>
        <p class="mt-1 text-[#6A6D8F] text-xs leading-4 font-medium h-4">
          This is the project email that everyone will see on the project page.
          <span class="text-[#38405B]"> This field is required. </span>
        </p>
      </div>
      <div class="mt-3">
        <EmailInput
          with-icon
          without-label
          v-model="data.owner_email"
          placeholder="Enter the project’s owner email"
          @error="error = $event"
        />
      </div>
      <ProjectFullContent v-if="!isFastProjectActive" @set-full-project-data="setFullProjectData" />
      <div
        class="mt-8 p-4 w-full h-[92px] bg-[#EAEAFB] border border-[#DAD9F7] rounded-lg flex items-start justify-between"
      >
        <div>
          <p class="font-medium text-base leading-6 text-[#1A1D29] h-6">Public Project</p>
          <p class="max-w-[289px] h-8 font-medium text-xs leading-4 text-[#6A6D8F]">
            Everyone can see the project when it is turned on, otherwise it is only available by
            direct link.
          </p>
        </div>

        <div>
          <Switch @checked="setIsProjectPublic" :checkedProp="data.public" />
        </div>
      </div>
    </div>
    <div>
      <div class="w-full mt-[88px]">
        <button
          :disabled="createProjectLoading"
          type="button"
          class="font-medium text-base leading-6 bg-[#FC660C] w-[240px] h-10 rounded-lg text-white flex items-center justify-center"
          @click="createNewProject"
        >
          <LoaderIcon :loading="createProjectLoading" />
          Create a Project
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useProjectsStore } from '~/store';
import { ProjectFullContent } from '@/components';
import { isValidHttpUrl } from '~/util/helpers';

const error = ref(null);
const isFastProjectActive = ref(1);
const base_data = {
  owner_email: '',
  public: false,
  fulfill: Boolean(isFastProjectActive),
};
const data = ref({
  ...base_data,
});
const newProjectErrors = computed(() => projectStore.getNewProjectErrors);
const projectOptions = computed(() => [
  {
    id: 0,
    title: 'Fully',
    name: false,
  },
  {
    id: 1,
    title: 'Fast',
    name: true,
  },
]);
const projectStore = useProjectsStore();
const nuxtApp = useNuxtApp();
const emits = defineEmits(['close']);
const createProjectLoading = computed(() => projectStore.getCreateProjectLoading);

const setIsFastProjectActive = (value) => {
  isFastProjectActive.value = value.id;
  data.value = base_data;
};
const setIsProjectPublic = (value) => {
  data.value.public = value;
};

const setFullProjectData = (fullProjectData) => {
  data.value = {
    ...data.value,
    ...fullProjectData,
  };
};

const createNewProject = async () => {
  if (hasErrorsWhileCreating.value) {
    nuxtApp.$alert.show(hasErrorsWhileCreating.value, {
      type: 'error',
      timeout: 5000,
    });
    return false;
  }

  if (!isFastProjectActive.value) {
    data.value.social_links = data.value.social_links.filter((l) => l.content.trim() !== '');
  }

  await projectStore.createProjectAction(data.value);
  const newProjectId = projectStore.getNewProjectId;

  if (newProjectId) {
    emits('close');
    nuxtApp.$alert.show('Success ! You have created a new project', {
      type: 'success',
      timeout: 5000,
    });
    window.dataLayer.push({
      event: 'ProjectTaskCreation',
    });
  } else {
    nuxtApp.$alert.show(
      newProjectErrors.value
        .map((err, index) => `${index + 1}. ${err} <br>`)
        .toString()
        .replace(/,/g, ''),
      {
        type: 'error',
        timeout: 5000,
        styles: {
          width: '400px !important',
        },
      },
    );
  }
};

const checkWebsiteCorrect = () => {
  let links = data.value.social_links;
  if (links && links.length > 0 && links[links.length - 1].content) {
    return isValidHttpUrl(links[links.length - 1].content);
  }
};

const hasErrorsWhileCreating = computed(() => {
  let {
    owner_email,
    logo,
    name,
    email,
    medium_username,
    description,
    blockchain_id,
    coin_type_id,
    tags,
    social_links,
  } = data.value;

  if (!owner_email.trim()) return 'You have to specify owners email';
  if (!isFastProjectActive.value) {
    if (!logo) return 'You have to upload the logo';
    if (!name.trim()) return 'You have to specify a name for the project';
    if (!description.trim()) return 'You have to specify a description for the project';
    if (description.length < 60) return 'Description should be at least 60 characters';
    if (description.length > 500) return "Description shouldn't be greater than 500 characters";
    if (tags.length <= 0) return 'You have to select at least one direction';
    if (!checkWebsiteCorrect()) return 'Please enter a valid website url';
    if (social_links.length > 0 && social_links.filter((l) => l.content.trim()).length <= 0)
      return 'You have to add at least one social link';
    if (!blockchain_id) return 'You have to select blockchain';
    if (!coin_type_id) return 'You have to specify coin type';
    if (!email.trim()) return false;
    if (!medium_username) return false;
  }
  return false;
});
</script>

<style scoped lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>

<template>
  <div class="edit-project">
    <div class="edit-project_header">
      <div class="edit-project_title">Project Change</div>
      <div class="edit-project-input_wrapper">
        <Icon class="search-icon" name="Search" :size="18" />
        <InputWithSearch
          fullWidth
          :placeholder="'Find a Project...'"
          :iconSize="24"
          v-model="searchValue"
        />
      </div>
    </div>

    <div class="edit-project_projects">
      <div
        v-for="project in filtredProjects"
        :key="project.id"
        @click="handleChangeProject(project.id)"
        class="edit-project_project"
      >
        <Talent
          :text="highlightMatch(project.name)"
          :img="project.logo"
          square
          big
          :isText="false"
        />
        <Icon v-if="selectedProjectId === project.id" name="Tik" :size="24" />
      </div>
    </div>
    <div class="edit-project_footer">
      <BaseButton text="Done" type="normal" @click="emit('update', selectedProjectId)" />
    </div>
  </div>
</template>

<script setup>
import { useProjectsStore } from '~/store/projects';
import { reduceStringLength } from '@/util/helpers';

const projectsStore = useProjectsStore();

const props = defineProps({
  projectId: { type: Number, default: null },
});

const emit = defineEmits(['update']);
const searchValue = ref('');

onMounted(() => {
  projectsStore.getProjectsAction();
  if (projects.value && projects.value.length) {
    filtredProjects.value = projects.value;
  }
});

const projects = computed(() => projectsStore.getProjects);

const selectedProjectId = ref(props.projectId);
const filtredProjects = ref(null);

watch(projects, (value) => {
  if (value && value.length) {
    filtredProjects.value = value;
  }
});

const handleChangeProject = (id) => {
  selectedProjectId.value = id;
};

watch(searchValue, (newValue) => {
  filterProjects(newValue);
});

const filterProjects = () => {
  if (searchValue.value) {
    filtredProjects.value = projects.value.filter((item) =>
      item.name.toLowerCase().includes(searchValue.value.toLowerCase()),
    );
  } else {
    filtredProjects.value = projects.value;
  }
};

const highlightMatch = (name) => {
  const regex = new RegExp(`(${reduceStringLength(searchValue.value, 20)})`, 'gi');
  return name.replace(regex, '<span style="color:#fc660c">$1</span>');
};
</script>

<style lang="scss" scoped>
.edit-project {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  &_header {
    position: absolute;
    top: 0;
    background: rgba(245, 245, 253, 0.64);
    backdrop-filter: blur(12px);
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 32px;
    gap: 24px;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
  }
  &_footer {
    padding: 32px;
    position: absolute;
    bottom: 0;
    background: rgba(245, 245, 253, 0.64);
    backdrop-filter: blur(12px);
    width: 100%;
    height: 104px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
  }
  &_projects {
    width: 100%;
    display: flex;
    flex-direction: column;
    max-height: 400px;
    min-height: 300px;
    overflow: auto;
    margin: 100px 0;
    padding-top: 65px;
    gap: 8px;

    &::-webkit-scrollbar {
      width: 6px;
      height: 60%;
    }

    &::-webkit-scrollbar-track {
      border-radius: 10px;
      margin-top: 70px;
    }

    &::-webkit-scrollbar-thumb {
      background: $secondary;
      border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: $secondary;
    }
  }
  &_project {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    margin: 0 32px;
    padding: 4px;
    &:hover {
      background: $default-badge-border;
      border-radius: 8px;
    }
  }
  &_title {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 24px;
    line-height: 40px;
    color: $section-title;
  }
}
.edit-project-input_wrapper {
  width: 100%;
  position: relative;
  .search-icon {
    position: absolute;
    left: 14px;
    top: 7px;
  }
  input {
    width: 100%;
    height: 32px;
    background: #ffffff;
    border: 1px solid #dad9f7;
    border-radius: 8px;
    padding-left: 40px;
    outline: none;

    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 24px;
    display: flex;
    align-items: center;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: #aaa7cc;
  }
}
</style>

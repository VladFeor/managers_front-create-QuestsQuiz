<template>
  <div class="projects-page" v-if="isSuperAdmin || isCatapultManager">
    <div class="flex justify-between items-center">
      <h1 class="text-[56px] leading-[72px] text-[#1A1D29] label">Projects</h1>
      <div class="flex items-center justify-center">
        <div class="relative">
          <input
            type="text"
            placeholder="Find a project..."
            class="h-10 w-[240px] px-[14px] py-[7px] rounded-lg bg-white border border-[#DAD9F7] text-base pl-10 outline-none"
            v-model="searchString"
            @input="searchProject"
          />
          <Icon name="Search" :size="20" class="absolute left-3 top-3" />
        </div>
        <button
          type="button"
          class="ml-6 bg-[#FC660C] px-3 py-[8px] rounded-lg h-10 flex items-center"
          v-if="isSuperAdmin"
          @click="projectCreateWindow = true"
        >
          <div class="text-base text-white font-medium leading-6">Create a Project</div>
          <img
            src="../../assets/icons/create-white.svg"
            class="h-[16px] fill-white text-white ml-3"
            alt=""
          />
        </button>
      </div>
    </div>
    <div v-if="isSuperAdmin" class="mt-12 flex justify-start h-[32px]">
      <BlockchainSelectSmall
        v-if="blockchainsLoaded && blockChainOptions"
        class="w-[165px] !z-20"
        :height="380"
        isEdit
        type="project"
        :options="blockChainOptions"
        :scrollHorizontalHidden="true"
        @input="setBlockChain"
      />
      <Multi
        label="Categories"
        class="ml-2 w-[200px]"
        :height="380"
        :options="categoriesOptions"
        :scrollHorizontalHidden="true"
        :show-label-and-lenght="true"
        @update:modelValue="setCategory"
      />
    </div>
    <div class="my-7 flex justify-start text-xl" v-if="allProjects && allProjects.length > 0">
      {{ allProjectsTotal }} projects
    </div>
    <BaseTable
      :columns="projectColumns"
      :rows="projectRows"
      pointer
      title="You have no projects yet"
      icon="icons8-futurama-bender"
      :sortFunction="sortTasks"
      :sortDirection="sortDirection"
      :setSortDirection="setSortDirection"
      :sortColumn="sortColumn"
      :setSortColumn="setSortColumn"
      isSorting
    />
    <BaseModal
      custom-height="95%"
      top="16"
      right-custom="16"
      :width="600"
      @close="projectCreateWindow = !projectCreateWindow"
      :visible="projectCreateWindow"
      btn-left
      @openConfirmationModal="isConfirmModalOpen = true"
      is-confirm
      bodyClasses="fullHeight"
    >
      <CreateProject @close="projectCreateWindow = !projectCreateWindow" />
    </BaseModal>
    <BaseModal
      isCloseBtnInvisible
      :width="480"
      customHeight="248px"
      @close="handleCloseConfirm($event)"
      :visible="isConfirmModalOpen"
    >
      <div class="confirm-modal">
        <div class="confirm-modal_title">Rejection of the Project Creation</div>
        <div class="confirm-modal_subtitle">
          Confirm that this decision if you dont want to complete the creation
        </div>

        <div class="confirm-modal_btns-wrapper">
          <BaseButton text="Cancel" type="secondary" @click="handleCloseConfirm(false)" />
          <BaseButton
            text="Reject"
            type="normal"
            @click="
              handleCloseConfirm(false);
              projectCreateWindow = false;
            "
          />
        </div>
      </div>
    </BaseModal>
    <Pagination
      v-if="!projectsLoading && isProjectsLoaded"
      @pageChanged="nextPage($event)"
      :currentPage="currentPage"
      :totalPages="totalPages"
    />
  </div>
  <template v-else>
    <ProjectDetailSkeleton v-if="projectsLoading" />
    <div
      v-if="
        (isProjectOwner || isProjectManager || isProjectAdministrator) &&
        allProjects &&
        allProjects.length > 0
      "
    >
      <ProjectDetailPage :project-id="allProjects[0].id" />
    </div>
  </template>
</template>

<script setup>
import defaultBg from '@/assets/images/default-avatar.png';
import { computed, onMounted, ref } from 'vue';
import { useProjectsStore } from '~/store/projects';
import { useBlockchainsStore } from '~/store/blockchains';
import { reduceStringLength, formatNumber } from '~/util/helpers';
import { Talent, CreatedAt, Categories, Badge } from '~/components';
import { useCoinsStore } from '~/store';
import BaseButton from '~/components/BaseButton.vue';
import ProjectDetailPage from '~/components/Project/ProjectDetailPage.vue';
import BlockchainName from '~/components/Project/BlockchainName.vue';

let isMounted = false;
let baseProjects = [];
const coinsStore = useCoinsStore();
const projectsStore = useProjectsStore();
const blockchainsStore = useBlockchainsStore();
const route = useRoute();

onMounted(async () => {
  await coinsStore.getCoinsAction();
  await blockchainsStore.getBlockchainsAction();
  await projectsStore.getTagsAction();
  if (route.query && route.query.page) {
    await nextPage(route.query.page);
  }
  await projectsStore.getSocialLinksAction({ assigned_to: 'project' });
  await projectsStore.getProjectsListAction({
    blockchain_id: 0,
    page: currentPage.value,
  });
  isMounted = true;
});

const isConfirmModalOpen = ref(false);
const projectCreateWindow = ref(false);
const searchString = ref(null);
const searchTimeout = ref(null);
const categories = ref([]);
const blockChainId = ref(0);
const currentPage = ref(route.query ? route.query.page : 1);
const sortDirection = ref('');
const sortColumn = ref('');

const totalPages = computed(() => projectsStore.getProjectsList.pagination.total_pages);
const allTagsData = computed(() => projectsStore.getTags);
const allProjectsData = computed(() => projectsStore.getProjectsList.data);
const allProjectsTotal = computed(() => projectsStore.getProjectsList.pagination.total);
const projectsLoading = computed(() => projectsStore.getProjectsLoading);
const isProjectsLoaded = computed(() => projectsStore.getIsProjectsLoaded);
const allProjects = computed(() => allProjectsData.value);
const allTags = computed(() => allTagsData.value);
const projectColumns = computed(() => {
  return [
    { prop: 'project', label: 'Project', width: '460px' },
    { prop: 'created', label: 'Created', width: '25%' },
    { prop: 'blockchainName', label: 'Blockchain', width: '25%' },
    { prop: 'categories', label: 'Categories', width: '55%' },
    { prop: 'talents', label: 'Talents', width: '17%' },
    { prop: 'tasks', label: 'Tasks', width: '17%' },
    { prop: 'reviewed', label: 'Reviewed', width: '17%' },
    { prop: 'usdt_payed', label: 'USDT Payed', width: '30%' },
  ];
});
const projectRows = computed(
  () => {
    const projectsArray = projectsStore.getProjectsList.data;
    // const projectsArray = allProjects.value;
    if (!projectsArray || (projectsArray && !projectsArray.length)) {
      return [];
    }
    return projectsArray.map((item) => {
      return {
        to: `projects/${item.id}`,
        project: {
          component: Talent,
          props: {
            text: item.name ? reduceStringLength(item.name, 21) : '',
            img: item.logo && item.logo ? item.logo : defaultBg,
            square: true,
            reduceLength: 35,
          },
        },
        created: {
          component: CreatedAt,
          props: {
            text: item.created_at,
          },
        },
        blockchainName: {
          component: BlockchainName,
          props: {
            text: item.blockchain ? item.blockchain.name : null,
            icon: item.blockchain ? item.blockchain.name : null,
          },
        },
        // categories: {
        //   component: Badge,
        //   props: {
        //     text: item.tags && item.tags.length ? item.tags[0].tag.name : 'no tags',
        //     value: '',
        //     type: 'transparent',
        //     big: false,
        //   },
        // },
        categories: {
          component: Categories,
          props: {
            expand: false,
            categories: item.tags && item.tags.length ? item.tags : [],
            tagLimit: 1,
          },
        },
        talents: {
          content: item.talents_count,
        },
        tasks: {
          content: item.tasks_count,
        },
        reviewed: {
          content: item.reviewed_tasks,
        },
        usdt_payed: {
          content: item.totalPayout && item.totalPayout > 0 ? formatNumber(item.totalPayout, 4) : 0,
        },
      };
    });
  },
  { dependsOn: [allProjects] },
);
const blockChainOptions = computed(() => [
  { id: 0, name: 'All Blockchains' },
  ...blockchainsStore.getBlockchains,
]);
const blockchainsLoaded = computed(() => blockchainsStore.blockchainsLoaded);
const categoriesOptions = computed(() => [{ name: 'Any Categories' }, ...allTags.value]);
const roles = inject('roles');
const {
  isSuperAdmin,
  isCatapultManager,
  isProjectOwner,
  isProjectManager,
  isProjectAdministrator,
} = roles;

const roundTo = (n, place) => {
  return +(Math.round(n + 'e+' + place) + 'e-' + place);
};

const setSortDirection = (value) => {
  sortDirection.value = value;
};

const setSortColumn = (value) => {
  sortColumn.value = value;
};

const handleCloseConfirm = (value) => {
  isConfirmModalOpen.value = value;
};

const sortTasks = (prop, direction) => {
  if (!isMounted) return;

  getProjectsByParams(prop, direction);
};

const getProperty = (obj, prop) => {
  const props = prop.split('.');
  const regex = /\[(\d+)]/;

  return props.reduce((prev, curr) => {
    const matches = regex.exec(curr);
    if (matches) {
      const index = parseInt(matches[1]);
      const arrProp = curr.slice(0, matches.index);
      return prev[arrProp][hello];
    } else {
      return prev && prev[curr];
    }
  }, obj);
};
function nextPage(page) {
  currentPage.value = page;

  getProjectsByParams(sortColumn.value, sortDirection.value);
}
function setBlockChain(blockChain) {
  currentPage.value = 1;
  blockChainId.value = blockChain.id;
  getProjectsByParams(sortColumn.value, sortDirection.value);
}
function setCategory(category) {
  categories.value = category[0] === 'Any Categories' ? null : category;
  getProjectsByParams(sortColumn.value, sortDirection.value);
}
function searchProject() {
  clearTimeout(searchTimeout.value);
  currentPage.value = 1;
  searchTimeout.value = setTimeout(
    () => getProjectsByParams(sortColumn.value, sortDirection.value),
    1500,
  );
}
function getProjectsByParams(prop, direction) {
  const params = {
    search: searchString.value || null,
    tags: categories.value,
    blockchain_id: blockChainId.value,
    page: currentPage.value,
  };

  if (direction) {
    params.sortKey = prop;
    params.sortType = direction;
  }

  if (prop && prop === 'usdt_payed') {
    params.sortKey = 'payed';
  }

  projectsStore.getProjectsListAction(params);
}

watch(allProjectsData, (value) => {
  if (value) {
    baseProjects = JSON.parse(JSON.stringify(value));
  }
});
</script>
<style lang="scss">
.projects-page {
  font-family: 'Basis Grotesque Pro', serif;
  font-style: normal;
  font-weight: 400;
  line-height: 40px;
  color: $section-title;
  .label {
    font-weight: 350;
  }
  .confirm-modal {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 32px;
    gap: 24px;
    &_title {
      font-style: normal;
      font-weight: 400;
      font-size: 24px;
      line-height: 40px;
      color: $section-title;
    }
    &_subtitle {
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      display: flex;
      align-items: center;
      text-align: center;
      font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
      color: $section-title;
    }
    &_btns-wrapper {
      width: 100%;
      display: flex;
      gap: 24px;
    }
  }
}
</style>

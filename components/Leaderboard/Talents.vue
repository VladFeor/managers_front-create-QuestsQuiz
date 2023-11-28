<template>
  <div class="filters">
    <div class="toggles_wrapper">
      <FilterToggle :buttons="buttons" :id="id" @select="setTable($event)" />
      <div class="line"></div>
      <div v-if="!isTwitter" class="flex gap-x-2">
        <MultiSelectFilter
          v-if="!status && (isSuperAdmin || isCatapultManager) && !project"
          :options="projects"
          name="Project"
          @select="addTags({ ...$event, type: 'project_id' })"
          :reset="reset"
          :deleted="deletedId"
          :limit="1"
          :reduceLength="16"
        ></MultiSelectFilter>
        <MultiSelectFilter
          :options="directions"
          name="Directions"
          @select="addTags({ ...$event, type: 'activity_ids' })"
          :reset="reset"
          :deleted="deletedId"
        ></MultiSelectFilter>
        <MultiSelectFilter
          :options="skills"
          :deleted="deletedId"
          name="Skills"
          @select="addTags({ ...$event, type: 'skill_ids' })"
          :reset="reset"
        ></MultiSelectFilter>
        <MultiSelectFilter
          :options="languages"
          name="Languages"
          @select="addTags({ ...$event, type: 'language_ids' })"
          :reset="reset"
          type="languages"
          :deleted="deletedId"
        ></MultiSelectFilter>
        <MultiSelectLevel
          @selectLvl="addLevel"
          :reset="resetLvl"
          @reset="removeLevel"
          type="lvl"
        ></MultiSelectLevel>
        <SliderSelect
          :range="[0, 2500]"
          name="Quality Points"
          @select="addTags"
          prefix="QP"
          type="xp"
          :reset="!tags.find((el) => el.type === 'xp')"
        ></SliderSelect>
        <SliderSelect
          :range="[0, 10]"
          name="Tasks In Works"
          type="task"
          :reset="!tags.find((el) => el.type === 'task')"
          @select="addTags"
          prefix="Task in Progress"
        ></SliderSelect>
        <SliderSelect
          :range="[0, 5]"
          :step="0.1"
          name="Average Rating"
          @select="addTags"
          prefix="AR"
          type="average_point"
          :reset="!tags.find((el) => el.type === 'average_point')"
        ></SliderSelect>
      </div>
      <div v-else class="flex gap-x-2">
        <MultiSelectFilter
          :options="countries"
          name="Region"
          @select="addTags({ ...$event, type: 'country_ids' })"
          :reset="reset"
          :deleted="deletedId"
        ></MultiSelectFilter>
        <SliderSelect
          :range="[0, 1000000]"
          name="Followers"
          type="followers"
          :reset="!tags.find((el) => el.type === 'followers')"
          @select="addTags"
          prefix="Followers"
        ></SliderSelect>

        <SliderSelect
          :range="[0, 1000000]"
          name="Following"
          type="following"
          :reset="!tags.find((el) => el.type === 'following')"
          @select="addTags"
          prefix="Following"
        ></SliderSelect>

        <SliderSelect
          :range="[0, 100000]"
          name="Tweets"
          type="tweets"
          :reset="!tags.find((el) => el.type === 'tweets')"
          @select="addTags"
          prefix="Tweets"
        ></SliderSelect>

        <MultiSelectFilter
          :options="keywords"
          name="Key words"
          @select="addTags({ ...$event, type: 'keywords' })"
          :reset="reset"
          :deleted="deletedId"
        ></MultiSelectFilter>
      </div>
    </div>
  </div>
  <div class="tags" v-if="talents && !project">
    <div class="tags-quantity">
      <span class="title">{{ talents.pagination ? talents.pagination.total : 0 }} talents</span>
    </div>
    <div class="tags-block">
      <div v-for="(item, index) in sortedTags" :key="item.id" class="tag">
        <div>
          {{ item.name }}
        </div>
        <div class="tag-icon">
          <Icon
            class="remove-tag"
            @click.stop="
              removeTag(index);
              deletedId = item.name;
            "
            icon="Cancel"
            :size="16"
          />
        </div>
      </div>
      <div v-if="tags.length" class="clear-filtrers" @click="clear"><span>Clear All</span></div>
    </div>
  </div>
  <div v-if="!isTwitter" class="flex flex-col">
    <TableSkeleton v-if="!loaded" />
    <TalentsTable
      v-else
      :project="project"
      :columns="talentsColumns"
      :rows="talentsRows"
      @checkActive="handleCheck($event)"
      pointer
      title="No data"
      icon="icons8-futurama-bender"
      :checkedRows="checkedRowsIds"
      :updateCheckedRows="updateCheckedRows"
      @invite="openInviteSolo"
      @remove="removeFromProjectSolo"
      @removeTalent="removeFromTalentSolo"
      :sortFunction="sortTasks"
      :sortDirection="sortDirection"
      :setSortDirection="setSortDirection"
      :setSortColumn="setSortColumn"
      :sortColumn="sortColumn"
      isSorting
      :canRemove="isSuperAdmin"
      :style="{ 'margin-bottom': talentsRows.length ? '0px' : '40px' }"
    ></TalentsTable>
    <Pagination
      :currentPage="currentPage"
      @pageChanged="nextPage($event)"
      v-if="loaded && talentsRows && talentsRows.length"
      :totalPages="talents.pagination.total_pages"
      :style="{ 'margin-bottom': checkedRowsIds.length && isTableCheckActive ? '100px' : '40px' }"
    />
  </div>
  <div v-else class="flex flex-col">
    <TableSkeleton v-if="!loaded" />
    <TalentsTable
      v-else
      :columns="talentsColumns"
      :rows="talentsRows"
      title="No data"
      icon="icons8-futurama-bender"
      pointer
      :sortFunction="sortTasks"
      :sortDirection="sortDirection"
      :setSortDirection="setSortDirection"
      :sortColumn="sortColumn"
      :setSortColumn="setSortColumn"
      :checkedRows="checkedRowsIds"
      :updateCheckedRows="updateCheckedRows"
      @invite="openInviteSolo"
      @remove="removeFromProjectSolo"
      @checkActive="handleCheck($event)"
      isSorting
    ></TalentsTable>
    <Pagination
      :currentPage="currentPage"
      @pageChanged="nextPage($event)"
      v-if="loaded && talentsRows && talentsRows.length"
      :totalPages="talents.pagination.total_pages"
      :style="{ 'margin-bottom': checkedRowsIds.length && isTableCheckActive ? '100px' : '40px' }"
    />
  </div>
  <div
    :style="{ 'margin-bottom': checkedRowsIds.length && isTableCheckActive ? '100px' : '40px' }"
  ></div>

  <div
    class="controller-talents"
    :class="{ 'controller-talents__scrolled': isAtBottom }"
    v-if="
      isTableCheckActive &&
      !isProjectAdministrator &&
      checkedRowsIds.filter((i) => i !== 0).length > 0
    "
  >
    <div class="controller-body" :class="{ open: isSidebarOpen }">
      <div class="flex gap-6 items-center">
        <SelectProject
          v-if="!isSuperAdmin"
          @select="selectProject"
          isInvisibleBg
          :selected="isProjectOwner"
        ></SelectProject>
        <div class="counts">
          {{ checkedRowsIds.filter((i) => i !== 0).length }} talents are selected
        </div>
      </div>
      <div class="controllers">
        <base-button
          v-if="(currentProject || !isProjectManager) && id === 1"
          text="Create a Task"
          @click="visible = true"
        ></base-button>
        <div
          class="remove flex items-center gap-x-1"
          v-if="isSuperAdmin && !isTwitter"
          @click="removeFromTalentumFn()"
        >
          Remove from Talentum <Icon icon="Delete-def" color="#cc2d14" :size="24"></Icon>
        </div>
        <div
          class="remove flex items-center gap-x-1"
          v-else-if="id === 1 && !isTwitter"
          @click="removeFromProjectMulti()"
        >
          Remove from Project <Icon icon="Delete-def" color="#cc2d14" :size="24"></Icon>
        </div>
        <div
          v-if="((!currentProject || !status) && id === 0) || isTwitter"
          class="invite"
          @click="inviteMultiProjectFn"
        >
          Invite to the Project ...
        </div>
      </div>
    </div>
  </div>
  <SoloIntive
    @close="openSolo = false"
    v-if="openSolo"
    :talent="currentTalent"
    :project="isProjectOwner ? projects[0] : null"
    @invite="inviteSolo"
  ></SoloIntive>
  <SoloRemoveFromTalent
    @close="removeSolo = false"
    v-if="removeSolo"
    :talent="currentTalent"
    @remove="removeFromTalentumSolo"
    :needWithdraw="currentTalent.withdrawal_requests_exists"
  ></SoloRemoveFromTalent>
  <SoloRemoveProject
    @close="removeProjectSolo = false"
    v-if="removeProjectSolo"
    :talent="currentTalent"
    :project="isProjectOwner ? projects[0] : null"
    @remove="removeFromProjectSoloFn"
    :needWithdraw="currentTalent.withdrawal_requests_exists"
  ></SoloRemoveProject>
  <MultiRemoving
    @close="removeMultiProject = false"
    v-if="removeMultiProject"
    :talents="selectedTalents"
    :needWithdraw="selectedTalents.find((item) => item.withdrawal_requests_exists)"
    :project="projects.find((item) => item.id === currentProject)"
    @remove="removeFromProject"
  ></MultiRemoving>
  <MultiRemovingFromTalentum
    @close="removeMultiTalentum = false"
    v-if="removeMultiTalentum"
    :talents="selectedTalents"
    @remove="removeFromTalentum"
    :needWithdraw="selectedTalents.find((item) => item.withdrawal_requests_exists)"
  ></MultiRemovingFromTalentum>
  <MultiInvite
    @close="inviteMultiProject = false"
    v-if="inviteMultiProject"
    :talents="selectedTalents"
    :project="projects.find((item) => item.id === currentProject)"
    @invite="inviteToProject"
  ></MultiInvite>
  <BaseModal
    :width="600"
    :top="10"
    :rightCustom="10"
    :bottom="10"
    customHeight="auto"
    @close="handleClose($event)"
    :visible="visible"
    btnLeft
    @openConfirmationModal="isConfirmModalOpen = true"
    isConfirm
  >
    <CreateTask
      @close="handleClose(false)"
      isTalents
      :currentSelectedTalents="currentSelectedTalents"
    />
  </BaseModal>
  <BaseModal
    isCloseBtnInvisible
    :width="480"
    customHeight="248px"
    @close="handleCloseConfirm($event)"
    :visible="isConfirmModalOpen"
  >
    <div class="confirm-modal">
      <div class="confirm-modal_title">Rejection of the Task Creation</div>
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
            handleClose(false);
          "
        />
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import Badge from '@/components/Badge.vue';
import Talent from '@/components/Talent.vue';
import defaultBg from '@/assets/images/default-avatar.png';
import { useActivitiesStore } from '~/store/activities';
import { getBadgeTypeByName } from '@/util/helpers';
import { useProjectsStore } from '~/store/projects';
import { ref, computed, onMounted, inject, nextTick, onBeforeUnmount } from 'vue';
import { useAssetsStore } from '~/store/assets';
import { useTalentsStore } from '~/store/talents';
import MultiBadge from '~/components/InnerWallet/MultiBadge.vue';
import { useUserStore } from '~/store';
import AxiosService from '~/service/axiosService';
import { useRouter, useRoute } from 'vue-router';
import { useDashboardStore } from '~/store/dashboard';
const isAtBottom = ref(false);

const handleScroll = () => {
  isAtBottom.value = isScrolledToBottom();
};

const isScrolledToBottom = () => {
  const threshold = 72;
  const windowHeight = window.innerHeight;
  const scrollY = window.scrollY;
  const documentHeight = document.documentElement.scrollHeight;
  return windowHeight + scrollY + threshold >= documentHeight;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});

const dashboardStore = useDashboardStore();

const isTableCheckActive = ref(false);

const emit = defineEmits(['pagData']);
const roles = inject('roles');

const {
  isSuperAdmin,
  isProjectOwner,
  isProjectAdministrator,
  isCatapultManager,
  isProjectManager,
} = roles;
const props = defineProps({
  defaultProject: { type: Object, default: null },
  search: { type: String, default: '' },
});

const isSidebarOpen = computed(() => dashboardStore.getIsSidebarOpen);
watch(props, () => {
  clearTimeout(searchInterval.value);
  searchInterval.value = setTimeout(() => {
    talentsStore.getTalentsAction(1, setParrams(tags.value), isTwitter.value ? 'twitter' : '');
    checkedRowsIds.value = [];
  }, 500);
});
const deletedId = ref('');
const tags = ref([]);
const openSolo = ref(false);
const removeMultiTalentum = ref(false);
const removeSolo = ref(false);
const route = useRoute();
const router = useRouter();
const myStore = useUserStore();
const assetsStore = useAssetsStore();
const projectsStore = useProjectsStore();
const activityStore = useActivitiesStore();
const talentsStore = useTalentsStore();
const sort = ref({});
const order = ref([
  'project_id',
  'activity_ids',
  'skill_ids',
  'language_ids',
  'lvl',
  'xp',
  'task',
  'average_point',
]);

const sortedTags = computed(() =>
  tags.value.sort((a, b) => order.value.indexOf(a.type) - order.value.indexOf(b.type)),
);

const buttons = computed(() => {
  if (isSuperAdmin.value) {
    return [
      {
        title: `Overview`,
        id: 0,
        name: 'Overview',
      },
      {
        title: `Twitter`,
        id: 1,
        name: 'Twitter',
      },
    ];
  } else {
    return [
      {
        title: `Overview`,
        id: 0,
        name: 'Overview',
      },
      {
        title: `My Project`,
        id: 1,
        name: 'my_project',
      },
      {
        title: `Twitter`,
        id: 2,
        name: 'Twitter',
      },
    ];
  }
});
const visible = ref(false);
const handleClose = (value) => {
  visible.value = value;
};

const isConfirmModalOpen = ref(false);
const handleCloseConfirm = (value) => {
  isConfirmModalOpen.value = value;
};

const selectProject = (proj) => {
  currentProject.value = proj.id;
};
watch(tags.value, (newValue) => {
  sort.value = null;
  talentsStore.getTalentsAction(1, setParrams(newValue), isTwitter.value ? 'twitter' : '');
  updateCheckedRows([]);
});

watch(
  sort,
  async (newValue) => {
    if (newValue && newValue.sortKey && newValue.sortType) {
      await router.push({ query: Object.assign({}, route.query, { page: 1 }) });
      await talentsStore.getTalentsAction(
        1,
        setParrams(tags.value),
        isTwitter.value ? 'twitter' : '',
      );
      await nextTick();
    }
  },
  { deep: true },
);

const sortTasks = (prop, direction) => {
  if (!isMounted) return;
  sortHandle(prop, direction);
};
const sortDirection = ref('');
const sortColumn = ref('');
const sortHandle = async (name, type) => {
  console.log(name, type);
  const params = {};
  if (type) {
    params.sortKey = name;
    params.sortType = type;
  }
  sort.value = params;
};

const setSortDirection = async (value) => {
  sortDirection.value = value;
};
const setSortColumn = (value) => {
  sortColumn.value = value;
};
const searchInterval = ref(null);
const countries = computed(() => assetsStore.getCountries);

const currentTalent = ref(null);

const currentProject = ref(null);
const myProject = computed(() => myStore.getUserProjectId);
const setParrams = (data) => {
  const params = {};
  checkedRowsIds.value = [];
  if (status.value) {
    params['project_id'] = myProject.value;
  }
  if (props.search) {
    params['search'] = props.search;
  }
  data.forEach((item) => {
    const { id, min, max, type, value } = item;
    if (type === 'task') {
      params['tasks_in_progress_min'] = min;
      params['tasks_in_progress_max'] = max;
    }
    if (type === 'xp') {
      params['exp_min'] = min;
      params['exp_max'] = max;
    }
    if (type === 'followers') {
      params['followers_min'] = min;
      params['followers_max'] = max;
    }
    if (type === 'following') {
      params['following_min'] = min;
      params['following_max'] = max;
    }
    if (type === 'average_point') {
      params['min_ap'] = min;
      params['max_ap'] = max;
    }
    if (type === 'tweets') {
      params['tweets_min'] = min;
      params['tweets_max'] = max;
    }

    if (type === 'project_id' && !status.value) {
      params['project_id'] = id;
      currentProject.value = id;
    }
    if (type === 'lvl') {
      params['levels'] = value;
    } else if (id) {
      if (!params[`${type}`]) {
        params[`${type}`] = [id];
      } else if (type !== 'project_id') {
        params[`${type}`].push(id);
      }
    }
  });
  if (sort.value) {
    params['sort[key]'] = sort.value.sortKey;
    params['sort[type]'] = sort.value.sortType;
  }
  return params;
};
const removeTag = (index) => {
  if (tags.value[index].type === 'lvl') {
    removeLevel();
  } else {
    tags.value.splice(index, 1);
  }
};
const removeLevel = () => {
  resetLvl.value = false;
  const index = tags.value.findIndex((el) => el.type === 'lvl');
  if (index !== -1) {
    tags.value.splice(index, 1);
    resetLvl.value = true;
  }
};

const addTags = (item) => {
  deletedId.value = '';
  if (item) {
    if (
      item.type === 'xp' ||
      item.type === 'task' ||
      item.type === 'tweets' ||
      item.type === 'following' ||
      item.type === 'followers' ||
      item.type === 'average_point'
    ) {
      const index = tags.value.findIndex((el) => el.type === item.type);
      if (index !== -1) {
        tags.value.splice(index, 1);
        resetLvl.value = false;
      }
    }
    if (
      item.type === 'project_id' &&
      tags.value.filter((i) => i.type === 'project_id' && item.id !== i.id).length >= 1
    ) {
      const index = tags.value.findIndex((el) => el.type === item.type);
      if (index !== -1) {
        tags.value.splice(index, 1);
      }
    }

    const newTags = [...tags.value, item];
    const groups = newTags.reduce((acc, item) => {
      const key = JSON.stringify(item);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const itemsToRemove = newTags.filter((item) => groups[JSON.stringify(item)] !== 1);

    itemsToRemove.forEach((itemToRemove) => {
      const indexToRemove = tags.value.findIndex(
        (item) => JSON.stringify(item) === JSON.stringify(itemToRemove),
      );
      if (indexToRemove !== -1) {
        tags.value.splice(indexToRemove, 1);
      }
    });

    if (!itemsToRemove.includes(item)) {
      tags.value.push(item);
    }
  }
};
const addLevel = async (item) => {
  const index = tags.value.findIndex((el) => el.type === 'lvl');
  if (index !== -1) {
    tags.value.splice(index, 1);
  }
  tags.value.push(item);
};
const reset = ref(false);
const resetLvl = ref(false);
const clear = async () => {
  reset.value = true;
  resetLvl.value = true;
  currentProject.value = null;
  await nextTick();
  tags.value.splice(0, tags.value.length);
  reset.value = false;
  resetLvl.value = false;
  sort.value = null;
  sortDirection.value = null;
  sortColumn.value = null;
};
onMounted(() => {
  assetsStore.getLanguagesAction();
  assetsStore.getSkillsAction();
  activityStore.getActivitiesAction();
  projectsStore.getProjectsAction();
  assetsStore.getCountriesAction();
  assetsStore.getKeyWordsAction();

  if (project.value) {
    addTags({
      id: project.value.id,
      name: project.value.name,
      logo: project.value.logo,
      type: 'project_id',
    });
  } else if (route.query && route.query.status && route.query.status === 'my_projects') {
    status.value = true;
    id.value = 1;
    talentsStore.getTalentsAction(
      currentPage.value,
      setParrams(tags.value),
      isTwitter.value ? 'twitter' : '',
    );
  } else {
    talentsStore.getTalentsAction(currentPage.value, '', isTwitter.value ? 'twitter' : '');
  }
  if (route.query && route.query.page) {
    nextPage(+route.query.page);
  }
  if (route.query && route.query.table) {
    if (+route.query.table === 1 && isSuperAdmin.value) {
      setTable({ id: +route.query.table, status: 'Twitter' });
    } else if (+route.query.table === 1 && !isSuperAdmin.value) {
      setTable({ id: +route.query.table, status: 'my_project' });
    } else {
      setTable({ id: +route.query.table });
    }
  }

  isMounted = true;
});
const talents = computed(() => talentsStore.getTalents);
const loaded = computed(() => talentsStore.getTalentsLoaded);
const languages = computed(() => assetsStore.getLanguages);
const keywords = computed(() =>
  assetsStore.getKeywords.map((i) => {
    return {
      id: i,
      name: i,
    };
  }),
);
const skills = computed(() => assetsStore.getSkills);
const directions = computed(() => activityStore.getActivities);
const projects = computed(() =>
  projectsStore.getProjects.map((item) => ({
    id: item.id,
    name: item.name,
    logo: item.logo,
  })),
);

const priority = ref('');
const direction = ref('');
const project = toRef(props, 'defaultProject');
let isMounted = false;

const currentPage = ref(route.query ? route.query.page : 1);
const status = ref(false);
const removeProjectSolo = ref(false);
const removeMultiProject = ref(false);
const inviteMultiProject = ref(false);
const nextPage = (page) => {
  currentPage.value = page;
  talentsStore.getTalentsAction(page, setParrams(tags.value), isTwitter.value ? 'twitter' : '');
};
const id = ref(0);
const isTwitter = ref(false);

const talentsColumns = computed(() => {
  if (!isTwitter.value) {
    return [
      { prop: 'talent', label: 'Talent', width: '80%' },
      { prop: 'direction', label: 'Directions', width: '145%' },
      { prop: 'languages', label: 'Languages', width: '60%' },
      { prop: 'level', label: 'Level', width: '40%' },
      {
        prop: 'qp',
        label: 'QP',
        width: '30%',
      },
      {
        prop: 'average_point',
        label: 'AV',
        width: '30%',
      },
      { prop: 'task_in_progress', label: 'Tasks In Works', width: '60%' },
    ];
  } else {
    return [
      { prop: 'talent', label: 'Talent', width: '120%' },
      { prop: 'twitter_handle', label: 'Twitter Handle', width: '145%' },
      { prop: 'country', label: 'Region', width: '100%' },
      { prop: 'followers', label: 'Followers', width: '60%' },
      { prop: 'following', label: 'Following', width: '60%' },
      { prop: 'tweets', label: 'Tweets', width: '60%' },
    ];
  }
});
const setTable = async (item) => {
  console.log(item);
  status.value = item.status === 'my_project';
  isTwitter.value = item.status === 'Twitter';
  await clear();
  await talentsStore.getTalentsAction(1, setParrams(tags.value), isTwitter.value ? 'twitter' : '');
  checkedRowsIds.value = [];
  id.value = item.id;
  await router.push({ query: Object.assign({}, route.query, { table: item.id }) });
};
const talentsRows = computed(
  () => {
    const tasksArray = talents.value.data;
    if (!tasksArray || (tasksArray && !tasksArray.length)) {
      return [];
    }
    return tasksArray.map((item) => {
      return {
        itemId: item.id,
        status: item.invitation_status,
        talent: {
          component: Talent,
          props: {
            text: item.name,
            img: item.avatar ? item.avatar : defaultBg,
            square: false,
            reduceLength: 15,
            big: true,
          },
        },
        profile: item,
        twitter_handle: {
          component: Badge,
          props: {
            text:
              item.twitter && item.twitter.twitter_handle
                ? '@' + item.twitter.twitter_handle
                : null,
            value: '',
            big: false,
          },
        },
        country: {
          component: Badge,
          props: {
            text: item.country,
            value: '',
            big: false,
          },
        },
        project: {
          component: Talent,
          props: {
            text: item.project ? item.project.name : '',
            img: item.project && item.project.logo ? item.project.logo : defaultBg,
            square: true,
            reduceLength: 15,
          },
        },
        direction: {
          component: MultiBadge,
          props: {
            badges: item.activities?.map((el) => ({
              component: Badge,
              props: {
                text: el.activity?.name,
                value: '',
                type: getBadgeTypeByName(el.activity?.name),
                big: false,
              },
              id: 2,
            })),
            type: '',
            rowType: 'activity',
            big: false,
          },
        },
        languages: {
          component: MultiBadge,
          props: {
            badges: item.languages?.map((el) => ({
              component: Badge,
              props: {
                text: el.language?.name,
                value: '',
                type: el.language?.name,
                big: false,
              },
              id: 2,
            })),
            type: 'claim',
            big: false,
          },
        },
        level: {
          content: item.level,
        },
        followers: {
          content: item.twitter?.followers,
        },
        following: {
          content: item.twitter?.following,
        },
        tweets: {
          content: item.twitter?.tweets,
        },
        qp: {
          content: item.points,
        },
        average_point: {
          content: item.average_point,
        },
        task_in_progress: {
          content: item.tasks_in_work_count,
        },
      };
    });
  },
  { dependsOn: [talents] },
);

const openInviteSolo = (id) => {
  currentTalent.value = talents.value.data.find((talent) => talent.id === id);
  openSolo.value = true;
};
const removeFromTalentSolo = (id) => {
  currentTalent.value = talents.value.data.find((talent) => talent.id === id);
  removeSolo.value = true;
};

const removeFromProjectSolo = (id) => {
  currentTalent.value = talents.value.data.find((talent) => talent.id === id);
  removeProjectSolo.value = true;
};
const selectedTalents = ref([]);
const removeFromProjectMulti = () => {
  removeMultiProject.value = true;
  selectedTalents.value = talents.value.data.filter((item) => {
    return checkedRowsIds.value.some((rowId) => rowId === item.id);
  });
};
const inviteMultiProjectFn = () => {
  inviteMultiProject.value = true;
  selectedTalents.value = talents.value.data.filter((item) => {
    return checkedRowsIds.value.some((rowId) => rowId === item.id);
  });
};
const removeFromTalentumFn = () => {
  removeMultiTalentum.value = true;
  selectedTalents.value = talents.value.data.filter((item) => {
    return checkedRowsIds.value.some((rowId) => rowId === item.id);
  });
};

const totalPages = ref(1);
const checkedRows = ref([]);

const checkedRowsIds = ref([]);
const currentSelectedTalents = ref([]);

watch(
  [() => checkedRowsIds.value, () => talents.value],
  ([checkedRowsIds, talents]) => {
    if (talents.data && talents.data.length) {
      const currentTalents = talents.data.filter((item) => {
        return checkedRowsIds.some((rowId) => rowId === item.id);
      });
      currentSelectedTalents.value = currentTalents;
      console.log('currentTalents', currentTalents);
    }
  },
  { deep: true, instant: true },
);

const handleCheck = (event) => {
  isTableCheckActive.value = event;
};

const updateCheckedRows = (updatedRows) => {
  checkedRowsIds.value = updatedRows;
};
watch(
  checkedRowsIds,
  (value) => {
    if (value && value.length) {
      checkedRows.value = talentsRows.value.filter((item) =>
        checkedRowsIds.value.some((rowId) => rowId === item.itemId),
      );
    } else {
      checkedRows.value = [];
    }
  },
  { deep: true, immediate: true },
);
import { useNuxtApp } from '#app';

const nuxtApp = useNuxtApp();

const removeFromTalentum = () => {
  AxiosService.delete(useRuntimeConfig().public.apiBaseV2 + `ambassadors`, {
    user_ids: checkedRowsIds.value,
  })
    .then(async () => {
      removeMultiTalentum.value = false;
      talentsStore.getTalentsAction(1, setParrams(tags.value), isTwitter.value ? 'twitter' : '');
      nuxtApp.$alert.show('Success', {
        type: 'success',
        timeout: 5000,
      });
    })
    .catch((e) => {
      nuxtApp.$alert.show(e.response.data.message, {
        type: 'error',
        timeout: 5000,
      });
    });
};

const removeFromProject = (item) => {
  AxiosService.delete(useRuntimeConfig().public.apiBaseV2 + `projects/${item.project.id}/kick`, {
    user_ids: checkedRowsIds.value,
  })
    .then(async () => {
      removeMultiProject.value = false;
      talentsStore.getTalentsAction(1, setParrams(tags.value), isTwitter.value ? 'twitter' : '');
      nuxtApp.$alert.show('Success', {
        type: 'success',
        timeout: 5000,
      });
    })
    .catch((e) => {
      nuxtApp.$alert.show(e.response.data.message, {
        type: 'error',
        timeout: 5000,
      });
    });
};
const removeFromProjectSoloFn = (item) => {
  AxiosService.delete(
    useRuntimeConfig().public.apiBaseV2 +
      `ambassadors/${item.talent.id}/invites/${item.project.id}`,
    {},
  )
    .then(async () => {
      removeProjectSolo.value = false;
      talentsStore.getTalentsAction(1, setParrams(tags.value), isTwitter.value ? 'twitter' : '');
      nuxtApp.$alert.show('Success', {
        type: 'success',
        timeout: 5000,
      });
    })
    .catch((e) => {
      nuxtApp.$alert.show(e.response.data.message, {
        type: 'error',
        timeout: 5000,
      });
    });
};
const inviteToProject = (item) => {
  AxiosService.post(useRuntimeConfig().public.apiBaseV2 + `projects/${item.project.id}/invites`, {
    user_ids: checkedRowsIds.value,
  })
    .then(async () => {
      talentsStore.getTalentsAction(1, setParrams(tags.value), isTwitter.value ? 'twitter' : '');
      inviteMultiProject.value = false;
      nuxtApp.$alert.show('Success', {
        type: 'success',
        timeout: 5000,
      });

      window.dataLayer.push({
        event: 'project_talent_invite',
      });
    })
    .catch((e) => {
      inviteMultiProject.value = false;
      nuxtApp.$alert.show(e.response.data.message, {
        type: 'error',
        timeout: 5000,
      });
    });
};

const inviteSolo = (info) => {
  AxiosService.post(useRuntimeConfig().public.apiBaseV2 + `projects/${info.project.id}/invites`, {
    user_ids: [info.talent.id],
  })
    .then(async () => {
      console.log(nuxtApp);
      console.log(nuxtApp.$alert);
      openSolo.value = false;
      talentsStore.getTalentsAction(1, setParrams(tags.value), isTwitter.value ? 'twitter' : '');
      nuxtApp.$alert.show('Success', {
        type: 'success',
        timeout: 5000,
      });

      window.dataLayer.push({
        event: 'project_talent_invite',
      });
    })
    .catch((e) => {
      nuxtApp.$alert.show(e.response.data.message, {
        type: 'error',
        timeout: 5000,
      });
    });
};
const removeFromTalentumSolo = (info) => {
  AxiosService.delete(useRuntimeConfig().public.apiBaseV2 + `ambassadors`, {
    user_ids: [info.talent.id],
  })
    .then(async () => {
      removeSolo.value = false;
      talentsStore.getTalentsAction(1, setParrams(tags.value), isTwitter.value ? 'twitter' : '');
      nuxtApp.$alert.show('Success', {
        type: 'success',
        timeout: 5000,
      });
    })
    .catch((e) => {
      nuxtApp.$alert.show(e.response.data.message, {
        type: 'error',
        timeout: 5000,
      });
    });
};
</script>

<style lang="scss" scoped>
.confirm-modal {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 32px;
  gap: 24px;
  &_title {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 24px;
    line-height: 40px;
    color: $section-title;
  }
  &_subtitle {
    font-family: 'Basis Grotesque Pro';
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
.clear-filtrers {
  width: 71px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    background: $default-badge-border;
  }
  span {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    font-feature-settings: 'zero' on;
    color: $secondary;
  }
}
.toggles_wrapper {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  width: 100%;
}
.filters {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 28px;
  gap: 8px;
}
.custom-project-select {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 25px;
  span {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    font-feature-settings: 'zero' on;
    color: $section-title;
  }
}
.filter-select {
  width: 160px;
  height: 32px;
}
.tags {
  display: flex;
  margin-bottom: 28px;
  gap: 8px;

  .tags-quantity {
    width: 125px;
  }

  .title {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 32px;
    hanging-punctuation: first last;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on, 'ordn' on, 'ss04' on;
    color: $default;
  }
}

.tags-block {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  padding-left: 16px;
  max-width: 1018px;
}
.tag {
  display: flex;
  align-items: center;
  background: $default-badge-border;
  border-radius: 8px;
  cursor: pointer;
  padding: 4px 8px;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  font-feature-settings: 'zero' on;
  color: $default;
  height: 32px;
  gap: 8px;

  &-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 24px;
    height: 24px;
    &:hover {
      cursor: pointer;
      background: $default-border;
      border-radius: 8px;
    }
  }
}

.remove-tag {
  cursor: pointer;
}
.controller-talents {
  display: flex;
  justify-content: center;
  position: fixed;
  bottom: 0px;
  transition-duration: 0.2s;
  left: 52.4%;
  transform: translateX(-50%);
  height: 72px;
  width: calc(120vw);
  z-index: 400;
  border: 1px solid $default-border;
  border-bottom: 0;
  background-color: $white;
  .controller-body {
    width: 70vw;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 10px;
    // &.open {
    //   padding-left: 80px;
    // }
    @media (max-width: 1463px) {
      width: 80%;
      padding-left: 80px;
      padding-right: 50px;
      &.open {
        padding-left: 180px;
      }
      // padding: 0 100px;
    }
  }
  .counts {
    color: $section-title;
    font-family: 'Basis Grotesque Pro';
    font-weight: 500;
    line-height: 24px;
    font-size: 16px;
  }
  .controllers {
    display: flex;
    align-items: center;
    gap: 12px;
    .remove {
      color: $red;
      font-size: 16px;
      font-family: 'Basis Grotesque Pro';
      font-weight: 500;
      line-height: 24px;
      display: flex;
      height: 40px;
      padding: 7px 12px;
      justify-content: center;
      align-items: center;
      gap: 8px;
      border-radius: 8px;
      background: $default-bg;
      &:hover {
        cursor: pointer;
      }
    }
    .invite {
      display: flex;
      height: 40px;
      padding: 7px 12px;
      justify-content: center;
      align-items: center;
      gap: 8px;
      border-radius: 8px;
      background: $orange;
      color: $white;
      font-size: 16px;
      font-family: 'Basis Grotesque Pro';
      font-weight: 500;
      line-height: 24px;
      &:hover {
        cursor: pointer;
        background: $orange-active;
      }
    }
  }

  &__scrolled {
    bottom: 72px;
    transition-duration: 0.2s;
  }
}
.line {
  align-self: stretch;
  height: 32px;
  border: 0.25px solid $default-border;
}
</style>

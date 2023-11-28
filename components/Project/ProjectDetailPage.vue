<template>
  <div class="project-detail" v-if="project && !projectLoading">
    <div
      :class="`relative h-[260px] w-[calc(100%+88px)] bg-banner -ml-12 -mt-12 z-0
          ${!project.banner && !uploadedBanner.url && 'bg-default-banner'}`"
      :style="{
        backgroundImage:
          (uploadedBanner.url && `url(${uploadedBanner.url}`) ||
          (project.banner && `url(${project.banner}`),
      }"
      @mouseover="bannerButtonVisible = true"
      @mouseleave="bannerButtonVisible = false"
    >
      <ProjectBanner
        v-show="bannerButtonVisible"
        uploader-class="edit-project-banner-uploader absolute right-3 bottom-1"
        @set-file="updateProjectBanner"
        :isPM="isProjectManager"
      />
    </div>
    <div class="h-[160px] -mt-20 flex justify-between z-20">
      <div class="flex items-end">
        <div
          class="h-full w-[160px] bg-white rounded-[15px] border-[#F5F5FD] z-10 flex items-center justify-center"
        >
          <ProjectAvatar
            :logo="project.logo"
            uploader-class="edit-project-avatar-uploader"
            @set-file="updateProjectAvatar"
            @remove-file="removeProjectAvatar"
            :isPM="isProjectManager"
          />
        </div>

        <input
          v-model="newProjectName"
          v-if="isProjectOwner || isSuperAdmin"
          class="text-[56px] font-semithin text-[#1A1D29] leading-18 ml-6 bg-transparent outline-none focus:bg-[#eaeafb] max-w-[550px]"
          type="text"
          @change="updateProject({ key: 'name', value: newProjectName })"
        />

        <h1 v-else class="text-[56px] font-semithin text-[#1A1D29] leading-18 ml-6">
          {{ reduceStringLength(project.name, 25) }}
        </h1>
      </div>
      <div class="relative flex items-end" v-if="roleName">
        <button
          class="bg-[#EAEAFB] py-[7px] px-[12px] rounded-lg h-8 flex items-center"
          v-if="!isSuperAdmin"
        >
          <span class="font-medium text-xs leading-4 text-[#38405B] h-4">{{ roleName }}</span>
          <TooltipIcon tooltipText="Your current role in the project" />
        </button>
        <div class="flex items-center">
          <div class="text-slate-700 text-[14px] font-medium leading-tight ml-6 mr-2">
            Public project
          </div>
          <Switch
            :is-disabled="!isSuperAdmin && !isProjectOwner"
            v-if="project"
            :checked-prop="project.public"
            @checked="updateProjectStatus"
          />
        </div>
        <div class="-mb-1" v-if="isSuperAdmin">
          <ProjectDelete :project="project" />
        </div>
      </div>
    </div>
    <div class="w-full mt-10 mb-10 flex">
      <Content
        class="min-w-[760px] h-fit"
        :project="project"
        :all-tags="allTagsData"
        :all-social-buttons="allSocialButtons"
        :social-buttons="socialButtons"
        :date-since="dateSince"
        @update="updateProject"
      />
      <div class="ml-10 flex flex-col min-w-[360px] w-360px">
        <RefLink
          v-if="isSuperAdmin || isProjectAdministrator || isProjectOwner"
          :code="code"
        ></RefLink>
        <Pool
          :project="project"
          :coins="allCoins"
          @update="updateProject"
          @updateCoinId="updateCoinId"
        />
        <Events :project="project" @remove="removeEvent" />
        <Gate :project="project"/>
        <QA :project="project" />
      </div>
    </div>
    <div class="mb-6">
      <div class="font-normal text-2xl mb-4 text-[#1A1D29] leading-10 flex items-center">
        <div v-if="projectMediumPosts && projectMediumPosts.length > 0">
          Last Articles on Medium
        </div>
        <div
          :class="{ 'focus-input': connectMedium }"
          class="min-w-[245px] relative ml-6 h-8 pl-2 pr-[12px] py-[4px] bg-white rounded-lg border border-violet-200 justify-start items-center gap-2 inline-flex"
        >
          <Icon name="Medium-Default" :size="24" />
          <div class="justify-start items-start gap-[10px] flex">
            <div
              v-if="!connectMedium && !newMediumUsername"
              class="cursor-pointer text-right text-slate-700 text-[14px] font-medium leading-tight"
              @click="setConnectMedium(true)"
            >
              Connect Medium
            </div>

            <div
              v-if="newMediumUsername && !focus && !connectMedium"
              class="cursor-pointer text-right text-slate-700 text-[14px] font-medium leading-tight"
              @click="setConnectMedium(true)"
            >
              {{ newMediumUsername }}
            </div>

            <div v-if="connectMedium" class="flex gap-[5px] max-w-[263px] items-center">
              <input
                @change="updateMediumUsername"
                v-model="newMediumUsername"
                class="text-slate-700 w-[225px] text-[14px] font-medium leading-tight outline-none bg-white"
                type="text"
                placeholder="https://"
                @blur="
                  setFocus(false);
                  setConnectMedium(false);
                "
                @focus="setFocus(true)"
              />
              <template v-if="newMediumUsername">
                <Icon
                  v-if="isValidProfileUrl(newMediumUsername)"
                  class="cursor-pointer"
                  name="Tick"
                  size="15"
                />
                <Icon v-else class="cursor-pointer" name="Tik" size="15" />
              </template>
            </div>
          </div>
        </div>
      </div>
      <div v-if="projectMediumPosts && projectMediumPosts.length > 0" class="mt-4 flex flex-wrap">
        <ArticleItem
          class="mr-4 mb-4 last-article-item"
          v-for="post in projectMediumPosts.slice(0, 3)"
          :post="post"
        />
      </div>
    </div>
    <template v-if="isSuperAdmin">
      <div class="my-10 h-[1px] bg-[#DAD9F7]" />
      <div class="overview">
        <div class="section-custom-title">
          <CustomTitle :loading="projectLoading && !project" text="Project Overview" />
        </div>
        <div v-if="projectLoading || !project" class="mt-7">
          <StatCardSkeleton size="large" v-for="i in 8" :key="i" />
        </div>
        <div v-else class="flex mt-7">
          <StatCardBig
            wide
            v-for="(statCard, i) in projectOverviewArray"
            :="statCard"
            :key="statCard.title"
            :style="{
              marginRight: i + 1 === projectOverviewArray.length ? '0' : '16px',
            }"
          ></StatCardBig>
        </div>
      </div>
      <ProjectTable />
    </template>
  </div>
  <ProjectDetailSkeleton v-if="projectLoading" />
  <InaccessibleLinkModal
    v-if="showErrorModal"
    title="Project Unavailable"
    text="The project you are trying to access is no longer available. It may have been made private or deleted. For further assistance, contact your project manager or administrator."
    link="/"
    button="Go to the Homepage"
  ></InaccessibleLinkModal>
</template>

<script setup>
import { computed, ref, provide } from 'vue';
import { useCoinsStore, useProjectsStore, useUserStore, useGateStore } from '@/store';
import {
  Content,
  Events,
  Pool,
  ProjectAvatar,
  ProjectBanner,
  ArticleItem,
  Switch,
  ProjectTable,
} from '@/components/';

import { formatDateMonthNameAndDay, reduceStringLength } from '~/util/helpers';
import Icon from '~/components/Icon.vue';
import AxiosService from '~/service/axiosService';
import { useNuxtApp } from '#app';

const nuxtApp = useNuxtApp();
const showErrorModal = ref(false);
const userStore = useUserStore();
const route = useRoute();
const router = useRouter();
const projectsStore = useProjectsStore();
const coinsStore = useCoinsStore();
const gateStore = useGateStore()
const props = defineProps({
  projectId: {
    type: String,
    default: null,
  },
});
function isValidProfileUrl(url) {
  const defaultProfilePattern = /^https:\/\/medium\.com\/@(.+)$/;
  const subdomainProfilePattern = /^https:\/\/([^\.]+)\.medium\.com$/;
  const customDomainProfilePattern = /^https:\/\/([^\/]+)\.com$/;
  const blogCustomDomainPattern = /^https:\/\/blog\.([^\/]+)\.com$/;
  const defaultProfileWidthoutSymbolPattern = /^https:\/\/medium\.com\/(.+)$/;

  return (
    defaultProfilePattern.test(url) ||
    defaultProfileWidthoutSymbolPattern.test(url) ||
    subdomainProfilePattern.test(url) ||
    customDomainProfilePattern.test(url) ||
    blogCustomDomainPattern.test(url)
  );
}
function extractUsernameFromProfileUrl(url) {
  const defaultProfilePattern = /^https:\/\/medium\.com\/@(.+)$/;
  const defaultProfileWidthoutSymbolPattern = /^https:\/\/medium\.com\/(.+)$/;
  const subdomainProfilePattern = /^https:\/\/([^\.]+)\.medium\.com$/;
  const customDomainProfilePattern = /^https:\/\/([^\/]+)\.com$/;
  const blogCustomDomainPattern = /^https:\/\/blog\.([^\/]+)\.com$/;

  const defaultMatch = url.match(defaultProfilePattern);
  const subdomainMatch = url.match(subdomainProfilePattern);
  const customDomainMatch = url.match(customDomainProfilePattern);
  const blogCustomDomainMatch = url.match(blogCustomDomainPattern);
  const defaultMatchSymbol = url.match(defaultProfileWidthoutSymbolPattern);

  if (defaultMatch) {
    return '@' + defaultMatch[1];
  } else if (subdomainMatch) {
    return '@' + subdomainMatch[1];
  } else if (customDomainMatch) {
    return '@' + customDomainMatch[1];
  } else if (blogCustomDomainMatch) {
    return '@' + blogCustomDomainMatch[1];
  } else if (defaultMatchSymbol) {
    return '@' + defaultMatchSymbol[1];
  } else {
    return null;
  }
}
const roles = inject('roles');
const {
  isProjectAdministrator,
  isSuperAdmin,
  isProjectManager,
  isProjectOwner,
  isCatapultManager,
} = roles;
const connectSubreddit = ref(false);
const newSubreddit = ref(null);
const connectMedium = ref(false);
const removeAvatar = ref(false);
const newMediumUsername = ref(null);
const newProjectName = ref(null);
const updateProjectTimeout = ref(null);
const focus = ref(false);
const uploadedBanner = ref({
  url: null,
  file: null,
});
const uploadedAvatar = ref({
  url: null,
  file: null,
});
const bannerButtonVisible = ref(false);
const setConnectSubreddit = (value) => {
  if (isSuperAdmin.value || isProjectOwner.value) {
    connectSubreddit.value = value;
  }
};
const setConnectMedium = (value) => {
  if (isSuperAdmin.value || isProjectOwner.value) {
    connectMedium.value = value;
  }
};
const setFocus = (value) => {
  if (isSuperAdmin.value || isProjectOwner.value) {
    focus.value = value;
  }
};

onMounted(() => {
  newSubreddit.value = null;
  newMediumUsername.value = null;
  const isTG = window.location.href.match(/[#\?\&]tgAuthResult=([A-Za-z0-9\-_=]*)$/);
  if (localStorage.social && route.query && !isTG) {
    const query = Object.entries(route.query)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    AxiosService.get(
      useRuntimeConfig().public.apiBase +
        `projects/auth/${localStorage.social}/callback/?${query}&project_id=${props.projectId}`,
    )
      .then(async () => {
        localStorage.social = '';
        await projectsStore.getProjectAction(props.projectId);
        nuxtApp.$alert.show('Success', {
          type: 'success',
          timeout: 5000,
        });
        await router.push(`/projects/${props.projectId}`);
      })
      .catch((e) => {
        nuxtApp.$alert.show(e.response.data.message, {
          type: 'error',
          timeout: 5000,
        });
        localStorage.social = '';
      });
  } else if (localStorage.social && isTG) {
    AxiosService.get(
      useRuntimeConfig().public.apiBase +
        `projects/auth/${localStorage.social}/callback/?tgAuthResult=${isTG[1]}&project_id=${props.projectId}`,
    )
      .then(async () => {
        console.log('CALLBACK THEN CALLED');
        nuxtApp.$alert.show('Success', {
          type: 'success',
          timeout: 5000,
        });
        localStorage.social = '';
        await userStore.userInfo();
      })
      .catch((e) => {
        nuxtApp.$alert.show(e.response.data.message, {
          type: 'error',
          timeout: 5000,
        });
        localStorage.social = '';
      })
      .finally(() => {
        localStorage.social = '';
      });
  }

  projectsStore.getProjectAction(props.projectId).catch(() => (showErrorModal.value = true));
  projectsStore.getProjectCode(props.projectId);
  projectsStore.getSocialLinksAction({ assigned_to: 'project' });
  projectsStore.getTagsAction();
  coinsStore.getCoinsAction();
  gateStore.getGateAction(props.projectId)
});
const projectID = computed(() => userStore.getUserProjectId);
const code = computed(() => projectsStore.getCode);
const allTagsData = computed(() => projectsStore.getTags);
const projectLoading = computed(() => projectsStore.getProjectLoading);
const projectData = computed(() => projectsStore.getProject);
const projectMediumPosts = computed(() => projectsStore.getProjectMediumPosts);
const project = ref(projectData);
const dateSince = computed(() => formatDateMonthNameAndDay(project.value.created_at, true));
const socialButtons = computed(() =>
  project.value.social_links?.map((link) => ({
    id_link: link.id,
    value: link.content,
    id: link.social_link.id,
    icon: link.social_link.name + '-Default',
    status: link.social_link.name,
    name: link.social_link.name,
  })),
);
const allCoins = computed(() => coinsStore.getCoins);
const allSocialButtons = computed(() =>
  projectsStore.getSocialLinks.map((link) => ({
    id: link.id,
    value: link.content,
    name: link.name,
    fn: () => connectSocial(link.name),
    rm: () => null,
  })),
);
const roleName = computed(() => {
  return (
    (isSuperAdmin.value && 'Super Admin') ||
    (isProjectAdministrator.value && 'Project Administrator') ||
    (isProjectManager.value && 'Project Manager') ||
    (isProjectOwner.value && 'Project Owner') ||
    null
  );
});

const projectOverviewArray = computed(() => [
  {
    value: project.value.tasks?.length,
    title: 'created tasks',
    isActive: false,
    isTimeActive: false,
  },
  {
    value: project.value.reviewed_tasks,
    title: 'reviewed tasks',
    isActive: false,
    isTimeActive: false,
  },
  {
    value: project.value.overdue_tasks,
    title: 'overdue tasks',
    isActive: false,
    isTimeActive: false,
  },
  {
    value: project.value.members_count,
    title: 'joined talents',
    isActive: false,
    isTimeActive: false,
  },
  {
    value: project.value.active_members_count,
    title: 'active talents',
    isActive: false,
    isTimeActive: false,
    icon: 'Project',
  },
  {
    value: project.value.totalPayout,
    title: 'USDT paid',
    isActive: true,
    isTimeActive: false,
    icon: 'empty',
  },
]);

provide('project', project);

const connectSocial = (socialName) => {
  let social = socialName.toLowerCase();
  let url = `auth/${social}/redirect?uri=/projects/${project.value.id}&project_id=${project.value.id}`;
  localStorage.social = social;
  AxiosService.get(useRuntimeConfig().public.apiBase + url)
    .then((response) => {
      window.location.href = response.data.redirect_url;
    })
    .catch((e) => console.log(e));
};

const sendUpdateProject = async () => {
  let projectData = project.value;
  let data = {
    public: projectData.public,
    name: projectData.name,
    description: projectData.description ? projectData.description : '',
    pool_amount: projectData.pool_amount,
    pool_visible: projectData.pool_visible,
    medium_username: projectData.medium_username,
    coin_type_id: projectData.coin_type.id,
    blockchain_id: projectData.blockchain.id,
    social_links: projectData.social_links.map((l) => ({
      id: l.id,
      content: l.content,
      social_link_id: l.social_link.id,
    })),
    tags: projectData.tags.map((t) => ({ id: t.id, tag_id: t.tag.id })),
  };

  if (uploadedAvatar.value.file) {
    data.logo = uploadedAvatar.value.file;
  }
  if (uploadedBanner.value.file) {
    data.banner = uploadedBanner.value.file;
  }

  if (removeAvatar.value) {
    data.logoClear = removeAvatar.value;
  }

  let res = await projectsStore.updateProjectAction({
    id: projectData.id,
    data: data,
  });

  if (res && res.response?.data?.errors) {
    const messages = [].concat(...Object.values(res.response.data.errors));

    nuxtApp.$alert.show(
      messages
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
const updateCoinId = (data) => {
  project.value.coin_type = data.value;
  clearTimeout(updateProjectTimeout.value);
  updateProjectTimeout.value = setTimeout(() => sendUpdateProject(), 500);
};
const updateProject = (data) => {
  let key = data.key;
  project.value[key] = data.value;
  clearTimeout(updateProjectTimeout.value);
  updateProjectTimeout.value = setTimeout(() => sendUpdateProject(), 500);
};
const updateProjectBanner = (data) => {
  uploadedBanner.value.url = data.url.value;
  uploadedBanner.value.file = data.data.value;
  updateProject({ key: 'banner', value: data.data.value });
};
const updateProjectAvatar = (data) => {
  removeAvatar.value = false;
  uploadedAvatar.value.url = data.url;
  uploadedAvatar.value.file = data.data;
  updateProject({ key: 'logo', value: data.data });
};
const updateVisible = (data) => {
  updateProject({ key: 'pool_visible', value: data });
};
const removeProjectAvatar = () => {
  removeAvatar.value = true;
  uploadedAvatar.value.url = null;
  uploadedAvatar.value.file = null;
  project.value.logo = null;
  sendUpdateProject();
};
const removeEvent = (event) => {
  project.value.events = project.value.events.filter((e) => e.id !== event.id);
};

const updateMediumUsername = async () => {
  if (!newMediumUsername.value) {
    updateProject({ key: 'medium_username', value: null });
  }
  if (isValidProfileUrl(newMediumUsername.value)) {
    await updateProject({
      key: 'medium_username',
      value: extractUsernameFromProfileUrl(newMediumUsername.value),
    });
    await projectsStore.getProjectMediumPostsAction(projectID.value);
  }
};
const updateProjectStatus = (event) => {
  updateProject({
    key: 'public',
    value: event,
  });
};

watch(
  project,
  (value) => {
    if (!value) return;
    let { medium_username, name } = value;
    newProjectName.value = name;
    if (medium_username && medium_username !== 'null') {
      newMediumUsername.value = medium_username;
      if (
        (isProjectAdministrator.value && projectID.value && !isCatapultManager.value) ||
        (isProjectManager.value && projectID.value && !isCatapultManager.value) ||
        (isProjectOwner.value && projectID.value)
      ) {
        projectsStore.getProjectMediumPostsAction(projectID.value);
      } else {
        projectsStore.getProjectMediumPostsAction(route.params.id);
      }
    }
  },
  { deep: true, immediate: true },
);
</script>

<style scoped lang="scss">
.project-detail {
  font-family: 'Basis Grotesque Pro', serif;
  font-style: normal;
  font-weight: 400;
  //line-height: 40px;
  color: $section-title;
  .font-semithin {
    font-weight: 350;
  }

  .last-article-item {
    &:nth-child(3n) {
      margin-right: 0 !important;
    }
  }

  .bg-banner {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }

  .bg-default-banner {
    background: url('@/assets/images/def-cover-project.svg') no-repeat center;
  }
}
.focus-input {
  box-shadow: 0 0 0 2px $default-border;
}
</style>

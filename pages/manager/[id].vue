<template>
  <div class="profile" v-if="manager && !loadingManager && checkAccess">
    <Banner :banner="manager.banner"></Banner>
    <div class="naming w-full">
      <Avatar :avatar="manager.avatar"></Avatar>
      <div class="info">
        <Name :placeholder="reduceStringLength(manager.name, 18)"></Name>
        <!--        <InviteToProject v-if="isProjectOwner"></InviteToProject>-->
        <InviteTalentumManager
          v-if="isSuperAdmin && manager.talentum_manager"
        ></InviteTalentumManager>
      </div>
    </div>
    <div class="info-block">
      <div class="content">
        <div class="stats">
          <StatCardSmall
            v-for="i in cards"
            :title="i.title"
            :value="i.value"
            profile
            @click="navigateToElement(i.title)"
          ></StatCardSmall>
        </div>
        <div class="participant-title">Participating in the Projects</div>
        <EmptyProjectBlock
          v-if="manager.project_members && !manager.project_members.length"
        ></EmptyProjectBlock>

        <div class="warning" v-if="manager.talentum_manager">
          <icon icon="TM" :size="24" />This is Talentum Manager with defined roles in several
          projects.
        </div>
        <div
          v-if="
            (isSuperAdmin || isProjectOwner || isCatapultManager) &&
            manager.project_members.length > 1
          "
          class="projects-container"
        >
          <ProjectsOfManager
            v-for="project in manager.project_members"
            :protocol="project.project ? project.project.name : ''"
            :bg="project.project ? project.project.banner : ''"
            :logo="project.project ? project.project.logo : ''"
            :role="project.role"
            :created_tasks="project.project ? project.project.created_tasks.toString() : '0'"
            :overdue_tasks="project.project ? project.project.overdue_tasks.toString() : '0'"
            :reviewed_tasks="project.project ? project.project.reviewed_tasks.toString() : '0'"
            :id="project.project ? project.project.id : ''"
            :project="project"
            :notMy="
              (isProjectOwner && project.project.id === myProjectID) ||
              isSuperAdmin ||
              isCatapultManager
            "
          />
        </div>
        <div
          v-else-if="
            (isSuperAdmin || isProjectOwner || isCatapultManager) &&
            manager.project_members.length === 1
          "
          class="projects-container"
        >
          <ProjectsOfManager
            v-for="project in manager.project_members"
            :protocol="project.project ? project.project.name : ''"
            :bg="project.project?.banner"
            :logo="project.project?.logo"
            :role="project.role"
            :tags="project.project?.role"
            :description="project.project?.description"
            :id="project.project?.id"
            :project="project"
            :notMy="!isCatapultManager"
          />
        </div>
        <div v-else class="projects-container">
          <ProjectsOfManager
            v-for="project in manager.project_members"
            :protocol="project.project ? project.project.name : ''"
            :bg="project.project?.banner"
            :logo="project.project?.logo"
            :role="project.role"
            :tags="project.project?.role"
            :description="project.project?.description"
            :id="project.project?.id"
            :project="project"
            :notMy="
              manager.id !== userID &&
              project.role.name !== 'Project Owner' &&
              isProjectAdministrator
            "
          />
        </div>
      </div>
      <div class="sidebar">
        <div class="personal-info">
          <div class="section">
            <span class="title">Country</span>
            <Badge :text="manager.country" big type="transparent"></Badge>
          </div>
          <div class="section">
            <span class="title">Languages</span>
            <div class="flex gap-1.5">
              <Badge
                v-for="lang in manager.languages"
                big
                :text="lang.language.name"
                :key="lang.id"
                type="transparent"
              ></Badge>
            </div>
          </div>
          <div class="section">
            <span class="title">Contacts</span>
            <div class="tags">
              <Badge v-for="i in socialButtons" :icon="i.icon" :text="i.value" big :key="i"></Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useProjectsStore } from '~/store/projects';
import { useDashboardStore } from '~/store/dashboard';
import { useManagersStore } from '~/store/managers';
import { useAssetsStore } from '~/store/assets';
import { reduceStringLength } from '@/util/helpers';
import { useUserStore } from '~/store/user';

import { computed, inject, onMounted } from 'vue';
import { useRoute } from 'vue-router';
const projectsStore = useProjectsStore();
const managerStore = useManagersStore();
const assetsStore = useAssetsStore();
const userID = computed(() => useUserStore().getUser.id);
const manager = computed(() => managerStore.getManager);
const myProjectID = computed(() => useUserStore().getUserProjectId);
const route = useRoute();

const checkAccess = computed(
  () => {
    let isAvaivable;
    console.log(manager.value);

    isAvaivable = manager.value.project_members;
    manager.value.project_members.find((i) => i.project && i.project.id === myProjectID.value) ||
      (manager.value.talentum_manager && isSuperAdmin.value);
    if (!isAvaivable && !isSuperAdmin.value) {
      router.go(-1);
      return;
    } else return !!(isAvaivable || isSuperAdmin.value);
  },
  { dependsOn: [manager] },
);

const router = useRouter();

const projects = computed(() => projectsStore.getProjects);
onMounted(async () => {
  await projectsStore.getProjectsAction();
  await useDashboardStore().getDashboardOverviewAction();
  await assetsStore.getRolesAction();
  await managerStore.getManagerByIdAction(route.params.id);
  await managerStore.getManagerProjectsByIdAction(route.params.id);
});
const roles = inject('roles');
const loadingManager = computed(() => managerStore.isManagerLoading);
const { isProjectOwner, isSuperAdmin, isCatapultManager, isProjectAdministrator } = roles;

let cards = computed(() => [
  {
    value: manager.value?.created_tasks,
    title: 'created tasks',
  },
  {
    value: manager.value?.reviewed_tasks,
    title: 'reviewed tasks',
  },
  {
    value: manager.value?.overdue_by_manager_tasks + manager.value?.overdue_by_talent_tasks,
    title: 'overdue tasks',
  },
]);

const navigateToElement = (title) => {
  if (title === 'created tasks') {
    router.push({
      path: '/tasks',
    });
  } else if (title === 'reviewed tasks') {
    router.push({
      path: '/tasks',
      query: { status: 'done' },
    });
  } else if (title === 'overdue tasks' || title === 'overdue') {
    router.push({
      path: '/tasks',
      query: { status: 'overdue_by_manager' },
    });
  }
};
const getSocialName = (social) => {
  return manager.value?.social_providers.find((i) => i.provider_name.toLowerCase() === social);
};
const socialButtons = computed(() =>
  [
    {
      id: 2,
      icon: 'Email-Default',
      status: true,
      name: 'google',
      value: manager.value?.email,
    },
    {
      id: 3,
      icon: 'Twitter-Default',
      status: getSocialName('twitter'),
      name: 'twitter',
      value: getSocialName('twitter')?.name,
    },
    {
      id: 4,
      icon: 'Discord-Default',
      status: getSocialName('discord'),
      name: 'discord',
      value: getSocialName('discord')?.name,
    },
    {
      id: 5,
      icon: 'Telegram-Default',
      status: getSocialName('telegram'),
      name: 'telegram',
      value: getSocialName('telegram')?.name,
    },
  ].filter((i) => i.status),
);
</script>

<style scoped lang="scss">
.profile {
  display: flex;
  flex-direction: column;
  .naming {
    margin-top: 140px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    .info {
      margin-left: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
  }
  .info-block {
    display: flex;
    justify-content: space-between;
    margin-top: 40px;
    margin-bottom: 80px;
    gap: 40px;
    .sidebar {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-bottom: 40px;
      .personal-info {
        background: $white;
        border: 1px solid $default-border;
        border-radius: 16px;
        display: flex;
        flex-direction: column;
        gap: 24px;
        padding: 24px;
        .section {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          gap: 16px;
          .select {
            width: 224px;
          }
          .tags {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
          }
          .title {
            font-family: 'Basis Grotesque Pro';
            font-style: normal;
            font-weight: 500;
            font-size: 18px;
            line-height: 24px;
            font-feature-settings: 'zero' on;
            color: $secondary;
          }
        }
      }
    }
    .content {
      display: flex;
      flex-direction: column;
      max-width: 560px;
      width: 100%;
      gap: 24px;
      .stats {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
      }
      .participant-title {
        font-family: 'Basis Grotesque Pro';
        font-style: normal;
        font-weight: 400;
        font-size: 24px;
        line-height: 40px;
        color: $section-title;
        margin-bottom: 8px;
      }
      .warning {
        background: $white;
        border: 1px solid $rounded-bg;
        border-radius: 8px;
        padding: 8px 16px;
        display: flex;
        gap: 16px;
        font-family: 'Basis Grotesque Pro';
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
        align-items: center;
        font-feature-settings: 'zero' on;
        color: $orange;
      }
    }
  }
}
.icon {
  filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(349deg) brightness(107%) contrast(180%);
}

.projects-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>

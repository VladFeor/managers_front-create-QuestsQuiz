<template>
  <div class="profile" v-if="talent && isMounted && !loadindTalent">
    <Banner :banner="talent.banner"></Banner>
    <div class="naming w-full">
      <Avatar :rating="talent.average_point" :avatar="talent.avatar"></Avatar>
      <div class="info">
        <Name :placeholder="reduceStringLength(talent.name, 22)"></Name>
        <InviteToProjectTalent></InviteToProjectTalent>
      </div>
    </div>
    <div class="info-block">
      <div class="content">
        <div class="bio">
          <div class="header">
            <Badge big :text="talent.country" v-if="talent.country" type="transparent"></Badge>
            <div class="langs" v-if="talent.languages && talent.languages.length > 0">
              Languages:
              <Badge
                big
                v-for="i in talent.languages"
                :key="i"
                :text="i.language?.name"
                type="transparent"
              ></Badge>
            </div>
          </div>
          <div v-html="talent.bio" class="html"></div>
          <div class="timing">On Talentum since {{ dateTransformer(talent.registered_at) }}</div>
          <div class="socials cursor-pointer">
            <Badge
              v-for="i in socialButtons"
              big
              :key="i.id"
              :text="i.value"
              :icon="i.icon"
              @click="i.fn()"
            ></Badge>
          </div>
        </div>
        <Directions></Directions>
      </div>
      <div class="sidebar">
        <LevelCard :info="talent"></LevelCard>
        <CurrentBalance :balance="talent.total_balance"></CurrentBalance>
        <NFTRewards></NFTRewards>
        <RoleReward :rewards="rewards"></RoleReward>
      </div>
    </div>
    <hr />
    <div class="tasks">
      <div class="title">Tasks</div>
      <FilterToggle
        :buttons="stats"
        :id="0"
        @select="selectStatus($event)"
        review
        style="width: 734px"
      />
      <TableSkeleton v-if="tasksLoading" />

      <BaseTable
        v-else
        :columns="tasksColumns"
        :rows="allTasks"
        pointer
        title="So far, no task has been sent for review"
        icon="icons8-futurama-bender"
        :sortFunction="sortTasks"
        :sortDirection="sortDirection"
        :setSortDirection="setSortDirection"
        :setSortColumn="setSortColumn"
        :sortColumn="sortColumn"
        isSorting
      />

      <Pagination
        @pageChanged="nextPage($event)"
        v-if="!tasksLoading"
        :currentPage="tasks.pagination.current_page"
        :totalPages="tasks.pagination.total_pages"
      />
    </div>
  </div>
</template>
<script setup>
import { useRoute } from 'vue-router';
import { computed, inject, onMounted, ref } from 'vue';
import { useTalentsStore } from '~/store/talents';
import Badge from '@/components/Badge.vue';
import Tokens from '@/components/Tokens.vue';
import Priority from '@/components/Priority/Priority.vue';
import Talent from '@/components/Talent.vue';
import defaultBg from '@/assets/images/default-avatar.png';
import { reduceStringLength, timestampToString } from '@/util/helpers';
import { makeShortenWalletAddress, shortenAddress } from '@/util/web3';

const talentsStore = useTalentsStore();
let isMounted = false;

onMounted(() => {
  talentsStore.getTalentByIdAction(useRoute().params.id);
  talentsStore.getTalentProjectsAction(useRoute().params.id);
  talentsStore.getTalentTasksAction(useRoute().params.id, 'in_progress');
  isMounted = true;
});

const labels = computed(() => talentsStore.getTaskLabels);
const tasks = computed(() => talentsStore.getTasks);
const loadindTalent = computed(() => talentsStore.talentIsLoading);
const nextPage = (page) => {
  talentsStore.getTalentTasksAction(talent.value.id, activeStatus.value, page);
};
const activeStatus = ref('in_progress');
const selectStatus = (e) => {
  activeStatus.value = e.status.toLowerCase().replace(' ', '_');
  talentsStore.getTalentTasksAction(talent.value.id, activeStatus.value);
};
const sort = ref();

const sortDirection = ref('');
const sortColumn = ref('');
const sortHandle = (name, type) => {
  const params = {};
  if (type && name) {
    let formatName = name;
    if (
      name === 'deadline' ||
      name === 'deadline_in' ||
      name === 'rejected' ||
      name === 'completed' ||
      name === 'deadlineOver'
    ) {
      formatName = 'deadline';
    }
    params.sortKey = formatName;
    params.sortType = type;
  }
  sort.value = params;
};

const setSortDirection = (value) => {
  sortDirection.value = value;
};
const setParrams = (data) => {
  const params = {};
  if (sort.value) {
    params['sort[key]'] = sort.value.sortKey;
    params['sort[type]'] = sort.value.sortType;
  }
  return params;
};
watch(
  sort,
  (newValue) => {
    if (newValue && newValue.sortKey && newValue.sortType) {
      talentsStore.getTalentTasksAction(talent.value.id, activeStatus.value, 1, setParrams());
    }
  },
  { deep: true },
);
const setSortColumn = (value) => {
  sortColumn.value = value;
};
const stats = computed(() => [
  {
    title: `Tasks In Work ${labels.value ? labels.value.in_progress : 0}`,
    id: 0,
    name: 'In Progress',
    value: 'in_progress',
  },
  {
    title: `Pending ${labels.value ? labels.value.pending : 0}`,
    id: 1,
    name: 'waiting_for_review',
    value: 'pending',
  },
  {
    title: `On Revision ${labels.value ? labels.value.on_revision : 0}`,
    id: 2,
    name: 'On Revision',
    value: 'on_revision',
  },
  {
    title: `Completed ${labels.value ? labels.value.completed : 0}`,
    id: 3,
    name: 'Done',
    value: 'completed',
  },
  {
    title: `Rejected ${labels.value ? labels.value.rejected : 0}`,
    id: 4,
    name: 'Rejected',
    value: 'rejected',
  },
  {
    title: `Overdue ${labels.value ? labels.value.overdue : 0}`,
    id: 5,
    name: 'Overdue',
    value: 'overdue',
  },
]);

const talent = computed(() => talentsStore.getTalentById);
const rewards = computed(() => talentsStore.getTalentRewardsById);
const getSocialName = (social) => {
  return talent.value?.social_providers.find((i) => i.provider_name.toLowerCase() === social);
};
const getProperty = (obj, prop) => {
  const props = prop.split('.');
  const regex = /\[(\d+)\]/;
  return props.reduce((prev, curr) => {
    const matches = regex.exec(curr);
    if (matches) {
      const index = parseInt(matches[1]);
      const arrProp = curr.slice(0, matches.index);
      return prev[arrProp][index];
    } else {
      return prev && prev[curr];
    }
  }, obj);
};

const sortTasks = (prop, direction) => {
  if (!isMounted) return;
  sortHandle(prop, direction);
};

const socialButtons = computed(() =>
  [
    {
      id: 2,
      icon: getSocialName('google') ? 'Google' : 'Email-Default',
      status: getSocialName('google') || talent.value.email,
      name: 'google',
      value: getSocialName('google') ? getSocialName('google').name : talent.value.email,
      fn: () => copy(getSocialName('google') ? getSocialName('google').name : talent.value.email),
    },
    {
      id: 3,
      icon: 'Twitter-Default',
      status: getSocialName('twitter'),
      name: 'twitter',
      value: getSocialName('twitter')?.name,
      fn: () => redirect(`https://twitter.com/${getSocialName('twitter')?.name}`),
    },
    {
      id: 4,
      icon: 'Discord-Default',
      status: getSocialName('discord'),
      name: 'discord',
      value: getSocialName('discord')?.name,
      fn: () => redirect(`https://discord.com/users/${getSocialName('discord')?.provider_id}`),
    },
    {
      id: 5,
      icon: 'Telegram-Default',
      status: getSocialName('telegram'),
      name: 'telegram',
      value: getSocialName('telegram')?.name,
      fn: () => redirect(`https://t.me/${getSocialName('telegram')?.name}`),
    },
    {
      id: 7,
      icon: 'Reddit-Default',
      status: getSocialName('reddit'),
      name: 'telegram',
      value: getSocialName('reddit')?.name,
      fn: () => redirect(`https://www.reddit.com/user/${getSocialName('reddit')?.name}`),
    },
    {
      id: 6,
      icon: 'Wallet-Default',
      status: talent.value.wallet,
      name: 'wallet',
      value: talent.value.wallet ? makeShortenWalletAddress(talent.value.wallet) : '',
      fn: () => copy(talent.value?.wallet),
    },
  ].filter((i) => i.status),
);

const wallet = computed(() => {
  return talent.value?.wallet.substr(-42, 5) + '...' + talent.value.wallet.substr(-4, 4);
});
const nuxtApp = useNuxtApp();

const roles = inject('roles');
const tasksLoading = computed(() => talentsStore.getTasksLoading);
const redirect = (link) => {
  window.open(link, '_blank');
};
const copy = (value) => {
  if (window.isSecureContext && navigator.clipboard) {
    navigator.clipboard.writeText(value);
    nuxtApp.$alert.show('Email successfully copied to clipboard!', {
      type: 'success',
      timeout: 5000,
    });
  } else {
    unsecuredCopyToClipboard(value);
  }
};

const unsecuredCopyToClipboard = (link) => {
  const textArea = document.createElement('textarea');
  textArea.value = link;
  document.body.appendChild(textArea);
  textArea.classList.add('copy-container');
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    nuxtApp.$alert.show('Email successfully copied to clipboard!', {
      type: 'success',
      timeout: 5000,
    });
  } catch (err) {
    console.error('Unable to copy to clipboard', err);
  }
  document.body.removeChild(textArea);
};

const {
  isProjectOwner,
  isSuperAdmin,
  isProjectManager,
  isCatapultManager,
  isProjectAdministrator,
} = roles;
const dateTransformer = (date) => {
  let newDate = new Date(date);
  let options = { year: 'numeric', month: 'long', day: 'numeric' };

  return newDate.toLocaleDateString('en-US', options);
};

const tasksColumns = computed(() => {
  if (activeStatus.value === 'in_progress') {
    return [
      { prop: 'task', label: 'Task', width: '150%' },
      { prop: 'rewards', label: 'Rewards', width: '70%' },
      { prop: 'project', label: 'Project', width: '70%' },
      { prop: 'direction', label: 'Direction', width: '50%' },
      {
        prop: 'deadline_in',
        label: 'Deadline In',
        width: '50%',
      },
      { prop: 'priority', label: 'Priority', width: '10%' },
    ];
  } else if (activeStatus.value === 'waiting_for_review' && isSuperAdmin.value) {
    return [
      { prop: 'task', label: 'Task', width: '150%' },
      { prop: 'rewards', label: 'Rewards', width: '70%' },
      { prop: 'project', label: 'Project', width: '70%' },
      { prop: 'direction', label: 'Direction', width: '50%' },
      {
        prop: 'deadline_in',
        label: 'Deadline In',
        width: '50%',
      },
      { prop: 'priority', label: 'Priority', width: '10%' },
    ];
  } else if (activeStatus.value === 'waiting_for_review') {
    return [
      { prop: 'task', label: 'Task', width: '150%' },
      { prop: 'rewards', label: 'Rewards', width: '70%' },
      { prop: 'direction', label: 'Direction', width: '50%' },
      {
        prop: 'deadline_in',
        label: 'Deadline In',
        width: '50%',
      },
      { prop: 'priority', label: 'Priority', width: '10%' },
    ];
  } else if (activeStatus.value === 'on_revision' && isSuperAdmin.value) {
    return [
      { prop: 'task', label: 'Task', width: '150%' },
      { prop: 'rewards', label: 'Rewards', width: '70%' },
      { prop: 'project', label: 'Project', width: '70%' },
      { prop: 'manager', label: 'Manager  ', width: '70%' },
      { prop: 'direction', label: 'Direction', width: '50%' },
      {
        prop: 'deadline_in',
        label: 'Deadline In',
        width: '50%',
      },
      { prop: 'priority', label: 'Priority', width: '10%' },
    ];
  } else if (activeStatus.value === 'on_revision' && isSuperAdmin.value) {
    return [
      { prop: 'task', label: 'Task', width: '150%' },
      { prop: 'rewards', label: 'Rewards', width: '70%' },
      { prop: 'project', label: 'Project', width: '70%' },
      { prop: 'manager', label: 'Manager  ', width: '70%' },
      { prop: 'direction', label: 'Direction', width: '50%' },
      {
        prop: 'deadline_in',
        label: 'Deadline In',
        width: '50%',
      },
      { prop: 'priority', label: 'Priority', width: '10%' },
    ];
  } else if (activeStatus.value === 'on_revision' && isProjectOwner.value) {
    return [
      { prop: 'task', label: 'Task', width: '150%' },
      { prop: 'rewards', label: 'Rewards', width: '70%' },
      { prop: 'manager', label: 'Manager  ', width: '70%' },
      { prop: 'direction', label: 'Direction', width: '50%' },
      {
        prop: 'deadline_in',
        label: 'Deadline In',
        width: '50%',
      },
      { prop: 'priority', label: 'Priority', width: '10%' },
    ];
  } else if (activeStatus.value === 'on_revision' && isCatapultManager.value) {
    return [
      { prop: 'task', label: 'Task', width: '150%' },
      { prop: 'rewards', label: 'Rewards', width: '70%' },
      { prop: 'project', label: 'Project  ', width: '70%' },
      { prop: 'direction', label: 'Direction', width: '50%' },
      {
        prop: 'deadline_in',
        label: 'Deadline In',
        width: '50%',
      },
      { prop: 'priority', label: 'Priority', width: '10%' },
    ];
  } else if (activeStatus.value === 'on_revision') {
    return [
      { prop: 'task', label: 'Task', width: '150%' },
      { prop: 'rewards', label: 'Rewards', width: '70%' },
      { prop: 'direction', label: 'Direction', width: '50%' },
      {
        prop: 'deadline_in',
        label: 'Deadline In',
        width: '50%',
      },
      { prop: 'priority', label: 'Priority', width: '10%' },
    ];
  } else if (activeStatus.value === 'done' && isSuperAdmin.value) {
    return [
      { prop: 'task', label: 'Task', width: '150%' },
      { prop: 'rewards', label: 'Rewards', width: '70%' },
      { prop: 'project', label: 'Project', width: '70%' },
      { prop: 'manager', label: 'Manager  ', width: '70%' },

      { prop: 'direction', label: 'Direction', width: '50%' },
      {
        prop: 'completed',
        label: 'Completed',
        width: '50%',
      },
    ];
  } else if (activeStatus.value === 'done' && isProjectOwner.value) {
    return [
      { prop: 'task', label: 'Task', width: '150%' },
      { prop: 'rewards', label: 'Rewards', width: '70%' },
      { prop: 'manager', label: 'Manager  ', width: '70%' },

      { prop: 'direction', label: 'Direction', width: '50%' },
      {
        prop: 'completed',
        label: 'Completed',
        width: '50%',
      },
    ];
  } else if (activeStatus.value === 'done' && isCatapultManager.value) {
    return [
      { prop: 'task', label: 'Task', width: '150%' },
      { prop: 'rewards', label: 'Rewards', width: '70%' },
      { prop: 'project', label: 'Project  ', width: '70%' },

      { prop: 'direction', label: 'Direction', width: '50%' },
      {
        prop: 'completed',
        label: 'Completed',
        width: '50%',
      },
    ];
  } else if (activeStatus.value === 'done') {
    return [
      { prop: 'task', label: 'Task', width: '150%' },
      { prop: 'rewards', label: 'Rewards', width: '70%' },
      { prop: 'direction', label: 'Direction', width: '50%' },
      {
        prop: 'completed',
        label: 'Completed',
        width: '50%',
      },
    ];
  } else if (activeStatus.value === 'rejected' && isSuperAdmin.value) {
    return [
      { prop: 'task', label: 'Task', width: '150%' },
      { prop: 'rewards', label: 'Rewards', width: '70%' },
      { prop: 'project', label: 'Project', width: '70%' },
      { prop: 'manager', label: 'Manager  ', width: '70%' },

      { prop: 'direction', label: 'Direction', width: '50%' },
      {
        prop: 'rejected',
        label: 'Rejected',
        width: '50%',
      },
    ];
  } else if (activeStatus.value === 'rejected' && isProjectOwner.value) {
    return [
      { prop: 'task', label: 'Task', width: '150%' },
      { prop: 'rewards', label: 'Rewards', width: '70%' },
      { prop: 'manager', label: 'Manager  ', width: '70%' },

      { prop: 'direction', label: 'Direction', width: '50%' },
      {
        prop: 'rejected',
        label: 'Rejected',
        width: '50%',
      },
    ];
  } else if (activeStatus.value === 'rejected' && isCatapultManager.value) {
    return [
      { prop: 'task', label: 'Task', width: '150%' },
      { prop: 'rewards', label: 'Rewards', width: '70%' },
      { prop: 'project', label: 'Project  ', width: '70%' },

      { prop: 'direction', label: 'Direction', width: '50%' },
      {
        prop: 'rejected',
        label: 'Rejected',
        width: '50%',
      },
    ];
  } else if (activeStatus.value === 'rejected') {
    return [
      { prop: 'task', label: 'Task', width: '150%' },
      { prop: 'rewards', label: 'Rewards', width: '70%' },
      { prop: 'direction', label: 'Direction', width: '50%' },
      {
        prop: 'rejected',
        label: 'Rejected',
        width: '50%',
      },
    ];
  } else if (activeStatus.value === 'overdue' && isSuperAdmin.value) {
    return [
      { prop: 'task', label: 'Task', width: '150%' },
      { prop: 'project', label: 'Project', width: '70%' },
      { prop: 'manager', label: 'Manager  ', width: '70%' },

      { prop: 'direction', label: 'Direction', width: '50%' },
      {
        prop: 'deadlineOver',
        label: 'Deadline',
        width: '50%',
      },
    ];
  } else if (activeStatus.value === 'overdue' && isProjectOwner.value) {
    return [
      { prop: 'task', label: 'Task', width: '150%' },
      { prop: 'manager', label: 'Manager  ', width: '70%' },

      { prop: 'direction', label: 'Direction', width: '50%' },
      {
        prop: 'deadlineOver',
        label: 'Deadline',
        width: '50%',
      },
    ];
  } else if (activeStatus.value === 'overdue' && isCatapultManager.value) {
    return [
      { prop: 'task', label: 'Task', width: '150%' },
      { prop: 'project', label: 'Project', width: '70%' },

      { prop: 'direction', label: 'Direction', width: '50%' },
      {
        prop: 'deadlineOver',
        label: 'Deadline',
        width: '50%',
      },
    ];
  } else if (activeStatus.value === 'overdue' && isProjectOwner.value) {
    console.log(4);

    return [
      { prop: 'task', label: 'Task', width: '150%' },
      { prop: 'direction', label: 'Direction', width: '50%' },
      {
        prop: 'deadlineOver',
        label: 'Deadline',
        width: '50%',
      },
    ];
  } else if (
    (activeStatus.value === 'overdue' && isProjectManager.value) ||
    isProjectAdministrator.value
  ) {
    return [
      { prop: 'task', label: 'Task', width: '150%' },
      { prop: 'direction', label: 'Direction', width: '50%' },
      {
        prop: 'deadlineOver',
        label: 'Deadline',
        width: '50%',
      },
    ];
  }
});

console.log(tasksColumns.value);

const getRewardsIcons = (reward) => {
  const icons = [];

  if (reward.rewards.some((item) => item.type === 'coins')) {
    icons.push(reward.coin_type.symbol);
  }

  if (reward.rewards.some((item) => item.type === 'discord_role')) {
    icons.push('discord');
  }

  if (reward.rewards.some((item) => item.type === 'credits')) {
    icons.push('credits');
  }

  return icons;
};

const allTasks = computed(() =>
  tasks.value?.data.map((task) => {
    const data = task.task;
    return {
      task: {
        content: data.name,
        reduceLength: 58,
      },
      manager: {
        content: task.manager ? task.manager.name : '',
        reduceLength: 24,
      },
      priority: {
        component: Priority,
        props: {
          dots: data.priority,
        },
      },
      deadline: {
        component: Badge,
        props: {
          text: formatDate(timestampToString(data.ended_at)),
          value: '',
          type: 'transparent',
          big: false,
          futureDate: timestampToString(data.ended_at),
        },
        time: formatNumber(timestampToString(data.ended_at)),
      },
      deadline_in: {
        component: Badge,
        props: {
          text: formatFutureDate(timestampToString(data.ended_at)),
          value: '',
          type: 'transparent',
          big: false,
          futureDate: timestampToString(data.ended_at),
        },
        time: timestampToString(data.ended_at),
      },
      deadlineOver: {
        component: Badge,
        props: {
          text: formatDate(timestampToString(data.ended_at)),
          value: '',
          type: 'transparent',
          big: false,
          futureDate: data.ended_at,
        },
        time: formatNumber(timestampToString(data.ended_at)),
      },
      completed: {
        component: Badge,
        props: {
          text: formatDate(timestampToString(data.ended_at)),
          value: '',
          type: 'transparent',
          big: false,
        },
        time: formatNumber(timestampToString(data.ended_at)),
      },
      rejected: {
        component: Badge,
        props: {
          text: formatDate(data.ended_at),
          value: '',
          type: 'transparent',
          big: false,
        },
        time: formatPastDate(data.ended_at),
      },
      project: {
        component: Talent,
        props: {
          text: data.project ? data.project.name : '',
          img: data.project && data.project.logo ? data.project.logo : defaultBg,
          square: true,
          reduceLength: 15,
        },
      },
      direction: {
        component: Badge,
        props: {
          text: data.activity ? data.activity.name : 'All',
          value: '',
          type: getBadgeTypeByName(data.activity ? data.activity.name : 'All'),
          big: false,
        },
      },
      rewards: {
        component: Tokens,
        props: {
          currencies: getRewardsIcons(data),
          isCoefficient: data.level_coefficient,
        },
      },
    };
  }),
);
import {
  formatFutureDate,
  formatPastDate,
  formatDate,
  getBadgeTypeByName,
  formatNumber,
  formatNumberMore10K,
  formatNumberAddComma,
} from '@/util/helpers';
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
    margin-bottom: 40px;
    gap: 40px;
    .sidebar {
      width: 360px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-bottom: 40px;
    }
    .content {
      display: flex;
      flex-direction: column;
      min-width: 760px;
      width: 100%;
      gap: 24px;
      .bio {
        display: flex;
        flex-direction: column;
        padding: 24px;
        gap: 24px;
        background: $white;
        border: 1px solid $default-border;
        border-radius: 16px;
        justify-content: space-between;
        .header {
          width: 100%;
          display: flex;
          justify-content: space-between;
          .langs {
            display: flex;
            gap: 8px;
            align-items: center;
            font-family: 'Basis Grotesque Pro';
            font-style: normal;
            font-weight: 500;
            font-size: 12px;
            line-height: 16px;
            text-align: right;
            letter-spacing: 0.014em;
            font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
            color: $secondary;
          }
        }
        .html {
          font-family: 'Basis Grotesque Pro';
          font-style: normal;
          font-weight: 400;
          font-size: 20px;
          line-height: 32px;
          hanging-punctuation: first last;
          font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on, 'ordn' on, 'ss04' on;
          color: $section-title;
        }
        .timing {
          font-family: 'Basis Grotesque Pro';
          font-style: normal;
          font-weight: 500;
          font-size: 12px;
          line-height: 16px;
          letter-spacing: 0.014em;
          font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
          color: $secondary;
        }
        .socials {
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 8px;
        }
      }
    }
  }
}
.icon {
  filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(349deg) brightness(107%) contrast(180%);
}
hr {
  color: #dad9f7;
  width: 100%;
}
.tasks {
  margin: 40px 0;
  display: flex;
  flex-direction: column;
  gap: 40px;
  .title {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 350;
    font-size: 48px;
    line-height: 64px;
    color: $section-title;
    margin: 20px 0;
  }
}
</style>

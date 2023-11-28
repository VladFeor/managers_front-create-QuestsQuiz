import { useUserStore } from '~/store';

const hasProjectId = computed(() => useUserStore().getUserProjectId);

const menuData = {
  dashboard: {
    name: 'Dashboard',
    img: 'Dashboard',
    to: '/',
  },
  talents: {
    name: 'Talents',
    img: 'Talents',
    to: '/leaderboard',
  },
  project: {
    name: 'Project',
    img: 'Project',
    to: '/projects',
  },
  projects: {
    name: 'Projects',
    img: 'Project',
    to: '/projects',
  },
  tasks: {
    name: 'Tasks',
    img: 'Tasks',
    to: '/tasks',
  },
  requests: {
    name: 'Requests',
    img: 'Request',
    to: '/requests',
  },
  managers: {
    name: 'Managers',
    img: 'Managers',
    to: '/managers',
  },
  referrals: {
    name: 'Referrals',
    img: 'Refferals',
    to: '/referrals',
  },
  reports: {
    name: 'Reports',
    img: 'Reports',
    to: '/reports',
  },
  automations: {
    name: 'Automations',
    img: 'Automations',
    to: '/automations',
  },
  quests: {
    name: 'Quests',
    img: 'Quests',
    to: '/quests',
  }
};

const {
  reports,
  referrals,
  dashboard,
  talents,
  projects,
  tasks,
  requests,
  managers,
  automations,
  project,
  quests,
} = menuData;

const MENU_LINKS = {
  isProjectOwner: [dashboard, talents, project, tasks, referrals, managers, automations, requests, quests],
  isSuperAdmin: [dashboard, talents, projects, tasks, requests, managers, referrals, reports, quests],
  isProjectAdministrator: [dashboard, talents, project, tasks, managers, referrals, quests],
  isAdminSupport: [dashboard, talents, projects, tasks, managers, automations, quests],
  isProjectManager: [dashboard, talents, project, tasks, quests],
  isCatapultManager: hasProjectId.value
    ? [dashboard, talents, projects, tasks, requests, managers, quests]
    : [dashboard, talents, projects, tasks, requests, quests],
};

export default MENU_LINKS;

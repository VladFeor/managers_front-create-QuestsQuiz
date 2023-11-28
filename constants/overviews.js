export const OVERVIEWS_BY_ROLE = {
  'Super Admin': [
    'projects',
    'talents',
    'managers',
    'usdtPaid',
    'pendingClaims',
    'pendingDirections',
    'reviewedTasks',
    'overdueTasks',
  ],
  'Talentum Manager': [
    'projects',
    'talents',
    'pendingDirections',
    'createdTasks',
    'reviewedTasks',
    'overdueTasks',
  ],
  'Project Owner': [
    'talents',
    'activeTalents',
    'managers',
    'pendingClaims',
    'createdTasks',
    'reviewedTasks',
    'overdueTasks',
    'usdtPaid',
  ],
  'Project Administrator': ['reviewedTasks', 'overdueDeadlines', 'activeTalents'],
  'Project Manager': ['reviewedTasks', 'overdueDeadlines'],
};

export const OVERVIEWS_BY_PROJECT = {
  'Talentum Manager': ['reviewedTasks', 'deadlineInThreeDays', 'activeTalents'],
  'Project Administrator': [
    'activeTalents',
    'deadlineInThreeDays',
    'createdTasks',
    'reviewedTasks',
  ],
  'Project Manager': ['reviewedTasks', 'deadlineInThreeDays', 'tasksOnRevision'],
};

export const OVERVIEW_TITLES = {
  pendingDirections: 'pending directions',
  pendingClaims: 'pending claims',
  reviewedTasks: 'reviewed tasks',
  joiningTalents: 'talents',
  usdtPaid: 'USDT paid',
  overdueTasks: 'overdue tasks',
  createdTasks: 'created tasks',
  activeTalents: 'active talents',
  deadlineInThreeDays: 'deadlines in 3 days',
  tasksOnRevision: 'on revision',
};

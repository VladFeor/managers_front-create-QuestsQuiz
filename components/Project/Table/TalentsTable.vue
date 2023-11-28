<template>
  <div class="mt-7">
    <Talents :default-project="project" :search="search" />
  </div>
</template>

<script setup>
  import { Talents } from "@/components/";
  const search = ref('');
  const props = defineProps({
    project: {
      type: Object,
      default: null
    }
  })

// import {computed} from "vue";
// import {Categories, Talent, Languages} from "~/components/"
// import {reduceStringLength} from "~/util/helpers";
// import defaultBg from "assets/images/protocol-oasis-bg.png";
// const roles = inject('roles');
// const project = inject('project');
// const props = defineProps({
//   activeMenu: {
//     type: Object,
//     default: null
//   }
// })
//
// const {
//   isProjectAdministrator,
//   isSuperAdmin,
//   isProjectManager,
//   isProjectOwner
// } = roles;
//
// const talentsColumns = computed(() => {
//   return [
//     { prop: 'talent', label: 'Manager', width: '100%' },
//     { prop: 'directions', label: 'Role', width: '50%' },
//     { prop: 'languages', label: 'Reviewed', width: '40%' },
//     { prop: 'level', label: 'On Revision', width: '30%' },
//     { prop: 'qp', label: 'Overdue', width: '30%' },
//     { prop: 'tasks', label: 'Overdue', width: '30%' },
//   ];
// });
// const talentsRows = computed(() => {
//   // const tasksArray = project.value.tasks;
//   // if (!tasksArray || (tasksArray && !tasksArray.length)) {
//   //   return [];
//   // }
//   const managersArray = [
//     {
//       talent : {
//         name: 'Craig Baptista'
//       },
//       directions : {
//         value: [
//           { id: 1, tag: { name: 'Content Making', colors: { light: '#DCF5F3', dark: '#25B8AE' } } },
//           { id: 2, tag: { name: 'Copywriting', colors: { light: '#E0ECFF', dark: '#4979CC' } } },
//         ]
//       },
//       languages : {
//         value: ['EN', 'GE', 'SE']
//       },
//       level : {
//         text: 5
//       },
//       qp : {
//         text: 2000
//       },
//       tasks: {
//         text: 12
//       }
//     }
//   ]
//
//   return managersArray.map((item) => {
//     return {
//       talent: {
//         component: Talent,
//         props: {
//           text: item.talent.name ? reduceStringLength(item.talent.name, 25) : '',
//           img: defaultBg,
//           square: false,
//           reduceLength: 35,
//         },
//       },
//       directions: {
//         component: Categories,
//         props: {
//           categories: item.directions.value
//         },
//       },
//       languages: {
//         component: Languages,
//         props: {
//           languages: item.languages.value
//         }
//       },
//       level: {
//         content: item.level.text
//       },
//       qp: {
//         content: item.qp.text
//       },
//       tasks: {
//         content: item.tasks.text
//       },
//     };
//   });
// });
// function getRewardsIcons(reward) {
//   const icons = [];
//
//   if (reward.rewards.some((item) => item.type === 'coins')) {
//     icons.push(reward.coin_type.symbol);
//   }
//
//   if (reward.rewards.some((item) => item.type === 'discord_role')) {
//     icons.push('discord');
//   }
//
//   return icons;
// };
</script>


<style scoped lang="scss">

</style>
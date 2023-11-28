<template>
  <div class="directions">
    <span class="title">Directions</span>
    <div class="directions-card">
      <div class="tabs" :class="{ 'tab-small': tabs.length > 5 }">
        <div
          v-for="(tab, index) in tabs"
          :key="index"
          class="tab"
          :style="{
            ...defaultColor(tab.activity),
          }"
          @click="selectTab(index)"
          :class="{ 'tab-active': activeTab === index }"
          v-on="{
            mouseenter: () => (hoveredButtonId = tab.activity.id),
            mouseleave: () => (hoveredButtonId = null),
          }"
        >
          <div
            :ref="(el) => (wrappers[index] = el)"
            class="button"
            :style="{
              ...activeColor(tab.activity),
              ...hoverColor(tab.activity),
              ...activeHoverColor(tab.activity),
            }"
          >
            <div v-if="tab.status === 'approved'">
              <Icon icon="Tik-def" :size="16" class="mr-2"></Icon>
            </div>
            <div v-else-if="tab.status === 'pending'">
              <Icon icon="Clock-def" :size="16" class="mr-2"></Icon>
            </div>
            {{ tab.activity.name }}
            <div v-if="isSuperAdmin || isCatapultManager">
              <Icon icon="More-def" @click="toggleTooltip(index)" :size="16" class="ml-2"></Icon>
            </div>
          </div>
          <div v-if="showTooltips[index]" id="tooltip-confirmation">
            <div class="tooltip-arrow"></div>
            <div class="controller">
              <div class="cancel" v-if="tab.status === 'approved'" @click="disapprove(tab, index)">
                Disapprove
              </div>
              <div class="cancel" v-else @click="approve(tab, index)">Approve</div>
            </div>
          </div>
        </div>
      </div>
      <div class="content" v-if="tabs.length">
        <span class="title">Skills</span>
        <div class="skills" v-if="skills.length">
          <Badge v-for="i in skills" big :key="i" :text="i.skill.name"></Badge>
        </div>
        <div v-else class="empty-state">Talent has not yet added any skills</div>
        <span class="title">Portfolio</span>
        <div class="portfolio-container" v-if="portfolio.length">
          <div v-for="(source, index) in portfolio" :key="index" class="info">
            <div>
              <img
                :src="source.activity_link.link.icon"
                width="40"
                height="40"
                style="max-width: 40px"
              />
            </div>
            <div class="source">
              <div class="flex justify-between w-full">
                <a
                  :href="isURL(source.content) ? source.content : `https://${source.content}`"
                  target="_blank"
                  class="title"
                  >{{ source.content }}</a
                >
              </div>
              <span class="social-name">{{ source.activity_link.link.name }}</span>
            </div>
          </div>
        </div>
        <div v-else class="empty-state">Talent has not yet added any links</div>
      </div>
      <div v-else class="empty-state">Talent has not yet added any directions</div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject, nextTick, ref } from 'vue';
import { useTalentsStore } from '~/store/talents';
import AxiosService from '~/service/axiosService';
const roles = inject('roles');

const { isSuperAdmin, isCatapultManager } = roles;

const talentsStore = useTalentsStore();
let activities = reactive(talentsStore.getTalentById);
// let tabsData = reactive(activities?.activities.map((i) => i));
let tabsData = reactive(
  activities?.activities.map((i) => {
    return {
      id: i.id,
      status: i.status,
      request_at: i.request_at || '2023',
      activity: i.activity,
    };
  }) || [],
);
let tabs = computed(() => tabsData);
const activeTab = ref(0);
const hoveredButtonId = ref(0);
let wrappers = [];
const activeTabObject = computed(() => tabs.value[activeTab.value].activity);
const skills = computed(() =>
  talentsStore.getTalentById?.skills.filter(
    (item) => item.skill.activity_id === activeTabObject.value.id,
  ),
);
const portfolio = computed(() =>
  talentsStore.getTalentById?.activity_links.filter(
    (item) => item.activity_link.activity_id === activeTabObject.value.id,
  ),
);
const showTooltips = ref(tabs.value.map(() => false));
const toggleTooltip = (index) => {
  showTooltips.value[index] = !showTooltips.value[index];
};
const talentID = computed(() => talentsStore.getTalentById?.id);
const disapprove = (activity, index) => {
  console.log(activity);
  AxiosService.post(
    useRuntimeConfig().public.apiBase + 'activities/decline/' + activity.id,
    {},
  ).then(async () => {
    await talentsStore.getTalentByIdAction(talentID.value).then(() => {
      activities = reactive(talentsStore.getTalentById);
      tabsData = reactive(activities?.activities.map((i) => i));
      tabs = computed(() => tabsData);
    });
    showTooltips.value[index] = false;
  });
};
const approve = (activity, index) => {
  AxiosService.post(
    useRuntimeConfig().public.apiBase + 'activities/approve/' + activity.id,
    {},
  ).then(async () => {
    await talentsStore.getTalentByIdAction(talentID.value).then(() => {
      activities = reactive(talentsStore.getTalentById);
      tabsData = reactive(activities?.activities.map((i) => i));
      tabs = computed(() => tabsData);
    });
    showTooltips.value[index] = false;
  });
};

const handleClickOutside = (event) => {
  wrappers.forEach((wrapper, index) => {
    if (wrapper && !wrapper.contains(event.target)) {
      showTooltips.value[index] = false;
    }
  });
};
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
const hoverColor = (tab) => {
  if (tab.colors?.light && tab.id == hoveredButtonId.value) {
    return {
      color: `${tab.colors.light}`,
      background: `${tab.colors.dark}`,
    };
  } else {
    return {};
  }
};

const iconColor = (tab) => {
  if (tab.id == hoveredButtonId.value) {
    return tab.colors.main;
  } else if (tab.id == activeTab.value?.id) {
    return '#fff';
  } else if (tab.id == hoveredButtonId.value && tab.id == activeTab.value?.id) {
    return tab.colors.dark;
  } else {
    return tab.colors.light;
  }
};

const activeColor = (tab) => {
  if (tab.id == activeTabObject.value?.id && tab.colors?.dark) {
    return {
      background: `${tab.colors.dark} !important`,
      color: '#fff !important',
    };
  }
  return {};
};

const defaultColor = (tab) => {
  return {
    background: `${tab.colors.light} !important`,
    color: `${tab.colors.main} !important`,
  };
};

let timeOut = ref(null);

const activeHoverColor = (tab) => {
  if (tab.id == hoveredButtonId.value && tab.id == activeTab.value?.id) {
    return {
      background: `${tab.colors.dark} !important`,
      color: '#fff !important',
    };
  }
  return {};
};

const selectTab = (index) => {
  activeTab.value = index;
};

function isURL(str) {
  const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/\S*)?$/i;
  return urlPattern.test(str) && !str.startsWith('www');
}
</script>

<style scoped lang="scss">
.directions {
  display: flex;
  flex-direction: column;
  width: 100%;
  .skills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .info {
    width: calc(50% - 8px);
    height: 104px;
    background: $default-bg;
    border: 1px solid $default-border;
    display: flex;
    padding: 24px;
    border-radius: 8px;
    position: relative;
    .source {
      margin-left: 16px;
      display: flex;
      width: 80%;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      .title {
        font-family: 'Basis Grotesque Pro';
        font-style: normal;
        font-weight: 500;
        font-size: 16px !important;
        line-height: 24px !important;
        font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
        color: $default;
        height: 24px;
        width: 90%;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .social-name {
        font-family: 'Basis Grotesque Pro';
        font-style: normal;
        font-weight: 500;
        font-size: 12px;
        line-height: 16px;
        letter-spacing: 0.014em;
        font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
        color: $colabs-bg;
      }
    }
  }

  .title {
    font-family: 'Basis Grotesque Pro';
    font-size: 24px;
    line-height: 40px;
    color: $section-title;
  }

  .directions-card {
    margin-top: 16px;
    .tabs {
      position: relative;
      display: flex;
      align-items: flex-start;
      gap: 8px;

      .tab {
        font-family: 'Basis Grotesque Pro';
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
        border-radius: 6px 6px 0 0;
        height: 50px;
        display: flex;
        align-items: flex-start;
        cursor: pointer;
        text-align: center;
        position: relative;

        .button {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: 6px;
          padding: 6px 8px;
          position: relative;
        }
      }
    }

    .content {
      padding: 24px;
      background: $white;
      border: 1px solid $default-border;
      border-radius: 16px;
      width: 100%;
      margin-top: -10px;
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      gap: 16px;

      .title {
        font-family: 'Basis Grotesque Pro';
        font-weight: 500;
        font-size: 18px;
        line-height: 24px;
        color: $secondary;
      }
    }
  }
}
#tooltip-confirmation {
  position: absolute;
  z-index: 9999999;
  right: 0;
  width: fit-content;
  height: fit-content;
  margin-top: 35px;
  background: $white;
  padding: 16px;
  box-shadow: 0px 4px 16px rgba(56, 64, 91, 0.24);
  border-radius: 8px;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.014em;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
}

.tooltip-arrow {
  position: absolute;
  top: -6px; /* половина высоты стрелки */
  left: 85%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent; /* половина ширины стрелки */
  border-right: 6px solid transparent; /* половина ширины стрелки */
  border-bottom: 6px solid $white; /* цвет стрелки */
}
.portfolio-container {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.empty-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0px;
  gap: 8px;
  width: 100%;
  height: 104px;
  background: $default-bg;
  border-radius: 8px;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  color: $secondary;
}
.controller {
  display: flex;
  div {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    font-feature-settings: 'zero' on;
    color: $default !important;
    flex: none;
    order: 0;
    flex-grow: 1;
  }
}
.tab-small {
  display: flex;
  gap: 3px !important;
}
</style>

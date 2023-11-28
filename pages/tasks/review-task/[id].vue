<template>
  <div class="task_wrapper">
    <BtnSkeleton v-if="userTaskLoading || !task" />
    <BackBtn
      v-else
      :text="task.task.project.name"
      :img="task.task.project.logo"
      :to="`/tasks?status=${task.status}`"
    />
    <BtnSkeleton v-if="userTaskLoading || !task" />
    <div v-else class="task-name">{{ task.task.name }}</div>
    <div class="task-body">
      <TableSkeleton v-if="userTaskLoading || !task" />
      <div v-else class="task-data">
        <div class="main-task-data">
          <div class="task-info_wrapper">
            <div class="task-info">
              <Badge
                :text="task.task.activity ? task.task.activity.name : 'All'"
                :type="getBadgeTypeByName(task.task.activity ? task.task.activity.name : 'All')"
                :big="false"
              />
              <div class="task-priority">Priority <Priority :dots="task.task.priority" /></div>
              <div class="task-date">
                <Badge
                  :text="formatDate(timestampToString(task.task.started_at))"
                  type="transparent"
                  :big="false"
                />
                -
                <Badge
                  :text="formatDate(timestampToString(task.task.ended_at))"
                  type="transparent"
                  :big="false"
                />
              </div>
            </div>
            <div class="task-status">
              <!-- <Badge :text="task.status" type="transparent" :big="false" /> -->
              <Badge
                :text="getTaskStatus(task.status)"
                isStatusIcon
                type="transparent"
                :big="false"
              />
            </div>
          </div>
          <div
            v-if="task.task.verifier_driver && task.task.verifier_driver === 'twitter'"
            class="social-driver_title"
          >
            Twitter Activities to Complete the Task
          </div>
          <TwitterCard
            v-if="task.task.verifier_driver && task.task.verifier_driver === 'twitter'"
            small
            :task="task.task"
            :status="task.status"
            isFollow
          />
          <TwitterCard
            v-if="task.task.verifier_driver && task.task.verifier_driver === 'twitter'"
            :task="task.task"
            :status="task.status"
            isShowBtns
            isPost
          />
          <TwitterCard
            v-if="
              task.task.verifier_driver &&
              task.task.verifier_driver === 'twitter' &&
              task.task.verifier.types.some((item) => item === 'twitter_tweet')
            "
            :task="task.task"
            :status="task.status"
            isTweetLink
            :isTweetLinkActive="task.status === 'in_progress'"
            @urlInput="handleUrl"
          />
          <TwitterCard
            v-if="
              task.task.verifier_driver &&
              task.task.verifier_driver === 'twitter' &&
              task.task.verifier.types.some((item) => item === 'twitter_space')
            "
            :task="task.task"
            :status="task.status"
            isSpace
          />
          <DiscordCard
            v-if="task.task.verifier_driver && task.task.verifier_driver === 'discord'"
            :task="task.task"
          />
          <TaskInvitesCard
            v-if="task.task.is_invite_friends"
            :description="task.task.project.description"
            :protocol="task.task.project.name"
            :tags="task.task.project.tags"
            :bg="task.task.project.banner"
            :logo="task.task.project.logo"
            :task="task"
            :status="task.status_by_dates"
          />
          <div v-if="task.task.verifier_driver && task.task.verifier_driver === 'reddit'">
            <RedditPostCard
              class="mb-5"
              v-if="
                task.task.verifier.types.includes('reddit_comment_post') ||
                task.task.verifier.types.includes('reddit_save_post') ||
                task.task.verifier.types.includes('reddit_vote_post')
              "
              :is-comment="task.task.verifier.types.includes('reddit_comment_post')"
              :is-save="task.task.verifier.types.includes('reddit_save_post')"
              :is-vote="task.task.verifier.types.includes('reddit_vote_post')"
              :data="{ url: task.task.verifier.reddit_post, id: task.task.verifier.reddit_post_id }"
            ></RedditPostCard>
            <RedditCommunityCard
              v-if="
                task.task.verifier.types.includes('reddit_join_community') ||
                task.task.verifier.types.includes('reddit_own_post')
              "
              class="mb-5"
              :is-community="task.task.verifier.types.includes('reddit_join_community')"
              :is-own-post="task.task.verifier.types.includes('reddit_own_post')"
              :words="task.task.verifier.reddit_post_words"
              :post="task.task.verifier.reddit_default_post"
              :data="{
                url: task.task.verifier.reddit_post,
                id: task.task.verifier.reddit_community_id,
              }"
            ></RedditCommunityCard>
            <RedditKarmaCard
              v-if="task.task.verifier.types.includes('reddit_karma')"
              class="mb-5"
              :karma="task.task.verifier.reddit_karma_score"
            ></RedditKarmaCard>
            <RedditTrophiesCard
              class="mb-5"
              v-if="task.task.verifier.types.includes('reddit_trophies')"
              :trophies="task.task.verifier.reddit_trophies"
            ></RedditTrophiesCard>
          </div>
          <div class="task-content" v-if="!hasHtml(task.task.text)">
            {{ task.task.text }}
          </div>
          <div
            v-else
            class="task-content html"
            :class="{
              list: isTaskHasList(task.task.text),
              long: isTaskHasLongWord(task.task.text),
            }"
            v-html="addLinksToText(task.task.text)"
          ></div>
          <TaskCondition 
            v-if="taskChainCondition" 
            :condition="taskChainCondition" 
            :isEditingActive = "false"
          />
        </div>
        <FileListViewer
          v-if="task.task.images.length"
          @zoomInImage="zoomInImage"
          :files="task.task.images"
        />
      </div>
      <CalendarSkeleton v-if="userTaskLoading || !task" />
      <div v-else class="task-sidebar-review">
        <div v-if="rewardsArray.length" class="task-sidebar-review-card">
          <div class="task-sidebar-review-card_title_wrapper">
            <div class="task-sidebar-review-card_title">Rewards</div>

            <div
              v-if="rewardsArray.some((item) => item.type === 'coin')"
              class="task-sidebar-card_subtitle flex items-center gap-x-1"
            >
              <Blockchain :name="task.task.coin_type.blockchain.name" :size="18"></Blockchain>
              <span>{{ task.task.coin_type.blockchain.name }}</span>
            </div>
          </div>
          <div
            v-for="taskReward in rewardsArray"
            :key="taskReward.rewardString"
            class="task-sidebar-review-card_reward"
          >
            <div class="task-sidebar-review-card_reward-amount">{{ taskReward.rewardString }}</div>
            <img v-if="taskReward.type === 'credits'" :src="taskReward.icon" alt="" />
            <Coin
              v-else-if="taskReward.type === 'coin'"
              :name="task.task.coin_type.symbol + '-Default'"
              :size="36"
            />
            <Icon v-else :size="36" name="Discord-Circle"></Icon>
          </div>
        </div>
        <ReportsCard
          :reports="task.reports"
          :status="task.status"
          :created="timestampToString(task.task.started_at)"
        />
        <div v-if="task?.task?.type_task ==='on-chain' && taskGateConditions.length" class="task-sidebar-card">
          <div class="task-sidebar-card_title gate">
            <div class="flex gap-1">
              Gate
              <TooltipIcon
                tooltipText="Gate is rules you set that determine who can access your project. To pass a gate, the talent must meet the conditions you specify below."
              />
            </div>
          </div>
          <div class='w-full'>
            <GateCondition
              v-for="condition in taskGateConditions"
              :condition="condition"
              class="gate-condition-wr"
              :readonly="true"
            />
          </div>
        </div>
        <BaseButton
          v-if="task.status === 'waiting_for_review' || task.status === 'on_revision'"
          class="w-full"
          :text="task.status === 'waiting_for_review' ? 'Take on Revision' : 'Approve'"
          type="normal"
          @click="statusHandler(task.status)"
        />
        <div v-if="task.status === 'on_revision'" class="reject-btns">
          <BaseButton
            class="w-full"
            text="For Rework"
            type="secondary"
            @click="isReworkModalVisible = true"
          />

          <DropdownBtn @action="isConfirmModalOpen = true" />
        </div>
      </div>
    </div>
  </div>
  <ZoomImage v-if="isOpenZoom" @close="closeZoomModal" :image="activeImage" />

  <BaseModal
    :width="taskChainCondition ? 600 : 900"
    maxHeight="608px"
    @close="handleClose($event)"
    :visible="visible"
  >
    <WorkingTalentsModal :taskId="task.task.id" :isOnChain="taskChainCondition" :statusByDates="task?.task?.status_by_dates" />
  </BaseModal>
  <BaseModal
    :width="400"
    customHeight="376px"
    @close="handleCloseApprove($event)"
    :visible="isApproveModalOpen"
    isScrollOff
  >
    <div class="approve-task-modal">
      <div class="approve-task-modal_title">Evaluation of Talent Work</div>
      <div class="approve-task-modal_subtitle">
        Note how much you liked how the talent completed the task.
      </div>
      <Talent :text="task.user.name" :img="task.user.avatar ? task.user.avatar : ''" />
      <Rating @setRate="setRating" />
      <div class="approve-btn_wrapper">
        <BaseButton text="Done" type="normal" @click="finishTask" />
      </div>
    </div>
  </BaseModal>
  <BaseModal
    :width="600"
    :top="10"
    :rightCustom="10"
    :bottom="10"
    customHeight="auto"
    @close="handleReworkModalClose($event)"
    :visible="isReworkModalVisible"
    btnLeft
    isScrollOff
  >
    <ReworkModal @input="setReturnTaskDescription($event)" @action="returnTask" :task="task" />
  </BaseModal>
  <BaseModal
    :width="480"
    customHeight="248px"
    @close="handleCloseConfirm($event)"
    :visible="isConfirmModalOpen"
    isScrollOff
  >
    <div class="confirm-modal">
      <div class="confirm-modal_title">Rejection of the Decision</div>
      <div class="confirm-modal_subtitle">
        Confirm this decision is rejected if you think the talent has not completed the task
        correctly.
      </div>

      <div class="confirm-modal_btns-wrapper">
        <BaseButton text="Cancel" type="secondary" @click="handleCloseConfirm(false)" />
        <BaseButton text="Reject" type="normal" @click="rejectTask" />
      </div>
    </div>
  </BaseModal>
  <InaccessibleLinkModal
    v-if="showErrorModal"
    title="Task Unavailable"
    text="The task you are trying to access is no longer available. It may have been completed or deleted. Please contact your project manager or administrator for further assistance."
    link="/tasks?status=waiting_for_review"
    button="Go to the List of Tasks"
  ></InaccessibleLinkModal>
</template>

<script setup>
import {
  formatDate,
  getBadgeTypeByName,
  getTaskStatus,
  isTaskHasList,
  timestampToString,
  isTaskHasLongWord,
  addLinksToText,
} from '@/util/helpers';
import { useRoute } from 'vue-router';
import { onMounted, ref, onUnmounted } from 'vue';
import { useTasksStore } from '~/store/tasks';
import { useDiscordStore } from '~/store/discord';
import axios from 'axios';
import { useAuthStore } from '~/store/auth';
import { useRouter } from 'vue-router';
import creditsIcon from '@/assets/icons/Credits.svg';
import RedditCommunityCard from '~/components/Cards/RedditCommunityCard.vue';

const router = useRouter();
const nuxtApp = useNuxtApp();
const showErrorModal = ref(false);

const route = useRoute();
const tasksStore = useTasksStore();
const authStore = useAuthStore();

const rewardsArray = ref([]);
const rating = ref(null);
const talents = ref([]);

const setRating = (value) => {
  rating.value = value;
};

const task = computed(() => tasksStore.getUserTask);

const userTaskLoading = computed(() => tasksStore.getUserTaskLoading);
const taskGateConditions = computed(() => tasksStore.getGate);
const taskChainCondition = computed(() => task?.value?.task?.chain_conditions?.find(el => el.type === 'main'));

const visible = ref(false);
const isConfirmModalOpen = ref(false);
const isApproveModalOpen = ref(false);
const isReworkModalVisible = ref(false);
const returnTaskDescription = ref('');
const activeImage = ref(null);
const isOpenZoom = ref(false);

const closeZoomModal = () => {
  isOpenZoom.value = false;
  document.body.classList.remove('hide-scroll');
};

const zoomInImage = (image) => {
  activeImage.value = image;
  isOpenZoom.value = true;
  document.body.classList.add('hide-scroll');
};

const setReturnTaskDescription = (value) => {
  returnTaskDescription.value = value;
};

const handleClose = (value) => {
  visible.value = value;
};

const handleCloseApprove = (value) => {
  isApproveModalOpen.value = value;
};

const handleCloseConfirm = (value) => {
  isConfirmModalOpen.value = value;
};

const handleReworkModalClose = (value) => {
  isReworkModalVisible.value = value;
};

const returnTask = () => {
  if (!returnTaskDescription.value.length) {
    nuxtApp.$alert.show(`Fill the message`, {
      type: 'error',
      timeout: 5000,
    });
    return;
  }
  axios
    .post(
      useRuntimeConfig().public.apiBase + 'v2/ambassadors/tasks/return/' + route.params.id,
      {
        text: returnTaskDescription.value,
      },
      {
        headers: {
          Authorization: `Bearer ${authStore.getToken()}`,
        },
      },
    )
    .then((response) => {
      tasksStore.getUserTaskAction(route.params.id);
      nuxtApp.$alert.show(`Success`, {
        type: 'success',
        timeout: 5000,
      });

      isReworkModalVisible.value = false;

      window.dataLayer.push({
        event: 'project_task_return',
      });
    })
    .catch((error) => {
      nuxtApp.$alert.show(`Something went wrong!`, {
        type: 'error',
        timeout: 5000,
      });
      console.log(error);
    });
};

const rejectTask = () => {
  axios
    .post(
      useRuntimeConfig().public.apiBase + 'v2/ambassadors/tasks/reject/' + route.params.id,
      {
        ambassadorTask: route.params.id,
      },
      {
        headers: {
          Authorization: `Bearer ${authStore.getToken()}`,
        },
      },
    )
    .then((response) => {
      tasksStore.getUserTaskAction(route.params.id);
      nuxtApp.$alert.show(`Success`, {
        type: 'success',
        timeout: 5000,
      });
      isConfirmModalOpen.value = false;

      window.dataLayer.push({
        event: 'project_task_rejection',
      });
    })
    .catch((error) => {
      nuxtApp.$alert.show(`Something went wrong!`, {
        type: 'error',
        timeout: 5000,
      });
      console.log(error);
    });
};

const finishTask = () => {
  if (!rating.value) {
    nuxtApp.$alert.show(`Please select rating`, {
      type: 'error',
      timeout: 5000,
    });

    return;
  }

  axios
    .post(
      useRuntimeConfig().public.apiBase + 'v2/ambassadors/tasks/done/' + route.params.id,
      {
        rating: rating.value,
      },
      {
        headers: {
          Authorization: `Bearer ${authStore.getToken()}`,
        },
      },
    )
    .then((response) => {
      tasksStore.getUserTaskAction(route.params.id);
      nuxtApp.$alert.show(`Success`, {
        type: 'success',
        timeout: 5000,
      });
      isApproveModalOpen.value = false;

      window.dataLayer.push({
        event: 'project_task_completion',
      });
    })
    .catch((error) => {
      nuxtApp.$alert.show(`Something went wrong!`, {
        type: 'error',
        timeout: 5000,
      });
      console.log(error);
    });
};

const statusHandler = (status) => {
  if (status === 'waiting_for_review') {
    axios
      .post(
        useRuntimeConfig().public.apiBase +
          'v2/ambassadors/tasks/take-on-revision/' +
          route.params.id,
        {},
        {
          headers: {
            Authorization: `Bearer ${authStore.getToken()}`,
          },
        },
      )
      .then((response) => {
        tasksStore.getUserTaskAction(route.params.id);
        nuxtApp.$alert.show(`Success`, {
          type: 'success',
          timeout: 5000,
        });
      })
      .catch((error) => {
        nuxtApp.$alert.show(`Something went wrong!`, {
          type: 'error',
          timeout: 5000,
        });
        console.log(error);
      });
  }
  if (status === 'on_revision') {
    isApproveModalOpen.value = true;
  }
};

const getTalents = async (id) => {
  const { data } = await axios.get(
    useRuntimeConfig().public.apiBase + `tasks/${id}/talents-working`,
    {
      headers: {
        Authorization: `Bearer ${authStore.getToken()}`,
      },
    },
  );
  talents.value = data;
};

onUnmounted(() => {
  rewardsArray.value = [];
});

watch(task, (value) => {
  console.log('WATCH task', value);
  getTaskRewards(value);
  if (value) {
    getTalents(value.task_id);
  }
});

const getTaskRewards = async (task) => {
  if (task.task.rewards && task.task.rewards.length) {
    const isCoinsExist = task.task.rewards.find((reward) => reward.type === 'coins');
    const isCreditsExist = task.task.rewards.find((reward) => reward.type === 'credits');
    const isDiscordExist = task.task.rewards.find((reward) => reward.type === 'discord_role');
    if (isCoinsExist && !rewardsArray.value.some((item) => item.type === 'coin')) {
      const icon = task.task.coin_type.symbol;
      const rewardString = `${isCoinsExist.value} ${task.task.coin_type.symbol.toUpperCase()}`;
      rewardsArray.value.push({ rewardString, icon, type: 'coin' });
    }
    if (isCreditsExist) {
      if (rewardsArray.value.some((item) => item.type === 'credits')) {
        rewardsArray.value = rewardsArray.value.filter((item) => item.type !== 'credits');
      }
      const icon = creditsIcon;
      const rewardString = `${isCreditsExist.value} Credits`;
      rewardsArray.value.push({ rewardString, icon, type: 'credits' });
    }
    if (isDiscordExist && !rewardsArray.value.some((item) => item.type === 'discord')) {
      try {
        const discordRoles = await useDiscordStore().getDiscordRoleAction(task.task.project.id);
        const discordData = discordRoles.find((item) => item.id === isDiscordExist.value);

        rewardsArray.value.push({
          rewardString: discordData.name,
          icon: 'Discord-Circle',
          type: 'discord',
        });
      } catch (error) {
        console.log('DISCORD ERROR', error);
        rewardsArray.value.push({
          rewardString: 'Discord role',
          icon: 'Discord-Circle',
          type: 'discord',
        });
      }
    }
  }
};

const isPdf = (file) => {
  return file.mime_type.indexOf('pdf') !== -1;
};

const hasHtml = (value) => {
  const regex = /(<([^>]+)>)/gi;
  return regex.test(value);
};

onMounted(async () => {
  if (route.params.id) {
    await tasksStore.getUserTaskAction(route.params.id).catch((e) => (showErrorModal.value = true));
  }
});

</script>

<style lang="scss" scoped>
.social-driver_title {
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 24px;
  font-feature-settings: 'zero' on;
  color: $section-title;
}
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
.reject-btns {
  display: flex;
  gap: 16px;
}
.approve-btn_wrapper {
  width: 160px;
  height: 40px;
  margin-top: 30px;
}
.approve-task-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px;
  gap: 24px;
  &_title {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 24px;
    line-height: 40px;
    color: #1a1d29;
  }
  &_subtitle {
    width: 336px;
    height: 48px;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;

    display: flex;
    align-items: center;
    text-align: center;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: #1a1d29;
  }
}
.working-talents-card-review {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px;
  gap: 24px;

  width: 360px;
  height: fit-content;

  background: $white;

  border: 1px solid $default-border;
  border-radius: 16px;

  &_main-card-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  &_title {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    line-height: 24px;
    font-feature-settings: 'zero' on;
    color: $secondary;
  }
  &_users {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  &_user {
    width: fit-content;
    height: 40px;
    background: $white;
    padding: 8px 12px;

    border: 1px solid $default-badge-border;
    border-radius: 8px;
  }
  &_btn {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 4px 12px;
    gap: 8px;
    width: 139px;
    height: 32px;
    background: $transparent-active-bg;
    border-radius: 8px;
    cursor: pointer;

    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    font-feature-settings: 'zero' on;
    color: $secondary;
  }
}
.main-task-data {
  display: flex;
  flex-direction: column;
  gap: 40px;
}
.task-sidebar-review-card_reward-amount {
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 400;
  font-size: 32px;
  line-height: 40px;
  font-feature-settings: 'zero' on;
  color: $section-title;
}
.task-sidebar-review-card_reward {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.task-sidebar-review-card_title {
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 24px;
  font-feature-settings: 'zero' on;
  color: $secondary;
  &_wrapper {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.task-sidebar-card_subtitle {
  display: flex;
  align-items: center;
  padding: 2px 5px;
  border-radius: 6px;
  border: 1px solid #eaeafb;
  background: #f5f5fd;

  color: #38405b;
  font-variant-numeric: lining-nums tabular-nums slashed-zero;
  font-family: Basis Grotesque Pro;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
}
.task-sidebar-review-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 16px;
  gap: 24px;
  isolation: isolate;

  width: 360px;
  min-height: 120px;
  height: fit-content;

  background: $white;

  border: 1px solid #dad9f7;
  border-radius: 16px;
}
.task-images {
  display: flex;
  gap: 16px;
}
.task-img {
  width: 120px;
  height: 120px;
  background: #eaeafb;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: $secondary;
  img {
    width: 100%;
    height: 100%;
  }
}
.task-content {
  width: 712px;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 32px;
  hanging-punctuation: first last;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on, 'ordn' on, 'ss04' on;
  color: $section-title;

  // &.list {
  //   padding-left: 22px;
  // }

  // &.html {
  //   padding-left: 20px;
  // }
  // ul,
  // ol,
  // menu {
  //   list-style: disc !important;
  //   list-style-type: disc !important;
  // }
}
.task-priority {
  display: flex;
  align-items: center;
  gap: 5px;
  border: 1px solid $default-border;
  border-radius: 6px;
  padding: 0 5px;

  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  text-align: right;
  letter-spacing: 0.014em;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  color: #38405b;
}
.task-date {
  display: flex;
  align-items: center;
  gap: 5px;
  color: $section-title;
}
.task-info_wrapper {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.task-info {
  display: flex;
  gap: 8px;
}
.task_wrapper {
  width: 1160px;
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin: 0 auto;
}
.task-name {
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 350;
  font-size: 56px;
  line-height: 72px;
  font-feature-settings: 'zero' on;
  color: $section-title;
}
.task-body {
  width: 100%;
  display: flex;
  gap: 40px;
  margin-bottom: 40px;
}
.task-data {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px;
  gap: 24px;

  width: 760px;
  height: fit-content;
  background: $white;

  border: 1px solid $default-border;
  border-radius: 16px;
}
.task-sidebar-review {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 360px;
  width: 100%;
  height: 100%;
}
.working-talents-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px;
  gap: 24px;

  width: 360px;
  // min-height: 416px;
  height: fit-content;

  background: $white;

  border: 1px solid $default-border;
  border-radius: 16px;
  &_main-card-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  &_title {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    line-height: 24px;
    font-feature-settings: 'zero' on;
    color: $secondary;
  }
  &_users {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  &_user {
    width: fit-content;
    height: 40px;
    background: $white;
    padding: 8px 12px;

    border: 1px solid $default-badge-border;
    border-radius: 8px;
  }
  &_btn {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 4px 12px;
    gap: 8px;
    width: 139px;
    height: 32px;
    background: $transparent-active-bg;
    border-radius: 8px;
    cursor: pointer;

    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    font-feature-settings: 'zero' on;
    color: $secondary;
  }
}
.task-sidebar-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 16px;
  gap: 5px;

  width: 360px;
  min-height: 120px;
  height: fit-content;

  background: $white;

  border: 1px solid $default-border;
  border-radius: 16px;
  .on-chain-btns {
    display: flex;
    gap: 16px;
    width: 100%;
    margin-top: 32px;

    .clear {
      display: block;
      width: 50%;
      padding-top: 4px;
      padding-bottom: 4px;
      text-align: center;
      border-radius: 8px;
      color: #6a6d8f;
    }

    .apply {
      width: 50%;
      padding-top: 4px;
      padding-bottom: 4px;
      text-align: center;
      border-radius: 8px;
      display: block;
      background-color: #dad9f7;
      color: #000;
    }
  }

  .conditions-container {
    width: 100%;

    & > .custom-select-condition {
      padding-left: 8px;
    }
  }

  .conditions-container.edit {
    position: relative;
    z-index: 17;
    margin-top: 16px;

    .custom-select-condition {
      background-color: #eaeafb;
      outline: none;
    }

    .custom-select-condition.open {
      background-color: #fff;
      outline: 1px solid #dad9f7;
    }
  }

  .condition-setting {
    background-color: #eaeafb;
    padding: 16px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 16px;

    &-title {
      color: #6a6d8f;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 24px;
    }

    &-item {
      width: 100%;

      &-title {
        margin-bottom: 8px;
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: 142.857%;
        color: #1a1d29;
      }

      .blockchain-select {
        position: relative;

        &-icon {
          position: absolute;
          height: 100%;
          left: 0;
          width: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 20;
          border-right: 1px solid #dad9f7;
          border-radius: 8px 0 0 8px;
          background-color: #dad9f7;
          top: 0;

          & > svg {
            display: inline-block;
          }
        }
      }
    }
  }

  &_header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    position: relative;
    z-index: 2000;

    &.participants {
      margin-bottom: 0;
    }
  }

  &.participants {
    gap: 16px;
  }
}
.task-sidebar-card_title {
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 24px;
  font-feature-settings: 'zero' on;
  color: $secondary;

  // margin-bottom: 20px;
  &.participants {
    margin-bottom: 0;
  }
}

.task-sidebar-card_title.gate {
  display: flex;
  width: 100%;
  justify-content: space-between;

  .custom-condition-select {
    .selected {
      width: 140px;
    }

    .items {
      width: 160px;
    }
  }
}
.gate-condition-wr {
  width: 100%;
}
.html {
  word-break: break-word;
}
</style>

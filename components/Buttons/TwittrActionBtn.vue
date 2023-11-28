<template>
  <div class="twitter-action-btn">
    <div class="twitter-action-btn_main" :class="{ disabled: isDisabled }" @click="handleAction">
      <Icon v-if="iconName && iconName === 'Twitter-Default'" :name="iconName" :size="26" />
      <img v-else :src="getTweeterIcon(iconName)" alt="" />
      <span>{{ title }}</span>
    </div>
    <!-- <div
      v-if="!isDisabled"
      class="twitter-action-btn_secondary"
      :class="{ checked: isVeryfied || isLocalVeryfied }"
      @click="checkVerification"
    >
      <Icon class="checked-icon" name="Tik" :size="24" v-if="isVeryfied || isLocalVeryfied" />
      <span class="loading-text" v-else-if="isLoading">
        <span class="loading-dots">
          <span class="loading-dot">.</span>
          <span class="loading-dot">.</span>
          <span class="loading-dot">.</span>
        </span>
      </span>
      <div v-else-if="isVerifyBtnDisabled">{{ time }}</div>
      <span v-else>Verify</span>
    </div> -->
  </div>
</template>

<script setup>
import { ref } from 'vue';
import likeLogo from '@/assets/icons/tweeter/Like.svg';
import replyLogo from '@/assets/icons/tweeter/Reply.svg';
import retweetLogo from '@/assets/icons/tweeter/Retweet.svg';
import { useTasksStore } from '~/store/tasks';
import { useRouter } from 'vue-router';

const route = useRoute();
const tasksStore = useTasksStore();

const isLoading = ref(false);
const isVerifyBtnDisabled = ref(false);
const time = ref(10);
const isLocalVeryfied = ref(false);

const props = defineProps({
  title: { type: String, default: '' },
  isDisabled: { type: Boolean, default: false },
  isVeryfied: { type: Boolean, default: false },
  iconName: { type: String, default: 'Twitter-Default' },
  type: { type: String, default: '' },
  extraParameter: { type: String, default: '' },
});

const emit = defineEmits(['action']);

const checkVerify = async () => {
  const verifyData = await tasksStore.setUserTaskVerificationAction(route.params.id, type);
  console.log('verifyData', verifyData);
};

const getTweeterIcon = (name) => {
  switch (name) {
    case 'like':
      return likeLogo;
    case 'reply':
      return replyLogo;
    case 'retweet':
      return retweetLogo;

    default:
      return '';
  }
};

const countDown = () => {
  time.value -= 1;
  return time.value;
};

const handleAction = () => {
  if (props.isDisabled || props.isVeryfied || isLocalVeryfied.value) return;
  else emit('action');
};

const checkVerification = async () => {
  try {
    if (isVerifyBtnDisabled.value || props.isVeryfied || isLocalVeryfied.value) return;
    isLoading.value = true;
    let verifyData;
    if (props.extraParameter) {
      verifyData = await tasksStore.setUserTaskVerificationAction(
        route.params.id,
        props.type,
        props.extraParameter,
      );
    } else {
      verifyData = await tasksStore.setUserTaskVerificationAction(route.params.id, props.type);
    }
    console.log('verifyData', verifyData);
    isLoading.value = false;
    isVerifyBtnDisabled.value = true;
    if (verifyData && verifyData.result) {
      isLocalVeryfied.value = true;
      isVerifyBtnDisabled.value = false;
      return;
    }
    if (!verifyData || (verifyData && !verifyData.result)) {
      time.value = 10;
      let interval = setInterval(() => {
        clearInterval(interval);
        countDown();
      }, 1000);
      setTimeout(() => {
        // time.value = 10;
        clearInterval(interval);
        isVerifyBtnDisabled.value = false;
      }, 10000);
    }
  } catch (error) {
    console.log('checkVerification error', error);
    isVerifyBtnDisabled.value = false;
    isLoading.value = false;
  }

  setTimeout(() => {
    isLoading.value = false;
    isVerifyBtnDisabled.value = true;
    let interval = setInterval(() => {
      countDown();
    }, 1000);
    setTimeout(() => {
      time.value = 10;
      clearInterval(interval);
      isVerifyBtnDisabled.value = false;
    }, 10000);
  }, 1000);
};

watch(isVerifyBtnDisabled, (value) => {
  console.log('isVerifyBtnDisabled', value);
});
</script>

<style lang="scss" scoped>
loading-dots {
  position: absolute;
  bottom: 0;
  left: 100%;
  display: inline-block;
  letter-spacing: 2px;
  margin-left: 5px;
}

.loading-dot:nth-child(1) {
  animation: loadingAnimation 3s infinite;
  animation-delay: 0s;
}
.loading-dot:nth-child(2) {
  animation: loadingAnimation2 3s infinite;
  animation-delay: 0s;
}
.loading-dot:nth-child(3) {
  animation: loadingAnimation3 3s infinite;
  animation-delay: 0s;
}

@keyframes loadingAnimation {
  0%,
  20% {
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
  60% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
}
@keyframes loadingAnimation2 {
  0%,
  20% {
    opacity: 0;
  }
  40% {
    opacity: 0;
  }
  60% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
}
@keyframes loadingAnimation3 {
  0%,
  20% {
    opacity: 1;
  }
  40% {
    opacity: 0;
  }
  60% {
    opacity: 0;
  }
  80% {
    opacity: 1;
  }
}
.checked-icon {
  filter: invert(99%) sepia(100%) saturate(2%) hue-rotate(117deg) brightness(105%) contrast(101%);
}
.twitter-action-btn {
  display: flex;
  gap: 2px;
  width: 100%;

  color: $default;
  font-variant-numeric: lining-nums tabular-nums slashed-zero;
  font-family: Basis Grotesque Pro;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  &_main {
    display: flex;
    padding: 7px 16px;
    align-items: center;
    gap: 8px;

    width: 100%;
    height: 40px;
    border-radius: 8px 0px 0px 8px;

    cursor: pointer;

    background: #dad9f7;
    &.disabled {
      color: #6a6d8f;
      border-radius: 8px;
      background: #eaeafb;
    }
  }
  &_secondary {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80px;
    height: 40px;
    border-radius: 0px 8px 8px 0px;
    background: #dad9f7;
    cursor: pointer;
    &.checked {
      background: #38405b;
    }
    &.disabled {
      color: #6a6d8f;
      background: #eaeafb;
    }
  }
}
</style>

<template>
  <div class="card">
    <div class="card-bg" :style="`background-image: url(${bg ? bg : `${defaultBg}`})`"></div>
    <div class="project-token" :class="{ 'logo-active': logo }">
      <img v-if="logo" :src="logo" alt="" />
      <img v-else src="@/assets/icons/project/eth.svg" alt="" />
    </div>
    <div class="content">
      <div class="project">
        {{ role ? role : '' }}
      </div>
      <div class="name">
        {{ type === 'small' ? reduceStringLength(protocol, 18) : protocol }}
      </div>

      <div class="cards" v-if="created_tasks || reviewed_tasks || overdue_tasks">
        <div class="card">
          <span class="value">{{ created_tasks }}</span>
          <span class="info">created tasks</span>
        </div>
        <div class="card">
          <span class="value">{{ reviewed_tasks }}</span>
          <span class="info">reviewed tasks</span>
        </div>
        <div class="card">
          <span class="value">{{ overdue_tasks }}</span>
          <span class="info">overdue tasks</span>
        </div>
      </div>
      <icon icon="Right-Arrow" :size="24" class="redirect"></icon>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import defaultBg from '@/assets/images/default-avatar.png';
import windowSizeMixin from '@/mixins/windowSizeMixin';
import { reduceStringLength } from '@/util/helpers';
import { useUserStore } from '~/store/user';
import Icon from '../Icon';

const userStore = useUserStore();

const role = computed(() => {
  const userRoles = userStore.userRoles;
  if (userRoles && userRoles.length && userRoles[0].name) {
    return userRoles[0].name;
  }
  return null;
});

const props = defineProps({
  bg: { type: String },
  logo: { type: String, default: '' },
  protocol: { type: String, default: 'Oasis protocol' },
  type: String,
  created_tasks: String,
  overdue_tasks: String,
  reviewed_tasks: String,
});

const { windowWidth, windowHeight, isMobile } = windowSizeMixin;
</script>

<style scoped lang="scss">
.card {
  position: relative;
  background: $white;
  max-width: 760px;
  width: 100%;
  border: 1px solid $default-border;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  .project-token {
    position: absolute;
    width: 32px;
    height: 32px;
    left: 24px;
    top: 24px;
    background: #f5f5fd;
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 32px;
      height: 32px;
      border-radius: 24px;
    }
    &.logo-active {
      background-color: transparent;
    }
  }
  &.small {
    height: fit-content;
    max-width: 360px;
    min-height: 256px;
    align-items: flex-start;
    .content {
      padding: 0 16px;
    }
  }
  .card-bg {
    background-repeat: no-repeat;
    background-size: cover;
    height: 160px;
    width: 100%;
    overflow: hidden;
    &::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 160px;
      top: 0;
      left: 0;
      right: 0;
      background: linear-gradient(0deg, rgba(0, 0, 0, 0.48) 0%, rgba(0, 0, 0, 0) 100%);
    }
    &.small {
      height: 136px;
      &::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 136px;
        top: 0;
        left: 0;
        right: 0;
        background: linear-gradient(0deg, rgba(0, 0, 0, 0.48) 0%, rgba(0, 0, 0, 0) 100%);
      }
    }
  }
  .avatar {
    border: 2px solid $white;
    border-radius: 100%;
    margin: -40px auto 16px;
    width: 90px;
    height: 90px;
  }
  .content {
    padding: 0 14px;
    margin-bottom: 16px;
    flex-direction: column;
    margin-right: auto;
    .project {
      position: absolute;
      top: 148px;
      left: 40px;
      background: #f5f5fd;
      border: 1px solid #eaeafb;
      border-radius: 6px;
      padding: 5px 8px;
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      letter-spacing: 0.014em;
      font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
      color: $default;
      z-index: 1000;
      &.small {
        top: 124px;
        left: 15px;
      }
    }
    .name {
      position: absolute;
      top: 90px;
      left: 25px;
      padding: 10px 16px 0 16px;
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 400;
      font-size: 32px;
      line-height: 40px;
      color: $white;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      &.small {
        top: 60px;
        left: 5px;
      }
    }
    .desc {
      max-width: 704px;
      height: 72px;
      position: relative;
      overflow: hidden;
      text-overflow: ellipsis;
      z-index: 10;
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
      color: $default;
      margin-top: 30px;
      padding-left: 14px;
      &.small {
        display: none;
      }
    }
    .tags {
      margin-top: 16px;
      display: flex;
      justify-content: flex-start;
      align-content: center;
      flex-wrap: wrap;
      gap: 4px;
      padding-left: 14px;
      &.small {
        margin-top: 30px;
        padding-left: 0;
      }
    }
  }
  .cards {
    display: flex;
    margin-top: 32px;
    gap: 8px;
    .card {
      width: 110px;
      height: 64px;
      background: $default-bg;
      border: 1px solid $default-badge-border;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 10px 12px;
      gap: 2px;
      isolation: isolate;
      .value {
        font-family: 'Basis Grotesque Pro';
        font-style: normal;
        font-weight: 500;
        font-size: 18px;
        line-height: 24px;
        font-feature-settings: 'zero' on;
        color: $default;
      }
      .info {
        font-family: 'Basis Grotesque Pro';
        font-style: normal;
        font-weight: 500;
        font-size: 12px;
        line-height: 16px;
        letter-spacing: 0.014em;
        font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
        color: $default;
      }
    }
  }
  .redirect {
    cursor: pointer;
    position: absolute;
    bottom: 0;
    right: 0;
    margin-right: 15px;
    margin-bottom: 15px;
  }
}
</style>

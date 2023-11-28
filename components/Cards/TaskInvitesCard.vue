<template>
  <div class="task-social-card" :class="{ small: type === 'small' || windowWidth < 830 }">
    <div
      class="card-bg"
      :style="`background-image: url(${bg ? bg : `${defaultBg}`})`"
      :class="{ small: type === 'small' || windowWidth < 830 }"
    ></div>

    <div class="project-token" :class="{ 'logo-active': logo }">
      <img v-if="logo" :src="logo" alt="" />
      <img v-else src="@/assets/icons/project/eth.svg" alt="" />
    </div>
    <div class="content">
      <div class="name" :class="{ small: type === 'small' || windowWidth < 830 }">
        {{ type === 'small' ? reduceStringLength(protocol, 18) : protocol }}
      </div>
      <div
        v-if="description"
        class="desc"
        :class="{ small: type === 'small' || windowWidth < 830 }"
      >
        {{
          reduceStringLength(
            description
              .replace(/<[^>]*>/g, '')
              .split('_')
              .join(' '),
            264,
          )
        }}
      </div>
      <div
        v-if="tags && tags.length"
        class="tags"
        :class="{ small: type === 'small' || windowWidth < 830 }"
      >
        <badge v-for="tag in tags" :key="tag.id" :text="tag.tag.name" type="transparent"></badge>
      </div>

      <div
        v-if="status === 'in_progress' || status === 'finished'"
        class="task-social-card_line"
      ></div>
      <div v-if="status === 'in_progress' || status === 'finished'" class="task-social-card_title">
        Your Referral Link
      </div>
      <div v-if="status === 'in_progress' || status === 'finished'" class="task-social-card_info">
        <div class="social-link_btns">
          <div class="social-link">
            <div class="rework-modal_user-card_text">
              http://talentum.id/ba022kOCv1wcvs90-s0favb
            </div>
            <Icon name="Copy" :size="24" />
          </div>
          <div class="socials">
            <span>
              <Icon name="Telegram-Default" :size="26" />
            </span>
            <span>
              <Icon name="Twitter-Default" :size="26" />
            </span>
            <span>
              <Icon name="Discord-Default" :size="26" />
            </span>
          </div>
        </div>
        <div class="social-link_invited">
          <div class="social-link_invited-title">Invited Talents</div>
          <div v-if="task" class="social-link_invited-data">
            <Icon name="Talents" :size="26" />
            {{ task.number_of_invites }} /
            {{
              +task.number_of_participants > 0
                ? task.number_of_participants
                : task.number_of_winners
            }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import defaultBg from '@/assets/images/default-avatar.png';
import windowSizeMixin from '@/mixins/windowSizeMixin';
import { reduceStringLength } from '@/util/helpers';
import { useUserStore } from '~/store/user';

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
  task: { type: Object, default: null },
  logo: { type: String, default: '' },
  protocol: { type: String, default: 'Oasis protocol' },
  status: { type: String, default: '' },
  description: String,
  tags: Array,
  type: String,
});

const { windowWidth, windowHeight, isMobile } = windowSizeMixin;
</script>

<style scoped lang="scss">
.task-social-card_info {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}
.social-link_invited {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  height: 80px;
  width: 200px;
  border-radius: 8px;
  border: 1px solid $default-border;
  padding-right: 10px;
  &-title {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    font-feature-settings: 'zero' on;
    color: #6a6d8f;
  }
  &-data {
    display: flex;
    align-items: center;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 32px;
    line-height: 40px;
    font-feature-settings: 'zero' on;
    color: #38405b;
    gap: 10px;
    svg {
      margin-bottom: 4px;
    }
  }
}
.social-link_btns {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.socials {
  display: flex;
  align-items: center;
  gap: 16px;
  span {
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: $default-border;
    border-radius: 8px;
  }
}
.task-social-card_title {
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 24px;
  font-feature-settings: 'zero' on;
  color: $default;
  margin-bottom: 16px;
}
.task-social-card_line {
  margin-top: 30px;
  width: 100%;
  height: 1px;
  background: $default-border;
  margin-bottom: 20px;
}
.social-link {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 16px 8px 12px;
  gap: 8px;
  width: fit-content;
  height: 40px;
  background: $white;
  border: 1px solid #dad9f7;
  border-radius: 6px;

  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  font-feature-settings: 'zero' on;
  color: #38405b;
}
.task-social-card {
  position: relative;
  background: $white;
  max-width: 760px;
  min-height: 336px;
  height: fit-content;
  width: 100%;
  border: 1px solid $default-border;
  border-radius: 16px;
  background: #f5f5fd;
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
      display: flex;
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
    width: 100%;
    display: flex;
    gap: 24px;
    padding: 0 14px;
    margin-bottom: 16px;
    flex-direction: column;
    .project {
      position: absolute;
      top: 148px;
      left: 40px;
      background: #f5f5fd;
      border: 1px solid #eaeafb;
      border-radius: 6px;
      padding: 3px 8px;
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;
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
      left: 15px;
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
      position: relative;
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
      overflow: hidden;
      display: block;
      text-overflow: ellipsis;
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
      gap: 8px;
      padding-left: 14px;
      &.small {
        margin-top: 30px;
        padding-left: 0;
      }
    }
  }
}
</style>

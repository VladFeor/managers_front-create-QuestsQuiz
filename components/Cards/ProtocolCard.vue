<template>
  <div class="card" :class="{ small: type === 'small' || windowWidth < 830 }">
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
      <div class="project" :class="{ small: type === 'small' || windowWidth < 830 }">
        {{ role ? role : '' }}
      </div>
      <div class="name" :class="{ small: type === 'small' || windowWidth < 830 }">
        {{ type === 'small' ? reduceStringLength(protocol, 18) : protocol }}
      </div>
      <div
        v-if="description"
        class="desc"
        :class="{ small: type === 'small' || windowWidth < 830 }"
      >
        {{ description.replace(/<[^>]*>/g, '') }}
      </div>
      <div
        v-if="tags && tags.length"
        class="tags"
        :class="{ small: type === 'small' || windowWidth < 830 }"
      >
        <badge
          v-for="tag in tags.slice(0, 9)"
          :key="tag.id"
          :text="tag.tag.name"
          type="transparent"
        ></badge>
        <badge v-if="tags.length > 9" :text="`+${tags.length - 9}`" type="transparent"></badge>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import defaultBg from '@/assets/images/def-cover-project.svg';
import windowSizeMixin from '@/mixins/windowSizeMixin';
import { reduceStringLength } from '@/util/helpers';
import { useUserStore } from '~/store/user';

const userStore = useUserStore();

const role = computed(() => {
  console.log(props.protocol, 12321321312);
  const userRoles = userStore.getProfile.project_members.find(
    (item) => item.project.name === props.protocol,
  );
  if (userRoles && userRoles.role) {
    return userRoles.role.name;
  }
  return null;
});

const props = defineProps({
  bg: { type: String },
  logo: { type: String, default: '' },
  protocol: { type: String, default: 'Oasis protocol' },
  description: String,
  tags: Array,
  type: String,
});

const { windowWidth, windowHeight, isMobile } = windowSizeMixin;
</script>

<style scoped lang="scss">
.card {
  position: relative;
  background: $white;
  height: 336px;
  width: 100%;
  border: 1px solid $default-border;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 336px;
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
    max-width: 350px;
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
    padding: 0 28px;
    flex-direction: column;
    width: 100%;
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
      z-index: 96;
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
      margin-top: 20px;
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
}
</style>

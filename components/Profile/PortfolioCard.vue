<template>
  <div class="portfolio">
    <a
      v-for="(source, index) in state.localSources"
      :key="index"
      :href="isURL(source.link) ? source.link : `https://${source.link}`"
      target="_blank"
      class="info"
    >
      <div><img :src="source.icon" width="40" height="40" /></div>
      <div class="source">
        <div class="flex justify-between w-full text-[#38405B]">
          {{ reduceStringLength(source.link, 40) }}
        </div>
        <span class="social-name mt-2">
          {{ source.linkName }}
        </span>
      </div>
    </a>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { reduceStringLength } from '~/util/helpers';
const props = defineProps({
  sources: {
    type: Array,
    default: () => [],
  },
});
const state = ref({
  localSources: [...props.sources],
  defImg: 'https://catapultdevspace.fra1.digitaloceanspaces.com/develop/link-icons/82/internet.svg',
});
watch(
  () => props.sources,
  () => {
    state.localSources = [...props.sources];
  },
);

function isURL(str) {
  const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/\S*)?$/i;
  return urlPattern.test(str) && !str.startsWith('www');
}
</script>

<style scoped lang="scss">
.portfolio {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;

  .info {
    width: 100%;
    height: auto;
    background: $default-bg;
    border: 1px solid #8dafeb;
    display: flex;
    padding: 16px;
    border-radius: 8px;
    .close {
      width: 24px;
      height: 24px;
      padding: 6px;
      display: flex;
      align-items: center;
      margin-right: -14px;
      margin-top: -14px;
      &:hover {
        background: $default-badge-border;
        border-radius: 6px;
      }
    }

    .source {
      margin-left: 16px;
      display: flex;
      width: 100%;
      flex-direction: column;
      justify-content: space-between;
      .title {
        font-family: 'Basis Grotesque Pro';
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
        height: 24px;

        font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
        color: $default;
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
  .add {
    width: calc(50% - 8px);
    height: 104px;
    background: $default-bg;
    border: 1px dashed $default-border;
    border-radius: 8px;
    .icon {
      position: relative;
      left: calc(50% - 16px);
      top: calc(50% - 16px);
    }
  }
  .new-item {
    background: $white;
    width: calc(50% - 8px);
    height: 104px;
    border: 1px solid $default-badge-border;
    border-radius: 8px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
      .title {
        font-family: 'Basis Grotesque Pro';
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
        font-feature-settings: 'zero' on;
        color: $section-title;
      }
    }
    input {
      background: $white;
      padding: 4px 8px;
      border: 1px solid $default-badge-border;
      border-radius: 8px;
      outline: none;
      color: $section-title;
      &::placeholder {
        font-family: 'Basis Grotesque Pro';
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
        font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
        color: $colabs-bg;
        border-radius: 8px;
      }
    }
  }
}
</style>

<template>
  <div class="main">
    <input
      type="file"
      @change="handleFileUpload"
      ref="fileInput"
      style="display: none"
      accept="image/*"
    />
    <div v-if="!banner && !image" class="default-block">
      <div class="add-image"><Icon icon="Create" :size="24" @click="uploadImage" /></div>
    </div>
    <div v-else class="background-block" :style="{ backgroundImage: `url(${image || banner})` }">
      <div class="controllers">
        <div class="controller"><Icon icon="Edit" :size="24" @click="uploadImage" /></div>
        <div class="controller"><Icon icon="Cancel" :size="24" @click="removeImage" /></div>
      </div>
    </div>
  </div>
</template>

<script>
import AxiosService from '~/service/axiosService';
import { useUserStore } from '~/store/user';
import { useNuxtApp } from '#app';

export default {
  name: 'BannerUploader',
  data() {
    return {
      hover: false,
      noImage: true,
      image: null,
    };
  },
  props: {
    banner: {
      type: String,
      default: '',
    },
  },
  methods: {
    handleFileUpload() {
      const file = this.$refs.fileInput.files[0];

      const maxSizeInMB = 10;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

      if (file.size > maxSizeInBytes) {
        useNuxtApp().$alert.show('the file is too large, max file size is 10 MB', {
          type: 'error',
          timeout: 5000,
        });
        return;
      }
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.image = e.target.result;
          this.noImage = false;
          AxiosService.put(
            useRuntimeConfig().public.apiBaseV2 + 'profile/update-media/banner',
            { image: file },
            true,
          ).then(() => {
            useUserStore().userInfo();
            window.dataLayer.push({
              event: 'project_profile_update',
            });
          });
        };
        reader.readAsDataURL(file);
      }
    },
    uploadImage() {
      this.$refs.fileInput.click();
    },
    removeImage() {
      this.image = null;
      this.noImage = true;
      AxiosService.delete(useRuntimeConfig().public.apiBaseV2 + 'profile/delete-media/banner').then(
        () => {
          useUserStore().userInfo();
          window.dataLayer.push({
            event: 'project_profile_update',
          });
        },
      );
    },
  },
};
</script>

<style scoped lang="scss">
.main {
  width: 100vw;
  height: 260px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 0;
  .default-block {
    background: url('@/assets/images/default-back.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    width: 100%;
    height: 100%;
    .add-image {
      display: none;
    }
    &:hover {
      cursor: pointer;
      .add-image {
        display: flex;
        align-items: center;
        padding: 4px;
        position: absolute;
        right: 0;
        bottom: 0;
        margin-bottom: 32px;
        margin-right: 42px;
        width: 32px;
        height: 32px;
        background: $default-bg;
        border-radius: 24px;
        &:hover {
          background: $default-border;
          cursor: pointer;
        }
      }
    }
  }
  .background-block {
    background: url('@/assets/images/default-back.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    width: 100%;
    height: 100%;
    .controllers {
      display: none;
    }
    &:hover {
      cursor: pointer;
      .controllers {
        display: flex;
        align-items: center;
        gap: 16px;
        position: absolute;
        right: 0;
        bottom: 0;
        margin-bottom: 32px;
        margin-right: 42px;
        .controller {
          display: flex;
          align-items: center;
          padding: 4px;
          width: 32px;
          height: 32px;
          background: $default-bg;
          border-radius: 24px;
          &:hover {
            background: $default-border;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>

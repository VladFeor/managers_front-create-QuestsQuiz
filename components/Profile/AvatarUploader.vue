<template>
  <div class="main">
    <input
      type="file"
      @change="handleFileUpload"
      ref="fileInput"
      style="display: none"
      accept="image/*"
    />
    <div class="default-avatar" v-if="!avatar && !newAvatar" @click="uploadAvatar">
      <Icon class="controller" icon="Create" :size="24"></Icon>
    </div>
    <div class="avatar" v-else :style="{ backgroundImage: `url(${newAvatar || avatar})` }">
      <div class="overlay"></div>
      <div class="controllers">
        <Icon class="controller" icon="Edit" :size="32" @click="uploadAvatar"></Icon>
        <Icon class="controller" icon="Cancel" :size="32" @click="removeAvatar"></Icon>
      </div>
    </div>
  </div>
</template>

<script>
import AxiosService from '~/service/axiosService';
import { useUserStore } from '~/store/user';
import { useNuxtApp } from '#app';
export default {
  name: 'AvatarUploader',
  data() {
    return {
      noAvatar: true,
      newAvatar: null,
    };
  },
  props: {
    avatar: {
      type: String,
      default: '',
    },
  },
  methods: {
    uploadAvatar() {
      this.$refs.fileInput.click();
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      const maxSizeInMB = 10;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        useNuxtApp().$alert.show('the file is too large, max file size is 10 mb', {
          type: 'error',
          timeout: 5000,
        });
        return;
      }
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.newAvatar = e.target.result;
          this.noAvatar = false;
        };
        reader.readAsDataURL(file);
      }
      AxiosService.put(
        useRuntimeConfig().public.apiBaseV2 + 'profile/update-media/avatar',
        { image: file },
        true,
      ).then(() => {
        useUserStore().userInfo();
        window.dataLayer.push({
          event: 'project_profile_update',
        });
      });
      event.target.value = null;
    },
    removeAvatar() {
      this.newAvatar = null;
      this.noAvatar = true;
      AxiosService.delete(useRuntimeConfig().public.apiBaseV2 + 'profile/delete-media/avatar').then(
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
.controller {
  display: flex;
  align-items: center;
  padding: 4px;
  width: 32px;
  height: 32px;
  border-radius: 24px;
  &:hover {
    background: $default-border;
    cursor: pointer;
  }
}

.main {
  border-radius: 100px;
  border: 3px solid $default-bg;
  background: $default-badge-border;
  z-index: 97;
  .default-avatar {
    background: url('@/assets/images/default-avatar.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    display: flex;
    height: 160px;
    width: 160px;
    border-radius: 100px;
    align-items: center;
    * {
      margin: 0 auto;
    }
    &:hover {
      cursor: pointer;
    }
  }
  .avatar {
    background: url('@/assets/images/default-avatar.png');
    background-repeat: no-repeat;
    background-size: cover;
    display: flex;
    height: 160px;
    width: 160px;
    align-items: center;
    border-radius: 100px;
    .overlay,
    .controllers {
      display: none;
    }
    &:hover {
      border-radius: 100px;
      cursor: pointer;
      .overlay {
        display: block;
        position: absolute;
        height: 160px;
        width: 160px;
        padding: 3px;
        border-radius: 100px;
        background: rgba($black, 0.5);
        z-index: 0;
      }
      .controllers {
        display: flex;
        z-index: 1;
        gap: 10px;
        align-items: center;
        margin: 0 auto;
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

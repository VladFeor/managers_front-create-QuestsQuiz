<template>
  <input
    :key="fileKey"
    type="file"
    v-on:input="handleFileUpload"
    ref="fileInput"
    style="display: none"
    accept="image/*"
  />

  <div class="avatar-uploader">
    <div
      :class="`avatar bg-profile relative ${
        !logo && !imageUrl && 'bg-profile-default cursor-pointer'
      }`"
      :style="{ backgroundImage: `url(${imageUrl || logo})` }"
      @mouseover="showLogoEditActions = true"
      @mouseleave="showLogoEditActions = false"
      @click="!logo && !imageUrl && uploadAvatar()"
    >
      <Icon
        class="absolute top-16.5 left-16.5"
        v-if="!logo && !imageUrl && !isPM"
        name="Create"
        size="24"
      />
      <div
        class="cover flex items-center justify-center"
        v-if="showLogoEditActions && (logo || imageUrl) && !isPM"
      >
        <Icon
          class="cursor-pointer bg-white rounded-full p-1"
          icon="Edit"
          @click="uploadAvatar"
          :size="24"
        ></Icon>
        <Icon
          class="cursor-pointer bg-white rounded-full p-1 ml-2.5"
          icon="Cancel"
          :size="24"
          @click.stop="removeAvatar"
        ></Icon>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileKey: 0,
      imageUrl: '',
      imageData: null,
      showLogoEditActions: null,
    };
  },
  props: ['logo', 'uploaderClass', 'isPM'],
  methods: {
    uploadAvatar() {
      if (!this.isPM) this.$refs.fileInput.click();
    },
    removeAvatar() {
      this.fileKey++;
      this.imageUrl = '';
      this.imageData = null;
      this.$emit('removeFile');
    },
    handleFileUpload(event) {
      console.log(event);

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

      this.imageUrl = URL.createObjectURL(file);
      this.imageData = file;

      this.$emit('setFile', { data: this.imageData, url: this.imageUrl });
    },
  },
};
</script>

<style scoped>
.avatar-uploader {
  width: 155px;
  height: 155px;
}
.avatar-uploader .avatar {
  width: 155px;
  height: 155px;
  display: block;
  border-radius: 15px;
}
.cover {
  background: rgba(0, 0, 0, 0.5);
  border-radius: 15px;
  width: 100%;
  height: 100%;
}

.bg-profile {
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  border-radius: 15px;
}

.bg-profile-default {
  background: url('@/assets/images/Project-Avatar.svg') no-repeat center !important;
}
</style>

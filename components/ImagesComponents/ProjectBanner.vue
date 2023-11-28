<template>
  <el-upload
    :class="`banner-uploader ${uploaderClass}`"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
    accept=".jpeg, .png, .jpg,"
    v-if="!isPM"
  >
    <Icon name="Create" size="24" />
  </el-upload>
</template>

<script setup>
import { ref } from 'vue';
import { Plus } from '@element-plus/icons-vue';
const imageUrl = ref('');
const imageData = ref(null);
const props = defineProps({
  uploaderClass: {
    type: String,
    default: '',
  },
  isPM: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(['setFile']);

const handleAvatarSuccess = (response, uploadFile) => {
  if (!props.isPM) {
    imageUrl.value = URL.createObjectURL(uploadFile.raw);
    imageData.value = uploadFile.raw;
    emits('setFile', { data: imageData, url: imageUrl });
  }
};

const beforeAvatarUpload = (rawFile) => {
  return true;
};
</script>

<style scoped>
.banner-uploader .avatar {
  width: 32px;
  height: 32px;
  display: block;
  background: white;
}
</style>

<style>
.banner-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
  width: 32px;
  height: 32px;
  background: white;
}
.banner-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.edit-project-banner-uploader .el-upload {
  width: 32px;
  height: 32px;
  border-radius: 15px;
}

.el-icon.banner-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}
</style>

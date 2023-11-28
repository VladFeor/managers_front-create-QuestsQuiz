<template>
  <div class="row-file" v-if="files.length > 0">
    <div class="file-wrapper" v-for="image in files" :key="image.id" :title="image.name">
      <img
        v-if="isPDF(image.url) !== 'pdf'"
        class="file-item"
        :src="image.url"
        alt="Image 1"
        style="height: 250px"
      />
      <div
        v-else
        class="uploaded-file-link"
        :class="{
          'uploaded-file-link--full': files.length > 1,
          'uploaded-file-link--once': files.length < 2,
        }"
      >
        <span
          class="el-upload-list__item-thumbnail uploaded-pdf-file"
          :class="{ 'uploaded-pdf-file': files.length > 1 }"
          >{{ image.name }}</span
        >
      </div>
      <div class="file-wrapper__behind-background"></div>
      <div class="file-wrapper__download-file">
        <div
          v-if="isPDF(image.url) !== 'pdf'"
          @click="zoomInImage(image.url)"
          class="file-wrapper__download-file_link"
        >
          <div class="img-icon">
            <img :src="viewIcon" alt="" />
          </div>
        </div>
        <a v-else class="file-wrapper__download-file_link" :href="image.url" target="_blank">
          <div class="img-icon">
            <img :src="viewIcon" alt="" />
          </div>
        </a>
        <div class="file-wrapper__download-file_link" @click="removeHTTPS(image.url)">
          <div class="img-icon">
            <img :src="downloadIcon" alt="" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import downloadIcon from '@/assets/icons/images/Download.svg';
import viewIcon from '@/assets/icons/images/View.svg';

const props = defineProps({
  files: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const emit = defineEmits(['zoomInImage']);

const isPDF = (url) => {
  return url.substr(url.length - 3, 3);
};

const removeHTTPS = async (url) => {
  const image = await fetch(url);
  const imageBlob = await image.blob();
  const imageURL = URL.createObjectURL(imageBlob);

  const link = document.createElement('a');
  link.href = imageURL;
  link.download = `imported_file.${isPDF(url)}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const zoomInImage = (image) => {
  emit('zoomInImage', image);
};
</script>

<style lang="scss">
.img-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f5f5fd;
}
.file-list-icon {
  filter: invert(99%) sepia(7%) saturate(23%) hue-rotate(332deg) brightness(108%) contrast(100%);
}
.row-file {
  display: flex;
  gap: 16px;
  cursor: pointer;

  //   .once-file {
  //     height: 200px;
  //     width: 200px;
  //   }
}
.file-item {
  cursor: pointer;
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.uploaded-file-link {
  width: 200px;
  height: 250px;
  background: #9289896b;
  display: block;
  position: relative;
  color: #ffffff;
  &--full {
    width: 100%;
    height: 100%;
  }
  &--once {
    width: 100%;
    height: 250px;
  }
}

.uploaded-pdf-file {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  transform: translate(-50%, -50%);
  object-fit: contain;
  color: var(--white);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  padding: 0 5px;
  height: max-content;
}

.file-wrapper {
  position: relative;
  overflow: hidden;
  width: 120px;
  height: 120px;
  background: $default-badge-border;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: $secondary;

  padding: 0;
  &:hover &__download-file {
    display: flex;
  }
  &:hover &__behind-background {
    display: block;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }
  &__behind-background {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    display: none;
  }
  &__download-file {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    align-items: center;
    width: 100%;
    height: 100%;
    justify-content: center;
    z-index: 3;
    display: none;
    &_link {
      cursor: pointer;
      &:not(last-child) {
        margin-right: 10px;
      }
    }
  }
}
</style>

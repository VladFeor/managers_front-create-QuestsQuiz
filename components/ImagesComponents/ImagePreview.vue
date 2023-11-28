<template>
  <div class="demo-image__preview">
    <ElImage
      style="width: 100px; height: 100px"
      :src="url"
      :zoom-rate="1.2"
      :preview-src-list="srcList"
      :initial-index="4"
      fit="cover"
    />
  </div>
</template>

<script setup>
import 'element-plus/dist/index.css';
import { ElImage } from 'element-plus';

const props = defineProps({
  url: { type: String, default: '' },
  srcList: { type: Array, default: [''] },
});
</script>

<style lang="scss">
.demo-image__preview {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: $secondary;
  .el-image__error,
  .el-image__inner,
  .el-image__placeholder,
  .el-image__wrapper {
    width: 120px;
    height: 120px;
  }
  .el-image {
    border-radius: 8px;
    width: 120px !important;
    height: 120px !important;
    width: 100%;
    height: 100%;
  }
}
.demo-image__error .image-slot {
  font-size: 30px;
}
.demo-image__error .image-slot .el-icon {
  font-size: 30px;
}
.demo-image__error .el-image {
  width: 100%;
  height: 100%;
  /* height: 200px; */
}
</style>

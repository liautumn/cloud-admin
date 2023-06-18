<template>
  <div>
    <img :src="imageUrl" class="img" @dblclick="imgViewVisible = true" />
    <el-image-viewer v-if="imgViewVisible" @close="imgViewVisible = false" :url-list="[imageUrl]" />
  </div>
</template>

<script setup lang="ts" name="UploadImg">
import { ref, watch } from "vue";
import { fileParse } from "@/api/modules/upload";

const imageUrl = ref("");
const imgViewVisible = ref(false);

interface ImgViewProps {
  fileId: string;
}
// 接受父组件参数
const props = withDefaults(defineProps<ImgViewProps>(), {
  fileId: ""
});

const initData = async () => {
  const { data } = await fileParse(props.fileId);
  imageUrl.value = data.list[0].url;
};
initData();

watch(
  () => props.fileId,
  async newProps => {
    const { data } = await fileParse(newProps);
    imageUrl.value = data.list[0].url;
  }
);
</script>

<style scoped lang="scss">
.img {
  width: 100%;
  height: 100%;
}
</style>

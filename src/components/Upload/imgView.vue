<template>
  <div>
    <div v-if="props.preview">
      <el-image
        class="el-image"
        :zoom-rate="1.2"
        :src="imageUrl"
        :initial-index="0"
        :fit="props.fit"
        :preview-src-list="imageUrls"
      >
        <template #error>
          <div class="image-slot">
            <el-icon><Picture /></el-icon>
          </div>
        </template>
      </el-image>
      <div class="tip">
        <span>多图点击预览</span>
      </div>
    </div>
    <div v-else>
      <el-image class="el-image" :zoom-rate="1.2" :src="imageUrl" :initial-index="0" :fit="props.fit">
        <template #error>
          <div class="image-slot">
            <el-icon><Picture /></el-icon>
          </div>
        </template>
      </el-image>
    </div>
  </div>
</template>

<script setup lang="ts" name="UploadImg">
import { Picture } from "@element-plus/icons-vue";
import { ref, watch } from "vue";
import { fileParse } from "@/api/modules/file/upload";

const imageUrl = ref("");
const imageUrls = ref();

interface ImgViewProps {
  fileId?: string;
  fit?: string;
  height?: string;
  width?: string;
  borderRadius?: string;
  preview?: boolean;
}
// 接受父组件参数
const props = withDefaults(defineProps<ImgViewProps>(), {
  fileId: "",
  fit: "cover",
  height: "138.4px",
  width: "138.4px",
  borderRadius: "8px",
  preview: true
});

const initData = async () => {
  const { data } = await fileParse(props.fileId);
  let urls = [];
  if (data.list.length > 0) {
    for (let i = 0; i < data.list.length; i++) {
      imageUrl.value = data.list[0]?.url;
      urls.push(data.list[i]?.url);
    }
  }
  imageUrls.value = urls;
};
if (props.fileId != "" && props.fileId != null) {
  initData();
}

watch(
  () => props.fileId,
  async newProps => {
    const { data } = await fileParse(newProps);
    imageUrls.value = data.list;
    imageUrl.value = data.list[0]?.url;
  }
);
</script>
<style scoped lang="scss">
.tip {
  line-height: 18px;
  text-align: center;
}
span {
  font-size: 85%;
  line-height: 85%;
}
.el-image {
  width: v-bind(width);
  height: v-bind(height);
  border-radius: v-bind(borderRadius);
}
.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 30px;
}
</style>

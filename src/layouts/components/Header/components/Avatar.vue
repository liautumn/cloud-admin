<template>
  <el-dropdown trigger="click">
    <imgView v-model:fileId="userStore.userInfo.avatar" width="40px" height="40px" :preview="false" />
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="openDialog('infoRef')">
          <el-icon><User /></el-icon>{{ $t("header.personalData") }}
        </el-dropdown-item>
        <el-dropdown-item @click="logout" divided>
          <el-icon><SwitchButton /></el-icon>{{ $t("header.logout") }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <!-- infoDialog -->
  <InfoDialog ref="infoRef"></InfoDialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { LOGIN_URL } from "@/config";
import { useRouter } from "vue-router";
import { logoutApi } from "@/api/modules/auth/login";
import { useUserStore } from "@/stores/modules/user";
import { ElMessageBox, ElMessage } from "element-plus";
import InfoDialog from "./InfoDialog.vue";
import imgView from "@/components/Upload/imgView.vue";

const $I18n = useI18n();
const router = useRouter();
const userStore = useUserStore();

// 退出登录
const logout = () => {
  ElMessageBox.confirm($I18n.t("logout.text1"), $I18n.t("crud.kindReminder"), {
    confirmButtonText: $I18n.t("logout.confirm"),
    cancelButtonText: $I18n.t("logout.cancel"),
    type: "warning"
  }).then(async () => {
    // 1.执行退出登录接口
    await logoutApi();

    // 2.清除 Token
    userStore.setToken("");

    // 3.重定向到登陆页
    router.replace(LOGIN_URL);
    ElMessage.success($I18n.t("logout.text2"));
  });
};

// 打开修改密码和个人信息弹窗
const infoRef = ref<InstanceType<typeof InfoDialog> | null>(null);
const openDialog = (ref: string) => {
  if (ref == "infoRef") infoRef.value?.openDialog();
};
</script>

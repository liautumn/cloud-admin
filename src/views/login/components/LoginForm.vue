<template>
  <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 5px">
    <img style="width: 20%; height: 20%; border-radius: 5px" :src="img1" />
    <img style="width: 20%; height: 20%; border-radius: 5px" :src="img2" />
  </div>
  <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large">
    <el-form-item prop="userName">
      <el-input v-model="loginForm.userName" :placeholder="$t('loginUser.userNamePlaceholder')">
        <template #prefix>
          <el-icon class="el-input__icon"><user /></el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        type="password"
        v-model="loginForm.password"
        :placeholder="$t('loginUser.passwordPlaceholder')"
        show-password
        autocomplete="new-password"
        @click="passInput"
        @blur="passBlur"
        @input="passInput"
      >
        <template #prefix>
          <el-icon class="el-input__icon"><lock /></el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item :label="$t('loginUser.isRemember')" prop="isRemember">
      <el-switch v-model="loginForm.isRemember" inline-prompt active-text="Y" inactive-text="N" />
    </el-form-item>
  </el-form>
  <div class="login-btn">
    <el-button :icon="CircleClose" round @click="resetForm(loginFormRef)" size="large">{{ $t("loginUser.reset") }}</el-button>
    <el-button :icon="UserFilled" round @click="login(loginFormRef)" size="large" type="primary" :loading="loading">
      {{ $t("loginUser.loginBtn") }}
    </el-button>
  </div>
  <Verify
    @success="success"
    mode="pop"
    :captchaType="captchaType"
    :imgSize="{ width: '400px', height: '200px' }"
    ref="verify"
  ></Verify>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { HOME_URL } from "@/config";
import { getTimeState } from "@/utils";
import { Login } from "@/api/interface/auth/login";
import { ElNotification } from "element-plus";
import { loginApi } from "@/api/modules/auth/login";
import { useUserStore } from "@/stores/modules/user";
import { useTabsStore } from "@/stores/modules/tabs";
import { useKeepAliveStore } from "@/stores/modules/keepAlive";
import { initDynamicRouter } from "@/routers/modules/dynamicRouter";
import { CircleClose, UserFilled } from "@element-plus/icons-vue";
import type { ElForm } from "element-plus";
import Verify from "@/components/Verifition/Verify.vue";

const $I18n = useI18n();
const router = useRouter();
const userStore = useUserStore();
const tabsStore = useTabsStore();
const keepAliveStore = useKeepAliveStore();

type FormInstance = InstanceType<typeof ElForm>;
const loginFormRef = ref<FormInstance>();
const loginRules = reactive({
  userName: [{ required: true, message: $I18n.t("loginUser.userNameMsg"), trigger: "blur" }],
  password: [{ required: true, message: $I18n.t("loginUser.passwordMsg"), trigger: "blur" }]
});

const loading = ref(false);
const loginForm = reactive<Login.ReqLoginForm>({
  userName: "admin",
  password: "123456",
  loginIp: "",
  isRemember: false,
  captchaVerification: {}
});

//密码框触发事件
let img_1 = "https://s1.hdslb.com/bfs/seed/jinkela/short/mini-login-v2/img/22_open.4ea5f239.png";
let img_2 = "https://s1.hdslb.com/bfs/seed/jinkela/short/mini-login-v2/img/33_open.f7d7f655.png";
let img_3 = "https://s1.hdslb.com/bfs/seed/jinkela/short/mini-login-v2/img/22_close.9382a5a8.png";
let img_4 = "https://s1.hdslb.com/bfs/seed/jinkela/short/mini-login-v2/img/33_close.a8c18fc8.png";
const img1 = ref(img_1);
const img2 = ref(img_2);
const passInput = () => {
  img1.value = img_3;
  img2.value = img_4;
};
const passBlur = () => {
  img1.value = img_1;
  img2.value = img_2;
};

//行为验证码
const verify = ref();
const captchaType = ref("");
const success = async (data: any) => {
  let captchaVerification = data.captchaVerification;
  //登录
  loading.value = true;
  try {
    // 1.执行登录接口
    const param = { ...loginForm, ...{ loginIp: "127.0.0.1", captchaVerification: captchaVerification } };
    const { data } = await loginApi(param);
    userStore.setToken(data.token);
    userStore.setUserInfo(data.userInfo);

    // 2.添加动态路由
    await initDynamicRouter();

    // 3.清空 tabs、keepAlive 数据
    tabsStore.closeMultipleTab();
    keepAliveStore.setKeepAliveName();

    // 4.跳转到首页
    router.push(HOME_URL);
    ElNotification({
      title: getTimeState(),
      message: $I18n.t("loginUser.text3") + userStore.userInfo.nickName,
      type: "success",
      duration: 2000
    });
  } finally {
    loading.value = false;
  }
};

// login
const login = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(valid => {
    if (!valid) return;
    //执行行为验证码
    let number = Math.round(Math.random() * 10);
    if (number >= 5) {
      captchaType.value = "blockPuzzle";
    } else {
      captchaType.value = "clickWord";
    }
    verify.value.show();
  });
};

// resetForm
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

onMounted(() => {
  // 监听 enter 事件（调用登录）
  document.onkeydown = (e: KeyboardEvent) => {
    e = (window.event as KeyboardEvent) || e;
    if (e.code === "Enter" || e.code === "enter" || e.code === "NumpadEnter") {
      if (loading.value) return;
      login(loginFormRef.value);
    }
  };
});
</script>

<style scoped lang="scss">
@import "../index.scss";
</style>

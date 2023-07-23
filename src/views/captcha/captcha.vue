<template>
  <el-button @click="onShow">验证码</el-button>
  <Verify
    @success="success"
    mode="pop"
    :captchaType="captchaType"
    :imgSize="{ width: '400px', height: '200px' }"
    ref="verify"
  ></Verify>
</template>

<script setup lang="ts" name="captcha">
import { ref } from "vue";
import Verify from "@/components/Verifition/Verify.vue";

const verify = ref();
const captchaType = ref("");
const onShow = () => {
  let number = Math.round(Math.random() * 10);
  if (number > 5) {
    captchaType.value = "blockPuzzle";
  } else {
    captchaType.value = "clickWord";
  }
  verify.value.show();
};
const success = (data: any) => {
  console.log(data);
};
</script>

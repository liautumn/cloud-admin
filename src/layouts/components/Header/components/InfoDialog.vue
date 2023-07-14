<template>
  <el-dialog
    v-model="dialogFlag"
    :close-on-click-modal="true"
    :destroy-on-close="true"
    @close="close"
    @open="initData"
    :title="$t('loginUser.title')"
    width="50%"
    top="1vh"
    draggable
    :modal="true"
    style="border-radius: 8px"
  >
    <el-tabs class="my-tabs" v-model="activeName">
      <el-tab-pane name="0" :label="$t('loginUser.label1')">
        <el-form ref="formRef" label-width="110px" label-suffix=" :" :model="formData" :rules="rules" label-position="right">
          <el-row>
            <el-col :span="24">
              <el-form-item :label="$t('loginUser.avatarLabel')" prop="avatar">
                <UploadImg v-model:fileId="formData!.avatar" width="135px" height="135px" :file-size="3">
                  <template #empty>
                    <el-icon>
                      <Avatar />
                    </el-icon>
                    <span>{{ $t("loginUser.text1") }}</span>
                  </template>
                  <template #tip>{{ $t("loginUser.text2") }}</template>
                </UploadImg>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('loginUser.userNameLabel')" prop="userName">
                <el-input v-model="formData!.userName" :placeholder="$t('loginUser.userNameLabel')" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('loginUser.nickNameLabel')" prop="nickName">
                <el-input v-model="formData!.nickName" :placeholder="$t('loginUser.nickNameLabel')" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('loginUser.emailLabel')" prop="email">
                <el-input v-model="formData!.email" :placeholder="$t('loginUser.emailLabel')" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('loginUser.phonenumberLabel')" prop="phonenumber">
                <el-input v-model="formData!.phonenumber" :placeholder="$t('loginUser.phonenumberLabel')" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('loginUser.sexLabel')" prop="sex">
                <el-radio-group v-model="formData!.sex">
                  <el-radio v-for="item in sex" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('loginUser.deptIdLabel')" prop="deptId">
                <el-input v-model="formData!.deptId" :placeholder="$t('loginUser.deptIdLabel')" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('loginUser.loginDateLabel')" prop="createTime">
                <el-input v-model="formData!.loginDate" :placeholder="$t('loginUser.loginDateLabel')" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('loginUser.loginIpLabel')" prop="loginIp">
                <el-input v-model="formData!.loginIp" :placeholder="$t('loginUser.loginIpLabel')" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item :label="$t('loginUser.remarkLabel')" prop="remark">
                <el-input
                  type="textarea"
                  v-model="formData!.remark"
                  :autosize="{ minRows: 2, maxRows: 8 }"
                  :placeholder="$t('loginUser.remarkLabel')"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane name="1" :label="$t('loginUser.label2')">
        <el-form
          ref="passFormRef"
          label-width="150px"
          label-suffix=" :"
          :model="passFormData"
          :rules="passRules"
          label-position="right"
        >
          <el-row>
            <el-col :span="24">
              <el-form-item :label="$t('loginUser.oldPasswordLabel')" prop="oldPassword">
                <el-input
                  type="password"
                  show-password
                  v-model="passFormData!.oldPassword"
                  :placeholder="$t('loginUser.oldPasswordPlaceholder')"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item :label="$t('loginUser.newPasswordLabel')" prop="newPassword">
                <el-input
                  type="password"
                  show-password
                  v-model="passFormData!.newPassword"
                  :placeholder="$t('loginUser.newPasswordPlaceholder')"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="" prop="checkPassword">
                <el-input
                  type="password"
                  show-password
                  v-model="passFormData!.checkPassword"
                  :placeholder="$t('loginUser.checkPasswordPlaceholder')"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <el-button @click="reset">{{ $t("crud.reset") }}</el-button>
      <el-button type="primary" @click="submit">{{ $t("crud.submit") }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useI18n } from "vue-i18n";
import { useUserStore } from "@/stores/modules/user";
import { FormInstance, FormRules, ElMessage } from "element-plus";
import UploadImg from "@/components/Upload/Img.vue";
import { Login } from "@/api/interface/auth/login";
import { updateUser, getOneUser, updatePassword } from "@/api/modules/auth/loginUser";
import { UserState } from "@/stores/interface/index";
import { sex } from "@/utils/dict/globalDict";

const $I18n = useI18n();
const activeName = ref("0");
const userStore = useUserStore();
const formRef = ref<FormInstance>();
const passFormRef = ref<FormInstance>();
const dialogFlag = ref(false);
const formData = ref<UserState["userInfo"]>({
  id: "",
  deptId: "",
  userName: "",
  nickName: "",
  userType: "",
  email: "",
  phonenumber: "",
  sex: "",
  avatar: "",
  status: "",
  loginIp: "",
  loginDate: "",
  createTime: "",
  remark: ""
});
const passFormData = ref<Login.PassForm>({
  id: "",
  oldPassword: "",
  newPassword: "",
  checkPassword: ""
});

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === "" || value === null) {
    callback(new Error($I18n.t("loginUser.notNull")));
  } else {
    if (passFormData.value.checkPassword != "" && passFormData.value.checkPassword != null) {
      if (!passFormRef.value) return;
      passFormRef.value.validateField("checkPassword", () => null);
    }
    callback();
  }
};

const validateCheckPass = (rule: any, value: any, callback: any) => {
  if (value == "" || value == null) {
    callback(new Error($I18n.t("loginUser.notNull")));
  } else if (value != passFormData.value.newPassword) {
    callback(new Error($I18n.t("loginUser.againPassword")));
  } else {
    callback();
  }
};

//表单字段规则
const rules = reactive<FormRules>({
  userName: [{ required: true, message: $I18n.t("loginUser.notNull"), trigger: "blur" }],
  nickName: [{ required: true, message: $I18n.t("loginUser.notNull"), trigger: "blur" }],
  email: [{ required: false, message: $I18n.t("loginUser.notNull"), trigger: "blur" }],
  sex: [{ required: false, message: $I18n.t("loginUser.notNull"), trigger: "blur" }],
  phonenumber: [{ required: false, message: $I18n.t("loginUser.notNull"), trigger: "blur" }]
});
const passRules = reactive<FormRules>({
  oldPassword: [{ required: true, message: $I18n.t("loginUser.notNull"), trigger: "blur" }],
  newPassword: [{ validator: validatePass, required: true, trigger: "blur" }],
  checkPassword: [{ validator: validateCheckPass, required: true, trigger: "blur" }]
});

//打开dialog
const openDialog = async () => {
  dialogFlag.value = true;
};

const initData = async () => {
  //加载用户信息
  const { data } = await getOneUser(userStore.userInfo.id);
  formData.value = data;
  passFormData.value.id = formData.value.id;
};
initData();

//关闭dialog
const close = () => {
  activeName.value = "0";
  passFormRef.value?.resetFields();
  dialogFlag.value = false;
};

//重置
const reset = () => {
  if (activeName.value === "0") {
    formRef.value?.resetFields();
  } else {
    passFormRef.value?.resetFields();
  }
};

//提交
const submit = () => {
  if (activeName.value === "0") {
    formRef.value!.validate(async valid => {
      if (!valid) return;
      await updateUser(formData.value);
      //更新全局用户信息
      userStore.setUserInfo(JSON.parse(JSON.stringify(formData.value)));
      ElMessage.success({ message: $I18n.t("loginUser.updateSuccess") });
      close();
    });
  } else {
    passFormRef.value!.validate(async valid => {
      if (!valid) return;
      await updatePassword(passFormData.value);
      ElMessage.success({ message: $I18n.t("loginUser.updatePasswordSuccess") });
      close();
    });
  }
};

defineExpose({ openDialog });
</script>
<style>
.my-tabs > .el-tabs__content {
  padding: 32px;
  font-size: 32px;
  font-weight: 600;
  color: #6b778c;
}
</style>

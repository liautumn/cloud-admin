<template>
  <el-dialog
    v-model="dialogFlag"
    :close-on-click-modal="true"
    :destroy-on-close="true"
    @close="close"
    @open="initData"
    title="个人信息"
    width="50%"
    top="1vh"
    draggable
    :modal="true"
    style="border-radius: 8px"
  >
    <el-tabs class="my-tabs" v-model="activeName">
      <el-tab-pane name="0" label="用户信息">
        <el-form ref="formRef" label-width="100px" label-suffix=" :" :model="formData" :rules="rules" label-position="right">
          <el-row>
            <el-col :span="24">
              <el-form-item label="用户头像" prop="avatar">
                <UploadImg v-model:fileId="formData!.avatar" width="135px" height="135px" :file-size="3">
                  <template #empty>
                    <el-icon>
                      <Avatar />
                    </el-icon>
                    <span>请上传头像</span>
                  </template>
                  <template #tip> 头像大小不能超过 3M</template>
                </UploadImg>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="用户名" prop="userName">
                <el-input v-model="formData!.userName" placeholder="用户名" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="昵称" prop="nickName">
                <el-input v-model="formData!.nickName" placeholder="昵称" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="formData!.email" placeholder="邮箱" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机号码" prop="phonenumber">
                <el-input v-model="formData!.phonenumber" placeholder="手机号码" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="性别" prop="sex">
                <el-radio-group v-model="formData!.sex">
                  <el-radio v-for="item in sex" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所属部门" prop="deptId">
                <el-input v-model="formData!.deptId" placeholder="所属部门" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="注册时间" prop="createTime">
                <el-input v-model="formData!.loginDate" placeholder="注册时间" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="登录IP" prop="loginIp">
                <el-input v-model="formData!.loginIp" placeholder="登录IP" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input type="textarea" v-model="formData!.remark" :autosize="{ minRows: 2, maxRows: 8 }" placeholder="备注" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane name="1" label="修改密码">
        <el-form
          ref="passFormRef"
          label-width="100px"
          label-suffix=" :"
          :model="passFormData"
          :rules="passRules"
          label-position="right"
        >
          <el-row>
            <el-col :span="24">
              <el-form-item label="旧密码" prop="oldPassword">
                <el-input
                  type="password"
                  show-password
                  v-model="passFormData!.oldPassword"
                  placeholder="请输入旧密码"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="新密码" prop="newPassword">
                <el-input
                  type="password"
                  show-password
                  v-model="passFormData!.newPassword"
                  placeholder="请输入新密码"
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
                  placeholder="请再次输入新密码"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <el-button @click="reset">重置</el-button>
      <el-button type="primary" @click="submit"> 提交 </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useUserStore } from "@/stores/modules/user";
import { FormInstance, FormRules, ElMessage } from "element-plus";
import UploadImg from "@/components/Upload/Img.vue";
import { Login } from "@/api/interface/auth/login";
import { updateUser, getOneUser, updatePassword } from "@/api/modules/auth/loginUser";
import { UserState } from "@/stores/interface/index";
import { sex } from "@/utils/dict/globalDict";

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
    callback(new Error("不能为空"));
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
    callback(new Error("不能为空"));
  } else if (value != passFormData.value.newPassword) {
    callback(new Error("两次密码不一致"));
  } else {
    callback();
  }
};

//表单字段规则
const rules = reactive<FormRules>({
  userName: [{ required: true, message: "不能为空", trigger: "blur" }],
  nickName: [{ required: true, message: "不能为空", trigger: "blur" }],
  email: [{ required: false, message: "不能为空", trigger: "blur" }],
  sex: [{ required: false, message: "不能为空", trigger: "blur" }],
  phonenumber: [{ required: false, message: "不能为空", trigger: "blur" }]
});
const passRules = reactive<FormRules>({
  oldPassword: [{ required: true, message: "不能为空", trigger: "blur" }],
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
      ElMessage.success({ message: `修改成功！` });
      close();
    });
  } else {
    passFormRef.value!.validate(async valid => {
      if (!valid) return;
      await updatePassword(passFormData.value);
      ElMessage.success({ message: `修改密码成功！` });
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

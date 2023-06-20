<template>
  <el-dialog
    v-model="dialogFlag"
    :close-on-click-modal="true"
    :destroy-on-close="true"
    @close="close"
    @open="initData"
    title="个人信息"
    width="50%"
    top="7vh"
    draggable
    :modal="true"
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
                <el-input v-model="formData!.userName" placeholder="用户名" clearable disabled />
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
                <el-input v-model="formData!.sex" placeholder="性别" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="formData!.remark" placeholder="备注" clearable />
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
                <el-input v-model="passFormData!.oldPassword" placeholder="请输入旧密码" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="新密码" prop="newPassword">
                <el-input v-model="passFormData!.newPassword" placeholder="请输入新密码" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="" prop="newPassword2">
                <el-input v-model="passFormData!.newPassword2" placeholder="请再次输入新密码" clearable />
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
import { updateUser, getOneUser } from "@/api/modules/loginUser";
import { UserState } from "@/stores/interface/index";

//定义表单需要的参数
interface PassForm {
  oldPassword: string;
  newPassword: string;
  newPassword2: string;
}

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
const passFormData = ref<PassForm>({
  oldPassword: "",
  newPassword: "",
  newPassword2: ""
});

//表单字段规则
const rules = reactive<FormRules>({
  userName: [{ required: true, message: "不能为空", trigger: "blur" }]
});
const passRules = reactive<FormRules>({
  oldPassword: [{ required: true, message: "不能为空", trigger: "blur" }],
  newPassword: [{ required: true, message: "不能为空", trigger: "blur" }],
  newPassword2: [{ required: true, message: "不能为空", trigger: "blur" }]
});

//打开dialog
const openDialog = async () => {
  dialogFlag.value = true;
};

const initData = async () => {
  //加载用户信息
  const { data } = await getOneUser(userStore.userInfo.id);
  formData.value = data;
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
      try {
        await updateUser(formData.value);
        //更新全局用户信息
        userStore.setUserInfo(JSON.parse(JSON.stringify(formData.value)));
        ElMessage.success({ message: `修改成功！` });
        close();
      } catch (error) {
        ElMessage({
          message: error,
          type: "error"
        });
      }
    });
  } else {
    passFormRef.value!.validate(async valid => {
      if (!valid) return;
      try {
        // await updateUser(formData.value);
        ElMessage.success({ message: `修改成功！` });
        close();
      } catch (error) {
        ElMessage({
          message: error,
          type: "error"
        });
      }
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

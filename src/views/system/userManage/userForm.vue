<template>
  <el-dialog
    v-model="dialogFlag"
    :close-on-click-modal="true"
    :destroy-on-close="true"
    @close="close"
    :title="dialogProps.title"
    width="50%"
    top="7vh"
    draggable
    :modal="true"
    style="border-radius: 8px"
  >
    <el-form
      ref="formRef"
      label-width="100px"
      label-suffix=" :"
      :model="dialogProps.row"
      :rules="rules"
      label-position="right"
      :disabled="dialogProps.disabled"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="部门ID" prop="deptId">
            <el-input v-model="dialogProps.row!.deptId" placeholder="部门ID" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属角色" prop="roleList">
            <el-select v-model="dialogProps.row!.roleList" filterable multiple clearable placeholder="请选择" style="width: 100%">
              <el-option v-for="item in roleDataList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户账号" prop="userName">
            <el-input v-model="dialogProps.row!.userName" placeholder="用户账号" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户昵称" prop="nickName">
            <el-input v-model="dialogProps.row!.nickName" placeholder="用户昵称" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户邮箱" prop="email">
            <el-input v-model="dialogProps.row!.email" placeholder="用户邮箱" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号码" prop="phonenumber">
            <el-input v-model="dialogProps.row!.phonenumber" placeholder="手机号码" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户性别" prop="sex">
            <el-input v-model="dialogProps.row!.sex" placeholder="用户性别" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="密码" prop="password">
            <el-input v-model="dialogProps.row!.password" placeholder="密码" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="帐号状态" prop="status">
            <el-input v-model="dialogProps.row!.status" placeholder="帐号状态" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="dialogProps.row!.remark" placeholder="备注" clearable />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer" v-if="!dialogProps.disabled">
        <el-button @click="reset">重置</el-button>
        <el-button type="primary" @click="submit"> 提交 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="userForm">
import { FormInstance, FormRules, ElMessage } from "element-plus";
import { ref, reactive } from "vue";
import { User } from "@/api/interface/system/user/user";
import { getRoleList } from "@/api/modules/system/role/role";

//获取角色权限下拉数据
const roleDataList = ref();
const initMenuTreeList = () => {
  getRoleList({}).then(res => {
    roleDataList.value = res.data;
  });
};
initMenuTreeList();

const formRef = ref<FormInstance>();
const dialogFlag = ref(false);

//表单字段规则
const rules = reactive<FormRules>({
  deptId: [{ required: false, message: "不能为空", trigger: "blur" }],
  roleList: [{ required: false, message: "不能为空", trigger: "blur" }],
  userName: [{ required: false, message: "不能为空", trigger: "blur" }],
  nickName: [{ required: false, message: "不能为空", trigger: "blur" }],
  userType: [{ required: false, message: "不能为空", trigger: "blur" }],
  email: [{ required: false, message: "不能为空", trigger: "blur" }],
  phonenumber: [{ required: false, message: "不能为空", trigger: "blur" }],
  sex: [{ required: false, message: "不能为空", trigger: "blur" }],
  avatar: [{ required: false, message: "不能为空", trigger: "blur" }],
  password: [{ required: false, message: "不能为空", trigger: "blur" }],
  remark: [{ required: false, message: "不能为空", trigger: "blur" }],
  status: [{ required: false, message: "不能为空", trigger: "blur" }],
  loginIp: [{ required: false, message: "不能为空", trigger: "blur" }],
  loginDate: [{ required: false, message: "不能为空", trigger: "blur" }]
});

//定义表单需要的参数
interface DialogProps {
  type: string;
  title: string;
  disabled: boolean;
  row: Partial<User.ResList>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

//声明参数
const dialogProps = ref<DialogProps>({
  type: "",
  title: "",
  disabled: false,
  row: {}
});

//打开dialog并传入表单数据等参数
const open = (params: DialogProps) => {
  dialogProps.value = params;
  dialogFlag.value = true;
};

//关闭dialog
const close = () => {
  formRef.value?.resetFields();
  dialogFlag.value = false;
};

//重置
const reset = () => {
  formRef.value?.resetFields();
};

//提交
const submit = () => {
  formRef.value!.validate(async valid => {
    if (!valid) return;
    await dialogProps.value.api!(dialogProps.value.row);
    ElMessage.success({ message: dialogProps.value.title + "成功！" });
    dialogProps.value.getTableList!();
    close();
  });
};

defineExpose({
  open
});
</script>

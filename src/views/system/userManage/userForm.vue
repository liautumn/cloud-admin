<template>
  <el-dialog
    v-model="dialogFlag"
    :close-on-click-modal="true"
    :destroy-on-close="true"
    @close="close"
    :title="dialogProps.title"
    width="50%"
    top="15vh"
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
            <el-radio-group v-model="dialogProps.row!.sex">
              <el-radio v-for="item in sex" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="密码" prop="password">
            <el-input type="password" show-password v-model="dialogProps.row!.password" placeholder="密码" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属部门" prop="deptId">
            <el-tree-select
              v-model="dialogProps.row!.deptId"
              :data="deptDataList"
              placeholder="请选择"
              :render-after-expand="false"
              check-strictly
              filterable
              clearable
              style="width: 100%"
            />
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
          <el-form-item label="所属岗位" prop="postList">
            <el-select v-model="dialogProps.row!.postList" filterable multiple clearable placeholder="请选择" style="width: 100%">
              <el-option v-for="item in postDataList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否停用" prop="status">
            <el-radio-group v-model="dialogProps.row!.status">
              <el-radio v-for="item in whether" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input
              type="textarea"
              v-model="dialogProps.row!.remark"
              :autosize="{ minRows: 2, maxRows: 8 }"
              placeholder="备注"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer" v-if="!dialogProps.disabled">
        <el-button @click="reset">{{ $t("crud.reset") }}</el-button>
        <el-button type="primary" v-debounce="submit">{{ $t("crud.submit") }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="userForm">
import { FormInstance, FormRules, ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
import { ref, reactive } from "vue";
import { User } from "@/api/interface/system/user/user";
import { getRoleList, getPostList } from "@/api/modules/system/role/role";
import { getDeptList } from "@/api/modules/system/dept/dept";
import { sex, whether } from "@/utils/dict/globalDict";

const $I18n = useI18n();
//获取所属部门下拉数据
const deptDataList = ref();
const initDeptDataList = () => {
  getDeptList({}).then(res => {
    deptDataList.value = res.data;
  });
};
initDeptDataList();

//获取角色权限下拉数据
const roleDataList = ref();
const initRoleDataList = () => {
  getRoleList({}).then(res => {
    roleDataList.value = res.data;
  });
};
initRoleDataList();

//获取所属岗位下拉数据
const postDataList = ref();
const initPostDataList = () => {
  getPostList({}).then(res => {
    postDataList.value = res.data;
  });
};
initPostDataList();

const formRef = ref<FormInstance>();
const dialogFlag = ref(false);

//表单字段规则
const rules = reactive<FormRules>({
  deptId: [{ required: false, message: "不能为空", trigger: "blur" }],
  roleList: [{ required: false, message: "不能为空", trigger: "blur" }],
  postList: [{ required: false, message: "不能为空", trigger: "blur" }],
  userName: [{ required: true, message: "不能为空", trigger: "blur" }],
  nickName: [{ required: true, message: "不能为空", trigger: "blur" }],
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
    ElMessage.success({ message: dialogProps.value.title + $I18n.t("crud.success") });
    dialogProps.value.getTableList!();
    close();
  });
};

defineExpose({
  open
});
</script>

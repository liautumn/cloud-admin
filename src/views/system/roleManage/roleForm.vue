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
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="dialogProps.row!.roleName" placeholder="角色名称" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="角色权限" prop="roleKey">
            <el-input v-model="dialogProps.row!.roleKey" placeholder="角色权限" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示顺序" prop="roleSort">
            <el-input-number v-model="dialogProps.row!.roleSort" :min="1" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否停用" prop="status">
            <el-radio-group v-model="dialogProps.row!.status">
              <el-radio v-for="item in dicts.whether" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="菜单权限" prop="menuTreeList">
            <el-tree-select
              v-model="dialogProps.row!.menuTreeList"
              :data="menuTreeList"
              placeholder="请选择"
              multiple
              show-checkbox
              :check-on-click-node="true"
              :render-after-expand="false"
              :check-strictly="true"
              filterable
              clearable
              @node-click="handleNodeClick"
              @check-change="handleCheckChange"
              style="width: 100%"
            />
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
        <el-button type="primary" @click="submit">{{ $t("crud.submit") }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="roleForm">
import { FormInstance, FormRules, ElMessage } from "element-plus";
import { ref, reactive } from "vue";
import { getMenuTree } from "@/api/modules/system/menu/menu";
import { Role } from "@/api/interface/system/role/role";
import { useI18n } from "vue-i18n";
import { parseDicts } from "@/stores/helper/dicts";

const { dicts } = parseDicts("whether");
const $I18n = useI18n();
const formRef = ref<FormInstance>();
const dialogFlag = ref(false);
//获取菜单树下拉数据
const menuTreeList = ref();
const initMenuTreeList = () => {
  const param = {
    status: "1"
  };
  getMenuTree(param).then(res => {
    menuTreeList.value = res.data;
  });
};
initMenuTreeList();

const handleNodeClick = (data: any) => {
  console.log(data);
};
const handleCheckChange = (data: any, checked: boolean, indeterminate: boolean) => {
  console.log(data, checked, indeterminate);
};

//表单字段规则
const rules = reactive<FormRules>({
  roleName: [{ required: true, message: "不能为空", trigger: "blur" }],
  roleKey: [{ required: true, message: "不能为空", trigger: "blur" }],
  roleSort: [{ required: false, message: "不能为空", trigger: "blur" }],
  dataScope: [{ required: false, message: "不能为空", trigger: "blur" }],
  menuTreeList: [{ required: true, message: "不能为空", trigger: "blur" }],
  menuCheckStrictly: [{ required: false, message: "不能为空", trigger: "blur" }],
  deptCheckStrictly: [{ required: false, message: "不能为空", trigger: "blur" }],
  remark: [{ required: false, message: "不能为空", trigger: "blur" }],
  status: [{ required: false, message: "不能为空", trigger: "blur" }]
});

//定义表单需要的参数
interface DialogProps {
  type: string;
  title: string;
  disabled: boolean;
  row: Partial<Role.ResObject>;
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

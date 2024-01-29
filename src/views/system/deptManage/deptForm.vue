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
          <el-form-item label="上级节点" prop="parentId">
            <el-tree-select
              v-model="dialogProps.row!.parentId"
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
          <el-form-item label="部门名称" prop="deptName">
            <el-input v-model="dialogProps.row!.deptName" placeholder="部门名称" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示顺序" prop="orderNum">
            <el-input-number v-model="dialogProps.row!.orderNum" :min="1" style="width: 100%"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="负责人" prop="leader">
            <el-input v-model="dialogProps.row!.leader" placeholder="负责人" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="dialogProps.row!.phone" placeholder="联系电话" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="dialogProps.row!.email" placeholder="邮箱" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否停用" prop="status">
            <el-radio-group v-model="dialogProps.row!.status">
              <el-radio v-for="item in dicts.whether" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
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

<script setup lang="ts" name="deptForm">
import { FormInstance, FormRules, ElMessage } from "element-plus";
import { ref, reactive } from "vue";
import { Dept } from "@/api/interface/system/dept/dept";
import { getDeptList } from "@/api/modules/system/dept/dept";
import { useI18n } from "vue-i18n";
import { parseDicts } from "@/stores/helper/dicts";

const { dicts } = parseDicts("whether");
const $I18n = useI18n();
const formRef = ref<FormInstance>();
const dialogFlag = ref(false);

//获取所属部门下拉数据
const deptDataList = ref();
const initDeptDataList = () => {
  const param = {
    isGetRoot: true
  };
  getDeptList(param).then(res => {
    deptDataList.value = res.data;
  });
};
initDeptDataList();

//表单字段规则
const rules = reactive<FormRules>({
  parentId: [{ required: true, message: "不能为空", trigger: "blur" }],
  ancestors: [{ required: false, message: "不能为空", trigger: "blur" }],
  deptName: [{ required: true, message: "不能为空", trigger: "blur" }],
  orderNum: [{ required: false, message: "不能为空", trigger: "blur" }],
  leader: [{ required: false, message: "不能为空", trigger: "blur" }],
  phone: [{ required: false, message: "不能为空", trigger: "blur" }],
  email: [{ required: false, message: "不能为空", trigger: "blur" }],
  status: [{ required: false, message: "不能为空", trigger: "blur" }]
});

//定义表单需要的参数
interface DialogProps {
  type: string;
  title: string;
  disabled: boolean;
  row: Partial<Dept.ResObject>;
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
    ElMessage.success(dialogProps.value.title + $I18n.t("crud.success"));
    dialogProps.value.getTableList!();
    close();
  });
};

defineExpose({
  open
});
</script>

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
      class="demo-form-inline"
      label-position="right"
      :disabled="dialogProps.disabled"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="父节点" prop="parentId">
            <el-input v-model="dialogProps.row!.parentId" placeholder="字典名称" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="数据标签" prop="dictLabel">
            <el-input v-model="dialogProps.row!.dictLabel" placeholder="数据标签" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="数据键值" prop="dictValue">
            <el-input v-model="dialogProps.row!.dictValue" placeholder="数据标签" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示排序" prop="dictSort">
            <el-input v-model="dialogProps.row!.dictSort" placeholder="数据标签" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="数据类型" prop="dictType">
            <el-input v-model="dictStoreData.row!.dictType" :disabled="true" placeholder="数据类型" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="样式属性" prop="cssClass">
            <el-input v-model="dialogProps.row!.cssClass" placeholder="样式属性" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="回显样式" prop="echoClass">
            <el-input v-model="dialogProps.row!.echoClass" placeholder="回显样式" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否默认" prop="isDfault">
            <el-input v-model="dialogProps.row!.isDfault" placeholder="是否默认" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否停用" prop="status">
            <el-input v-model="dialogProps.row!.status" placeholder="是否停用" clearable />
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

<script setup lang="ts" name="menuForm">
import { FormInstance, FormRules, ElMessage } from "element-plus";
import { ref, reactive } from "vue";
import { dictStore } from "@/stores/modules/dict";
import { useI18n } from "vue-i18n";

const $I18n = useI18n();
const dictStoreData = dictStore();

const formRef = ref<FormInstance>();
const dialogFlag = ref(false);

//表单字段规则
const rules = reactive<FormRules>({
  dictLabel: [{ required: true, message: "不能为空", trigger: "blur" }]
});

//定义表单需要的参数
interface DialogProps {
  type: string;
  title: string;
  disabled: boolean;
  isView: boolean;
  row: Partial<any>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

//声明参数
const dialogProps = ref<DialogProps>({
  type: "",
  title: "",
  disabled: false,
  isView: false,
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
    const row = {
      ...dialogProps.value.row,
      ...{ dictTypeId: dictStoreData.row.id, dictType: dictStoreData.row.dictType }
    };
    await dialogProps.value.api!(row);
    ElMessage.success({ message: `${dialogProps.value.title}` + $I18n.t("crud.success") });
    dialogProps.value.getTableList!();
    close();
  });
};

defineExpose({
  open
});
</script>

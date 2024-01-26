<template>
  <el-dialog
    v-model="dialogFlag"
    :title="dialogProps.title"
    modal
    draggable
    close-on-click-modal
    destroy-on-close
    @close="close"
    top="15vh"
    width="50%"
    style="border-radius: 8px"
  >
    <el-form
      ref="formRef"
      label-suffix=" :"
      label-width="100px"
      label-position="right"
      :rules="rules"
      :model="dialogProps.row"
      :disabled="dialogProps.disabled"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="岗位名称" prop="postName">
            <el-input v-model="dialogProps.row!.postName" placeholder="岗位名称" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="岗位编码" prop="postCode">
            <el-input v-model="dialogProps.row!.postCode" placeholder="岗位编码" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示顺序" prop="postSort">
            <el-input-number v-model="dialogProps.row!.postSort" :min="1" style="width: 100%"></el-input-number>
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
        <el-button type="primary" @click="submit">{{ $t("crud.submit") }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="postForm">
import { ref, reactive } from "vue";
import { useI18n } from "vue-i18n";
import { FormInstance, FormRules, ElMessage } from "element-plus";
import { Post } from "@/api/interface/system/post/post";
import { whether } from "@/utils/dict/globalDict";

const $I18n = useI18n();
const formRef = ref<FormInstance>();
const dialogFlag = ref(false);

//表单字段规则
const rules = reactive<FormRules>({
  postName: [{ required: true, message: "不能为空", trigger: "blur" }],
  postCode: [{ required: true, message: "不能为空", trigger: "blur" }]
});

//定义表单需要的参数
interface DialogProps {
  type?: string;
  title?: string;
  disabled?: boolean;
  row?: Partial<Post.ResObject>;
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

//声明参数
const formDefaultData = {
  id: "",
  postCode: "",
  postName: "",
  postSort: 1,
  remark: "",
  status: "1"
};

//打开dialog并传入表单数据等参数
const openDialog = (params: DialogProps) => {
  dialogProps.value = params;
  if (params.type === "insert") {
    dialogProps.value.row = formDefaultData;
  }
  dialogFlag.value = true;
};

//关闭时触发
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
    ElMessage.success({ message: `${dialogProps.value.title}` + $I18n.t("crud.success") });
    dialogProps.value.getTableList!();
    close();
  });
};

defineExpose({
  openDialog
});
</script>

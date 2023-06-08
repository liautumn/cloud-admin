<template>
  <div class="table-box">
    <!-- 添加框 -->
    <el-dialog
      v-model="dialogFlag"
      :close-on-click-modal="true"
      :destroy-on-close="true"
      @close="close"
      :title="dialogProps.title"
      width="55%"
      draggable
      :modal="false"
    >
      <el-form
        ref="formRef"
        label-width="100px"
        :model="dialogProps.row"
        :rules="rules"
        class="demo-form-inline"
        label-position="right"
        :disabled="dialogProps.disabled"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="菜单名称:" prop="title">
              <el-input v-model="dialogProps.row!.title" placeholder="菜单名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="name:" prop="name">
              <!--              <el-input v-model="dialogProps.row!.name" placeholder="name" clearable />-->
              <el-select v-model="dialogProps.row!.name" placeholder="name" clearable>
                <el-option v-for="item in selectData" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="路由地址:" prop="path">
              <el-input v-model="dialogProps.row!.path" placeholder="路由地址" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="重定向:" prop="redirect">
              <el-input v-model="dialogProps.row!.redirect" placeholder="重定向" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单目录:" prop="parentId">
              <el-input v-model="dialogProps.row!.parentId" placeholder="菜单目录" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单图标:" prop="icon">
              <SelectIcon
                title="菜单图标"
                placeholder="请选择图标"
                v-model:icon-value="dialogProps.row!.icon"
                v-model="dialogProps.row!.icon"
                style="width: 100%"
              />
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
  </div>
</template>

<script setup lang="ts" name="menuForm">
import { FormInstance, FormRules, ElMessage } from "element-plus";
import SelectIcon from "@/components/SelectIcon/index.vue";
import { ref, reactive } from "vue";

const formRef = ref<FormInstance>();
const dialogFlag = ref(false);

const selectData = [
  {
    label: "选项一",
    value: "1"
  },
  {
    label: "选项二",
    value: "2"
  },
  {
    label: "选项三",
    value: "3"
  }
];

//表单字段规则
const rules = reactive<FormRules>({
  parentId: [{ required: true, message: "不能为空", trigger: "blur" }],
  path: [{ required: true, message: "不能为空", trigger: "blur" }],
  name: [{ required: true, message: "不能为空", trigger: "blur" }],
  redirect: [{ required: true, message: "不能为空", trigger: "blur" }],
  icon: [{ required: true, message: "不能为空", trigger: "blur" }],
  title: [{ required: true, message: "不能为空", trigger: "blur" }]
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
    try {
      await dialogProps.value.api!(dialogProps.value.row);
      ElMessage.success({ message: `${dialogProps.value.title}成功！` });
      dialogProps.value.getTableList!();
      close();
    } catch (error) {
      ElMessage({
        message: error,
        type: "error"
      });
    }
  });
};

defineExpose({
  open
});
</script>

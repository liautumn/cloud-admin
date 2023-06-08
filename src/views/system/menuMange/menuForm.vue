<template>
  <div class="table-box">
    <!-- 添加框 -->
    <el-dialog
      v-model="dialogFlag"
      :close-on-click-modal="true"
      :destroy-on-close="true"
      @close="close"
      :title="dialogProps.title"
      width="40%"
      draggable
      :modal="false"
    >
      <el-form
        ref="formRef"
        :model="dialogProps.row"
        :rules="rules"
        label-width="120px"
        class="demo-form-inline"
        label-position="right"
        :disabled="dialogProps.disabled"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="菜单名称:" prop="title" label-width="100">
              <el-input v-model="dialogProps.row!.title" placeholder="菜单名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="name:" prop="name" label-width="100">
              <el-input v-model="dialogProps.row!.name" placeholder="name" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="路由地址:" prop="path" label-width="100">
              <el-input v-model="dialogProps.row!.path" placeholder="路由地址" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="重定向:" prop="redirect" label-width="100">
              <el-input v-model="dialogProps.row!.redirect" placeholder="重定向" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单目录:" prop="parentId" label-width="100">
              <el-input v-model="dialogProps.row!.parentId" placeholder="菜单目录" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单图标:" prop="icon" label-width="100">
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

interface DialogProps {
  type: string;
  title: string;
  disabled: boolean;
  isView: boolean;
  row: Partial<any>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const dialogProps = ref<DialogProps>({
  type: "",
  title: "",
  disabled: false,
  isView: false,
  row: {}
});

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请填写完整！"));
  } else {
    callback();
  }
};

const rules = reactive<FormRules>({
  parentId: [{ required: true, validator: validatePass, trigger: "blur" }],
  path: [{ required: true, validator: validatePass, trigger: "blur" }],
  name: [{ required: true, validator: validatePass, trigger: "blur" }],
  redirect: [{ required: true, validator: validatePass, trigger: "blur" }],
  icon: [{ required: true, validator: validatePass, trigger: "blur" }],
  title: [{ required: true, validator: validatePass, trigger: "blur" }]
});

//清空
const reset = () => {
  formRef.value?.resetFields();
};

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

const open = (params: DialogProps) => {
  dialogProps.value = params;
  dialogFlag.value = true;
};

const close = () => {
  formRef.value?.resetFields();
  dialogFlag.value = false;
};

defineExpose({
  open
});
</script>

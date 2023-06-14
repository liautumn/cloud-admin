<template>
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
      label-suffix=" :"
      :model="dialogProps.row"
      :rules="rules"
      class="demo-form-inline"
      label-position="right"
      :disabled="dialogProps.disabled"
    >
      <el-row>
        <el-col :span="dialogProps.row!.menuType === MENUTYPE.button ? 24 : 12">
          <el-form-item label="菜单类型" prop="menuType">
            <el-radio-group v-model="dialogProps.row!.menuType">
              <el-radio v-for="item in menuTypeData" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="dialogProps.row!.menuType != MENUTYPE.button && dialogProps.row!.isFull != WHETHER.yes">
          <el-form-item label="是否为外链" prop="isLink">
            <el-radio-group v-model="dialogProps.row!.isLink">
              <el-radio v-for="item in isData" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上级菜单" prop="parentId">
            <el-select v-model="dialogProps.row!.parentId" placeholder="请选择" filterable="true" style="width: 100%" clearable>
              <el-option v-for="item in selectData" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单名称" prop="title">
            <el-input v-model="dialogProps.row!.title" placeholder="菜单名称" clearable />
          </el-form-item>
        </el-col>
        <!--        <el-col :span="12" v-if="dialogProps.row!.menuType != MENUTYPE.button">-->
        <!--          <el-form-item label="路由 name" prop="name">-->
        <!--            <el-input v-model="dialogProps.row!.name" placeholder="路由 name" clearable />-->
        <!--          </el-form-item>-->
        <!--        </el-col>-->
        <el-col :span="12" v-if="dialogProps.row!.menuType != MENUTYPE.button">
          <el-form-item label="菜单图标" prop="icon">
            <SelectIcon title="菜单图标" placeholder="请选择图标" v-model:icon-value="dialogProps.row!.icon" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示顺序" prop="orderNum">
            <el-input-number v-model="dialogProps.row!.orderNum" :min="1" style="width: 100%"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="dialogProps.row!.menuType != MENUTYPE.button">
          <el-form-item label="路由地址" prop="path">
            <el-input v-model="dialogProps.row!.path" placeholder="路由地址" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="dialogProps.row!.menuType != MENUTYPE.directory">
          <el-form-item label="权限标识" prop="perms">
            <el-input v-model="dialogProps.row!.perms" placeholder="权限标识" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="dialogProps.row!.menuType === MENUTYPE.directory">
          <el-form-item label="重定向地址" prop="redirect">
            <el-input v-model="dialogProps.row!.redirect" placeholder="重定向地址" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="dialogProps.row!.menuType === MENUTYPE.menu && dialogProps.row!.isLink != WHETHER.yes">
          <el-form-item label="组件路径" prop="component">
            <el-input v-model="dialogProps.row!.component" placeholder="组件路径" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="dialogProps.row!.menuType === MENUTYPE.menu && dialogProps.row.isLink != WHETHER.yes">
          <el-form-item label="高亮菜单" prop="activeMenu">
            <el-input v-model="dialogProps.row!.activeMenu" placeholder="高亮菜单" clearable />
          </el-form-item>
        </el-col>
        <!--        <el-col :span="12" v-if="dialogProps.row!.menuType === MENUTYPE.menu">-->
        <!--          <el-form-item label="路由参数" prop="query">-->
        <!--            <el-input v-model="dialogProps.row!.query" placeholder="路由参数" clearable />-->
        <!--          </el-form-item>-->
        <!--        </el-col>-->
        <el-col :span="12" v-if="dialogProps.row!.menuType != MENUTYPE.button">
          <el-form-item label="是否隐藏" prop="isHide">
            <el-radio-group v-model="dialogProps.row!.isHide">
              <el-radio v-for="item in isData" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="dialogProps.row!.menuType != MENUTYPE.button">
          <el-form-item label="是否缓存" prop="isKeepAlive">
            <el-radio-group v-model="dialogProps.row!.isKeepAlive">
              <el-radio v-for="item in isData" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="dialogProps.row!.menuType != MENUTYPE.button">
          <el-form-item label="是否停用" prop="status">
            <el-radio-group v-model="dialogProps.row!.status">
              <el-radio v-for="item in isData" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="dialogProps.row!.menuType != MENUTYPE.button && dialogProps.row!.isLink != WHETHER.yes">
          <el-form-item label="是否固定页" prop="isAffix">
            <el-radio-group v-model="dialogProps.row!.isAffix">
              <el-radio v-for="item in isData" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="dialogProps.row!.menuType === MENUTYPE.menu && dialogProps.row!.isLink != WHETHER.yes">
          <el-form-item label="是否全屏" prop="isFull">
            <el-radio-group v-model="dialogProps.row!.isFull">
              <el-radio v-for="item in isData" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
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
        <el-button @click="reset">重置</el-button>
        <el-button type="primary" @click="submit"> 提交 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="menuForm">
import { FormInstance, FormRules, ElMessage } from "element-plus";
import SelectIcon from "@/components/SelectIcon/index.vue";
import { ref, reactive } from "vue";
import { MENUTYPE, WHETHER } from "@/utils/staticVariable";
import { Menu } from "@/api/interface/menu";

const formRef = ref<FormInstance>();
const dialogFlag = ref(false);

const selectData = [
  {
    label: "根目录",
    value: "0"
  },
  {
    label: "系统管理",
    value: "2"
  }
];

const isData = [
  {
    label: "是",
    value: "0"
  },
  {
    label: "否",
    value: "1"
  }
];

const menuTypeData = [
  {
    label: "目录",
    value: "0"
  },
  {
    label: "菜单",
    value: "1"
  },
  {
    label: "按钮",
    value: "2"
  }
];

//表单字段规则
const rules = reactive<FormRules>({
  parentId: [{ required: true, message: "不能为空", trigger: "blur" }],
  path: [{ required: true, message: "不能为空", trigger: "blur" }],
  icon: [{ required: true, message: "不能为空", trigger: "blur" }],
  title: [{ required: true, message: "不能为空", trigger: "blur" }]
});

//定义表单需要的参数
interface DialogProps {
  type: string;
  title: string;
  disabled: boolean;
  row: Partial<Menu.ResMenuList>;
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

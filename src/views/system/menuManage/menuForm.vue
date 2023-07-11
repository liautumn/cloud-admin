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
        <el-col :span="dialogProps.row!.menuType === MENUTYPE.button ? 24 : 12">
          <el-form-item label="菜单类型" prop="menuType">
            <el-radio-group v-model="dialogProps.row!.menuType">
              <el-radio v-for="item in menuType" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="dialogProps.row!.menuType != MENUTYPE.button && dialogProps.row!.isFull != WHETHER.yes">
          <el-form-item label="是否为外链" prop="isLink">
            <el-radio-group v-model="dialogProps.row!.isLink">
              <el-radio v-for="item in whether" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上级菜单" prop="parentId">
            <el-tree-select
              v-model="dialogProps.row!.parentId"
              :data="menuTreeList"
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
          <el-form-item label="菜单名称" prop="title">
            <el-input v-model="dialogProps.row!.title" placeholder="菜单名称" clearable />
          </el-form-item>
        </el-col>
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
          <el-form-item label="父菜单路由" prop="activeMenu">
            <el-input v-model="dialogProps.row!.activeMenu" placeholder="父菜单路由" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="dialogProps.row!.menuType != MENUTYPE.button">
          <el-form-item label="是否隐藏" prop="isHide">
            <el-radio-group v-model="dialogProps.row!.isHide">
              <el-radio v-for="item in whether" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="dialogProps.row!.menuType != MENUTYPE.button">
          <el-form-item label="是否缓存" prop="isKeepAlive">
            <el-radio-group v-model="dialogProps.row!.isKeepAlive">
              <el-radio v-for="item in whether" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否停用" prop="status">
            <el-radio-group v-model="dialogProps.row!.status">
              <el-radio v-for="item in whether" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="dialogProps.row!.menuType != MENUTYPE.button && dialogProps.row!.isLink != WHETHER.yes">
          <el-form-item label="是否固定页" prop="isAffix">
            <el-radio-group v-model="dialogProps.row!.isAffix">
              <el-radio v-for="item in whether" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="dialogProps.row!.menuType === MENUTYPE.menu && dialogProps.row!.isLink != WHETHER.yes">
          <el-form-item label="是否全屏" prop="isFull">
            <el-radio-group v-model="dialogProps.row!.isFull">
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
import { MENUTYPE, WHETHER } from "@/utils/dict/staticCode";
import { Menu } from "@/api/interface/system/menu/menu";
import { getMenuTree } from "@/api/modules/system/menu/menu";
import { menuType, whether } from "@/utils/dict/globalDict";

const formRef = ref<FormInstance>();
const dialogFlag = ref(false);

//获取菜单树下拉数据
const menuTreeList = ref();
const initMenuTreeList = () => {
  const param = {
    menuType: ["0", "1"],
    isGetRoot: true
  };
  getMenuTree(param).then(res => {
    menuTreeList.value = res.data;
  });
};
initMenuTreeList();

//表单字段规则
const rules = reactive<FormRules>({
  parentId: [{ required: true, message: "不能为空", trigger: "blur" }],
  path: [{ required: true, message: "不能为空", trigger: "blur" }],
  icon: [{ required: true, message: "不能为空", trigger: "blur" }],
  title: [{ required: true, message: "不能为空", trigger: "blur" }],
  perms: [{ required: true, message: "不能为空", trigger: "blur" }]
});

//定义表单需要的参数
interface DialogProps {
  type: string;
  title: string;
  disabled: boolean;
  row: Partial<Menu.ResList>;
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
    ElMessage.success({ message: `${dialogProps.value.title}成功！` });
    dialogProps.value.getTableList!();
    close();
  });
};

defineExpose({
  open
});
</script>

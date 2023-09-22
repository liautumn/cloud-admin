<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="菜单列表"
      row-key="id"
      highlight-current-row
      :columns="columns"
      :request-api="selectMenu"
      :pagination="false"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button type="primary" v-if="BUTTONS.insert" @click="openDialog('insert', formDefaultData)" :icon="CirclePlus">{{
          $t("crud.insert")
        }}</el-button>
        <el-button type="danger" v-if="BUTTONS.delete" @click="batchDelete(scope.selectedListIds)" :icon="Delete">{{
          $t("crud.delete")
        }}</el-button>
        <el-button type="primary" v-if="BUTTONS.import" @click="importClick" plain :icon="Upload">{{
          $t("crud.import")
        }}</el-button>
        <el-button type="primary" v-if="BUTTONS.export" @click="exportClick" plain :icon="Download">{{
          $t("crud.export")
        }}</el-button>
      </template>
      <!-- 菜单图标 -->
      <template #icon="scope">
        <el-icon :size="18">
          <component :is="scope.row.icon"></component>
        </el-icon>
      </template>
      <!-- 菜单操作 -->
      <template #operation="scope">
        <el-button type="primary" link v-if="BUTTONS.view" @click="openDialog('view', scope.row)" :icon="EditPen">{{
          $t("crud.view")
        }}</el-button>
        <el-button
          type="primary"
          link
          v-if="BUTTONS.insert"
          @click="openDialog('insertRow', { ...formDefaultData, ...{ parentId: scope.row.id } })"
          :icon="CirclePlus"
          >{{ $t("crud.insert") }}</el-button
        >
        <el-button type="primary" link v-if="BUTTONS.update" @click="openDialog('update', scope.row)" :icon="EditPen">{{
          $t("crud.update")
        }}</el-button>
        <el-popconfirm :title="$t('crud.deleteConfirm')" v-if="BUTTONS.delete" @confirm="deleteClick(scope.row)">
          <template #reference>
            <el-button type="danger" link :icon="Delete">{{ $t("crud.delete") }}</el-button>
          </template>
        </el-popconfirm>
      </template>
    </ProTable>

    <ImportExcel ref="importRef" />
    <MenuForm ref="dialogRef" />
  </div>
</template>

<script setup lang="ts" name="menu">
import { ref } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { Delete, EditPen, CirclePlus, Download, Upload } from "@element-plus/icons-vue";
import { useDownload } from "@/hooks/useDownload";
import ImportExcel from "@/components/ImportExcel/index.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Menu } from "@/api/interface/system/menu/menu";
import MenuForm from "./menuForm.vue";
import { selectMenu, insertMenu, updateMenu, deleteMenu, exportMenu, importMenu } from "@/api/modules/system/menu/menu";
import { dictParse } from "@/api/modules/system/dict/dict";
import { useI18n } from "vue-i18n";
import { useAuthButtons } from "@/hooks/useAuthButtons";

const $I18n = useI18n();
const { BUTTONS } = useAuthButtons();
const proTable = ref<ProTableInstance>();

// 表格配置项
const columns: ColumnProps<Menu.ResList>[] = [
  { type: "selection", fixed: "left", width: 60 },
  { prop: "title", label: "菜单名称", search: { el: "input" } },
  { prop: "icon", label: "菜单图标" },
  { prop: "name", label: "菜单 name" },
  { prop: "path", label: "菜单路径", width: 300 },
  {
    prop: "status",
    label: "是否停用",
    enum: () => dictParse("whether"),
    fieldNames: { label: "label", value: "value" }
  },
  { prop: "operation", label: "操作", width: 320 }
];

//声明参数
const formDefaultData = ref({
  id: "",
  title: "",
  name: "",
  path: "",
  component: "",
  redirect: "",
  parentId: "",
  icon: "",
  activeMenu: "",
  perms: "",
  orderNum: 1,
  query: "",
  isLink: "1",
  isHide: "1",
  isFull: "1",
  isAffix: "1",
  isKeepAlive: "1",
  menuType: "0",
  status: "1",
  remark: ""
});

//删除按钮
const deleteClick = async (row: Menu.ResObject) => {
  await deleteMenu(row.id);
  proTable.value?.getTableList();
  ElMessage.success($I18n.t("crud.deleteMsg"));
};

// 批量删除信息
const batchDelete = async (ids: string[]) => {
  if (ids.length === 0) {
    ElMessage.warning($I18n.t("crud.beforeSelect"));
    return;
  }
  await deleteMenu(ids.toString());
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
  ElMessage.success($I18n.t("crud.deleteMsg"));
};

// 导入
const importRef = ref<InstanceType<typeof ImportExcel> | null>(null);
const importClick = () => {
  const params = {
    title: "菜单列表",
    tempApi: exportMenu,
    importApi: importMenu,
    getTableList: proTable.value?.getTableList
  };
  importRef.value?.acceptParams(params);
};

// 导出用户列表
const exportClick = async () => {
  ElMessageBox.confirm($I18n.t("crud.confirmExport"), $I18n.t("crud.kindReminder"), { type: "warning" }).then(() =>
    useDownload(exportMenu, "菜单列表", proTable.value?.searchParam)
  );
};

// 打开 dialog(新增、查看、编辑)
const dialogRef = ref<InstanceType<typeof MenuForm> | null>(null);
const openDialog = (type: string, row: Partial<Menu.ResObject> = {}) => {
  const params = {
    type,
    row,
    title:
      type === "insert"
        ? $I18n.t("crud.insert")
        : type === "delete"
        ? row.title + " " + $I18n.t("crud.delete")
        : type === "update"
        ? $I18n.t("crud.update")
        : type === "view"
        ? $I18n.t("crud.view")
        : "",
    disabled: type === "view",
    api: type === "insert" ? insertMenu : type === "insertRow" ? insertMenu : type === "update" ? updateMenu : undefined,
    getTableList: proTable.value?.getTableList
  };
  dialogRef.value?.open(params);
};
</script>

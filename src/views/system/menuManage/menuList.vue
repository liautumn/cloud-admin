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
        <el-button type="primary" @click="openDialog('add', formDefaultData)" :icon="CirclePlus">新增</el-button>
        <el-button type="danger" @click="batchDelete(scope.selectedListIds)" :icon="Delete">删除</el-button>
        <el-button type="primary" @click="importClick" plain :icon="Upload">导入</el-button>
        <el-button type="primary" @click="exportClick" plain :icon="Download">导出</el-button>
      </template>
      <!-- 菜单图标 -->
      <template #icon="scope">
        <el-icon :size="18">
          <component :is="scope.row.icon"></component>
        </el-icon>
      </template>
      <!-- 菜单操作 -->
      <template #operation="scope">
        <el-button type="primary" link @click="openDialog('view', scope.row)" :icon="EditPen">查看</el-button>
        <el-button
          type="primary"
          link
          @click="openDialog('addRow', { ...formDefaultData, ...{ parentId: scope.row.id } })"
          :icon="CirclePlus"
          >新增</el-button
        >
        <el-button type="primary" link @click="openDialog('update', scope.row)" :icon="EditPen">编辑</el-button>
        <el-button type="danger" link @click="deleteClick(scope.row)" :icon="Delete">删除</el-button>
      </template>
    </ProTable>

    <ImportExcel ref="importRef" />
    <MenuForm ref="dialogRef" />
  </div>
</template>

<script setup lang="ts" name="menuMange">
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
  { prop: "operation", label: "操作", width: 300 }
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
const deleteClick = async (row: Menu.ResList) => {
  await deleteMenu(row.id);
  proTable.value?.getTableList();
  ElMessage.success("删除成功!");
};

// 批量删除信息
const batchDelete = async (ids: string[]) => {
  if (ids.length === 0) {
    ElMessage.error("请先选择");
    return;
  }
  await deleteMenu(ids.toString());
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
  ElMessage.success("删除成功!");
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
  ElMessageBox.confirm("确认导出数据?", "温馨提示", { type: "warning" }).then(() =>
    useDownload(exportMenu, "菜单列表", proTable.value?.searchParam)
  );
};

// 打开 dialog(新增、查看、编辑)
const dialogRef = ref<InstanceType<typeof MenuForm> | null>(null);
const openDialog = (type: string, row: Partial<Menu.ResList> = {}) => {
  const params = {
    type,
    row,
    title:
      type === "add"
        ? "新增"
        : type === "addRow"
        ? row.title + "新增"
        : type === "delete"
        ? "删除"
        : type === "update"
        ? "修改"
        : type === "view"
        ? "查看"
        : "",
    disabled: type === "view",
    api: type === "add" ? insertMenu : type === "addRow" ? insertMenu : type === "update" ? updateMenu : undefined,
    getTableList: proTable.value?.getTableList
  };
  dialogRef.value?.open(params);
};
</script>

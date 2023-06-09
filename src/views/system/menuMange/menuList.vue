<template>
  <div>
    <ProTable
      ref="proTable"
      title="菜单列表"
      row-key="id"
      highlight-current-row
      :columns="columns"
      :request-api="selectMenu"
      :pagination="true"
      @row-click="rowClick"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" @click="openDialog('add', null)" :icon="CirclePlus">新增菜单</el-button>
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
        <el-button type="primary" link @click="openDialog('update', scope.row)" :icon="EditPen">编辑</el-button>
        <el-button type="primary" @click="deleteBtn(scope.row)" link :icon="Delete">删除</el-button>
      </template>
    </ProTable>

    <MenuForm ref="dialogRef" />
  </div>
</template>

<script setup lang="ts" name="menuMange">
import { ref } from "vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { Delete, EditPen, CirclePlus } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import { selectMenu, insertMenu, updateMenu, deleteMenu } from "@/api/modules/menu";
import MenuForm from "./menuForm.vue";
import { ElMessage } from "element-plus";

const proTable = ref<ProTableInstance>();

// 单击行
const rowClick = (row: any, column: any) => {
  if (column.property == "radio" || column.property == "operation") return;
  ElMessage.success("当前行被点击了！");
};

const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};

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

// 表格配置项
const columns: ColumnProps[] = [
  { type: "index", label: "#" },
  { prop: "title", label: "菜单名称", search: { el: "input" } },
  { prop: "icon", label: "菜单图标" },
  {
    prop: "name",
    label: "菜单 name",
    sortable: true,
    tag: true,
    enum: selectData,
    search: {
      el: "select",
      props: {
        filterable: true,
        clearable: true
      }
    },
    fieldNames: { label: "label", value: "value" }
  },
  { prop: "path", label: "菜单路径", width: 300, search: { el: "input" } },
  { prop: "operation", label: "操作", width: 250 }
];

//删除按钮
const deleteBtn = async (row: any) => {
  await deleteMenu(row.id);
  ElMessage({
    message: "删除成功!",
    type: "success"
  });
};

// 打开 dialog(新增、查看、编辑)
const dialogRef = ref<InstanceType<typeof MenuForm> | null>(null);
const openDialog = (type: string, row: any) => {
  const params = {
    type,
    title: type === "add" ? "新增" : type === "delete" ? "删除" : type === "update" ? "修改" : type === "view" ? "查看" : "",
    row: { ...row },
    isView: type === "view",
    disabled: type === "view",
    api: type === "add" ? insertMenu : type === "update" ? updateMenu : undefined,
    getTableList: proTable.value?.getTableList
  };
  dialogRef.value?.open(params);
};
</script>

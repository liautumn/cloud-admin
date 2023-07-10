<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="角色信息"
      row-key="id"
      highlight-current-row
      :columns="columns"
      :request-api="selectRole"
      :pagination="true"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button type="primary" @click="openDialog('insert', formDefaultData)" :icon="CirclePlus">新增</el-button>
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
        <el-button type="primary" link @click="openDialog('update', scope.row)" :icon="EditPen">编辑</el-button>
        <el-popconfirm title="确定删除?" @confirm="deleteClick(scope.row)">
          <template #reference>
            <el-button type="danger" link :icon="Delete">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </ProTable>

    <ImportExcel ref="importRef" />
    <RoleForm ref="dialogRef" />
  </div>
</template>

<script setup lang="ts" name="roleList">
import { ref } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { Delete, EditPen, CirclePlus, Download, Upload } from "@element-plus/icons-vue";
import { useDownload } from "@/hooks/useDownload";
import ImportExcel from "@/components/ImportExcel/index.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Role } from "@/api/interface/system/role/role";
import RoleForm from "./roleForm.vue";
import { selectRole, insertRole, updateRole, deleteRole, exportRole, importRole } from "@/api/modules/system/role/role";
import { dictParse } from "@/api/modules/system/dict/dict";

const proTable = ref<ProTableInstance>();
const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};

// 表格配置项
const columns: ColumnProps<Role.ResList>[] = [
  { type: "selection", fixed: "left", width: 60 },
  { type: "index", width: 60, label: "序号" },
  { prop: "roleName", label: "角色名称", search: { el: "input" } },
  { prop: "roleKey", label: "角色权限", search: { el: "input" } },
  // { prop: "roleSort", label: "显示顺序" },
  // { prop: "dataScope", label: "数据范围" },
  // { prop: "menuCheckStrictly", label: "菜单树选择项是否关联显示" },
  // { prop: "deptCheckStrictly", label: "部门树选择项是否关联显示" },
  { prop: "remark", label: "备注" },
  {
    prop: "status",
    label: "是否停用",
    enum: () => dictParse("whether"),
    search: { el: "select", props: { filterable: true } },
    fieldNames: { label: "label", value: "value" }
  },
  { prop: "operation", label: "操作", width: 300 }
];

//声明参数
const formDefaultData = ref({
  roleName: "",
  roleKey: "",
  roleSort: "1",
  dataScope: "",
  menuCheckStrictly: "",
  deptCheckStrictly: "",
  remark: "",
  status: "1"
});

//删除按钮
const deleteClick = async (row: Role.ResList) => {
  await deleteRole(row.id);
  proTable.value?.getTableList();
  ElMessage.success("删除成功");
};

// 批量删除信息
const batchDelete = async (ids: string[]) => {
  if (ids.length === 0) {
    ElMessage.error("请先选择");
    return;
  }
  await deleteRole(ids.toString());
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
  ElMessage.success("删除成功");
};

// 导入
const importRef = ref<InstanceType<typeof ImportExcel> | null>(null);
const importClick = () => {
  const params = {
    title: "角色信息",
    tempApi: exportRole,
    importApi: importRole,
    getTableList: proTable.value?.getTableList
  };
  importRef.value?.acceptParams(params);
};

// 导出
const exportClick = async () => {
  ElMessageBox.confirm("确认导出数据?", "温馨提示", { type: "warning" }).then(() =>
    useDownload(exportRole, "角色信息", proTable.value?.searchParam)
  );
};

// 打开 dialog(新增、查看、编辑)
const dialogRef = ref<InstanceType<typeof RoleForm> | null>(null);
const openDialog = (type: string, row: Partial<Role.ResList> = {}) => {
  const params = {
    type,
    row,
    title: type === "insert" ? "新增" : type === "delete" ? "删除" : type === "update" ? "修改" : type === "view" ? "查看" : "",
    disabled: type === "view",
    api: type === "insert" ? insertRole : type === "update" ? updateRole : undefined,
    getTableList: proTable.value?.getTableList
  };
  dialogRef.value?.open(params);
};
</script>

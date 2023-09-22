<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="部门信息"
      row-key="id"
      highlight-current-row
      :columns="columns"
      :request-api="selectDept"
      :pagination="true"
      default-expand-all
      :data-callback="dataCallback"
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
    <DeptForm ref="dialogRef" />
  </div>
</template>

<script setup lang="ts" name="dept">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import ProTable from "@/components/ProTable/index.vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { Delete, EditPen, CirclePlus, Download, Upload } from "@element-plus/icons-vue";
import { useDownload } from "@/hooks/useDownload";
import ImportExcel from "@/components/ImportExcel/index.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Dept } from "@/api/interface/system/dept/dept";
import DeptForm from "./deptForm.vue";
import { selectDept, insertDept, updateDept, deleteDept, exportDept, importDept } from "@/api/modules/system/dept/dept";
import { useHandleData } from "@/hooks/useHandleData";
import { useAuthButtons } from "@/hooks/useAuthButtons";

const $I18n = useI18n();
const { BUTTONS } = useAuthButtons();
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
const columns: ColumnProps<Dept.ResObject>[] = [
  { type: "selection", fixed: "left", width: 60 },
  { prop: "deptName", label: "部门名称" },
  { prop: "leader", label: "负责人" },
  { prop: "phone", label: "联系电话" },
  { prop: "email", label: "邮箱" },
  { prop: "status", label: "是否停用" },
  { prop: "operation", label: "操作", width: 320 }
];

//声明参数
const formDefaultData = ref({
  parentId: "",
  ancestors: "",
  deptName: "",
  orderNum: 1,
  leader: "",
  phone: "",
  email: "",
  status: "1"
});

//删除按钮
const deleteClick = async (row: Dept.ResObject) => {
  await deleteDept(row.id);
  proTable.value?.getTableList();
  ElMessage.success($I18n.t("crud.deleteMsg"));
};

// 批量删除信息
const batchDelete = (ids: string[]) => {
  if (ids.length === 0) {
    ElMessage.warning($I18n.t("crud.beforeSelect"));
    return;
  }
  useHandleData(deleteDept, ids.toString());
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};

// 导入
const importRef = ref<InstanceType<typeof ImportExcel> | null>(null);
const importClick = () => {
  const params = {
    title: "部门信息",
    tempApi: exportDept,
    importApi: importDept,
    getTableList: proTable.value?.getTableList
  };
  importRef.value?.acceptParams(params);
};

// 导出
const exportClick = async () => {
  ElMessageBox.confirm($I18n.t("crud.confirmExport"), $I18n.t("crud.kindReminder"), { type: "warning" }).then(() =>
    useDownload(exportDept, "部门信息", proTable.value?.searchParam)
  );
};

// 打开 dialog(新增、查看、编辑)
const dialogRef = ref<InstanceType<typeof DeptForm> | null>(null);
const openDialog = (type: string, row: Partial<Dept.ResObject> = {}) => {
  const params = {
    type,
    row,
    title:
      type === "insert"
        ? $I18n.t("crud.insert")
        : type === "insertRow"
        ? $I18n.t("crud.insert")
        : type === "delete"
        ? $I18n.t("crud.delete")
        : type === "update"
        ? $I18n.t("crud.update")
        : type === "view"
        ? $I18n.t("crud.view")
        : "",
    disabled: type === "view",
    api: type === "insert" ? insertDept : type === "insertRow" ? insertDept : type === "update" ? updateDept : undefined,
    getTableList: proTable.value?.getTableList
  };
  dialogRef.value?.open(params);
};
</script>

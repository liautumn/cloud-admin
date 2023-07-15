<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="字典管理"
      row-key="id"
      highlight-current-row
      :columns="columns"
      :request-api="selectDictType"
      :pagination="true"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button type="primary" v-if="BUTTONS.insert" @click="openDialog('insert', null)" :icon="CirclePlus">{{
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
        <el-button type="primary" link v-if="BUTTONS.allocation" @click="toDictDataList(scope.row)" :icon="MoreFilled">{{
          $t("crud.allocation")
        }}</el-button>
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
    <DictForm ref="dialogRef" />
  </div>
</template>

<script setup lang="ts" name="dictMange">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { Delete, EditPen, CirclePlus, MoreFilled, Upload, Download } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import {
  selectDictType,
  insertDictType,
  updateDictType,
  deleteDictType,
  exportDictType,
  importDictType,
  dictParse
} from "@/api/modules/system/dict/dict";
import DictForm from "./dictForm.vue";
import { useDownload } from "@/hooks/useDownload";
import { ElMessage, ElMessageBox } from "element-plus";
import ImportExcel from "@/components/ImportExcel/index.vue";
import { dictStore } from "@/stores/modules/dict";
import { useI18n } from "vue-i18n";
import { useAuthButtons } from "@/hooks/useAuthButtons";

const $I18n = useI18n();
const { BUTTONS } = useAuthButtons();
const router = useRouter();
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
const columns: ColumnProps[] = [
  { type: "index", width: 60, label: "序号" },
  { prop: "dictName", label: "字典名称", search: { el: "input" } },
  { prop: "dictType", label: "字典类型", search: { el: "input" } },
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

//删除按钮
const deleteClick = async (row: any) => {
  await deleteDictType(row.id);
  proTable.value?.getTableList();
  ElMessage.success($I18n.t("crud.deleteMsg"));
};

// 批量删除信息
const batchDelete = async (ids: string[]) => {
  if (ids.length === 0) {
    ElMessage.warning($I18n.t("crud.beforeSelect"));
    return;
  }
  await deleteDictType(ids.toString());
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
  ElMessage.success($I18n.t("crud.deleteMsg"));
};

// 导入
const importRef = ref<InstanceType<typeof ImportExcel> | null>(null);
const importClick = () => {
  const params = {
    title: "字典类型列表",
    tempApi: exportDictType,
    importApi: importDictType,
    getTableList: proTable.value?.getTableList
  };
  importRef.value?.acceptParams(params);
};

// 导出用户列表
const exportClick = async () => {
  ElMessageBox.confirm($I18n.t("crud.confirmExport"), $I18n.t("crud.kindReminder"), { type: "warning" }).then(() =>
    useDownload(exportDictType, "字典类型列表", proTable.value?.searchParam)
  );
};

// 打开 dialog(新增、查看、编辑)
const dialogRef = ref<InstanceType<typeof DictForm> | null>(null);
const openDialog = (type: string, row: any) => {
  const params = {
    type,
    title:
      type === "insert"
        ? $I18n.t("crud.insert")
        : type === "delete"
        ? $I18n.t("crud.delete")
        : type === "update"
        ? $I18n.t("crud.update")
        : type === "view"
        ? $I18n.t("crud.view")
        : "",
    row: { ...row },
    isView: type === "view",
    disabled: type === "view",
    api: type === "insert" ? insertDictType : type === "update" ? updateDictType : undefined,
    getTableList: proTable.value?.getTableList
  };
  dialogRef.value?.open(params);
};

// 跳转详情页
const toDictDataList = (row: any) => {
  //存入字典状态
  dictStore().set(row);
  router.push(`/system/dictDataManage?id=${row.id}&dictName=${row.dictName}`);
};
</script>

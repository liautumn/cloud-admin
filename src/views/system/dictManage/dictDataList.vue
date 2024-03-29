<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      row-key="id"
      highlight-current-row
      :columns="columns"
      :request-api="selectDictData"
      :pagination="true"
      :data-callback="dataCallback"
      :init-param="{ dictTypeId: route.query!.id }"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button type="primary" v-if="BUTTONS.insert" @click="openDialog('insert', insertRow)" :icon="CirclePlus">
          {{ $t("crud.insert") }}
        </el-button>
        <el-button type="danger" v-if="BUTTONS.delete" @click="batchDelete(scope.selectedListIds)" :icon="Delete">
          {{ $t("crud.delete") }}
        </el-button>
        <el-button type="primary" v-if="BUTTONS.import" @click="importClick" plain :icon="Upload">
          {{ $t("crud.import") }}
        </el-button>
        <el-button type="primary" v-if="BUTTONS.export" @click="exportClick" plain :icon="Download">
          {{ $t("crud.export") }}
        </el-button>
      </template>
      <!-- 菜单图标 -->
      <template #icon="scope">
        <el-icon :size="18">
          <component :is="scope.row.icon"></component>
        </el-icon>
      </template>
      <!-- 菜单操作 -->
      <template #operation="scope">
        <el-button type="primary" link v-if="BUTTONS.view" @click="openDialog('view', scope.row)" :icon="EditPen">
          {{ $t("crud.view") }}
        </el-button>
        <el-button type="primary" link v-if="BUTTONS.update" @click="openDialog('update', scope.row)" :icon="EditPen">
          {{ $t("crud.update") }}
        </el-button>
        <el-popconfirm :title="$t('crud.deleteConfirm')" v-if="BUTTONS.delete" @confirm="deleteClick(scope.row)">
          <template #reference>
            <el-button type="danger" link :icon="Delete">{{ $t("crud.delete") }}</el-button>
          </template>
        </el-popconfirm>
      </template>
    </ProTable>

    <ImportExcel ref="importRef" />
    <DictDataForm ref="dialogRef" />
  </div>
</template>

<script setup lang="ts" name="dictData">
import { ref } from "vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { Delete, EditPen, CirclePlus, Upload, Download } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import {
  selectDictData,
  insertDictData,
  updateDictData,
  deleteDictData,
  exportDictData,
  importDictData
} from "@/api/modules/system/dict/dict";
import DictDataForm from "./dictDataForm.vue";
import { useDownload } from "@/hooks/useDownload";
import { ElMessage, ElMessageBox } from "element-plus";
import ImportExcel from "@/components/ImportExcel/index.vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import { dictParse } from "@/api/modules/system/dict/dict";

const $I18n = useI18n();
const { BUTTONS } = useAuthButtons();
const route = useRoute();
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
  { type: "selection", fixed: "left", width: 60 },
  { type: "index", width: 60, label: "序号" },
  { prop: "dictLabel", label: "数据标签", search: { el: "input" } },
  { prop: "dictValue", label: "数据键值", search: { el: "input" } },
  { prop: "dictSort", label: "排序" },
  {
    prop: "isDefault",
    label: "是否默认",
    enum: () => dictParse("whether"),
    fieldNames: { label: "label", value: "value" }
  },
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

const insertRow = {
  dictTypeId: route.query!.id,
  dictType: route.query!.dictType
};

//删除按钮
const deleteClick = async (row: any) => {
  await deleteDictData(row.id);
  proTable.value?.getTableList();
  ElMessage.success($I18n.t("crud.deleteMsg"));
};

// 批量删除
const batchDelete = async (ids: string[]) => {
  if (ids.length === 0) {
    ElMessage.warning($I18n.t("crud.beforeSelect"));
    return;
  }
  await deleteDictData(ids.toString());
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
  ElMessage.success($I18n.t("crud.deleteMsg"));
};

// 导入
const importRef = ref<InstanceType<typeof ImportExcel> | null>(null);
const importClick = () => {
  const params = {
    title: "字典数据列表",
    tempApi: exportDictData,
    importApi: importDictData,
    getTableList: proTable.value?.getTableList
  };
  importRef.value?.acceptParams(params);
};

// 导出
const exportClick = async () => {
  ElMessageBox.confirm($I18n.t("crud.confirmExport"), $I18n.t("crud.kindReminder"), { type: "warning" }).then(() =>
    useDownload(exportDictData, "字典数据列表", { ...proTable.value?.searchParam, ...{ dictTypeId: route.query.id } })
  );
};

// 打开 dialog(新增、查看、编辑)
const dialogRef = ref<InstanceType<typeof DictDataForm> | null>(null);
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
    api: type === "insert" ? insertDictData : type === "update" ? updateDictData : undefined,
    getTableList: proTable.value?.getTableList
  };
  dialogRef.value?.open(params);
};

// eslint-disable-next-line vue/no-expose-after-await
defineExpose({
  open
});
</script>

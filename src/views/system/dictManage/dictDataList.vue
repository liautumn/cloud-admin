<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      :title="route.query.dictName"
      row-key="id"
      highlight-current-row
      :columns="columns"
      :request-api="selectDictData"
      :pagination="true"
      :data-callback="dataCallback"
      :init-param="{ dictTypeId: route.query.id }"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button type="primary" @click="openDialog('add', null)" :icon="CirclePlus">新增数据</el-button>
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
        <el-button type="primary" link @click="openDialog('update', scope.row)" :icon="EditPen">编辑</el-button>
        <el-button type="primary" link @click="deleteBtn(scope.row)" :icon="Delete">删除</el-button>
      </template>
    </ProTable>

    <ImportExcel ref="importRef" />
    <DictDataForm ref="dialogRef" />
  </div>
</template>

<script setup lang="ts" name="dictMange">
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
} from "@/api/modules/dict";
import DictDataForm from "./dictDataForm.vue";
import { useDownload } from "@/hooks/useDownload";
import { ElMessage, ElMessageBox } from "element-plus";
import ImportExcel from "@/components/ImportExcel/index.vue";
import { useRoute } from "vue-router";

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
  { type: "index", width: 60, label: "序号" },
  { prop: "dictLabel", label: "数据标签", search: { el: "input" } },
  { prop: "dictValue", label: "数据键值", search: { el: "input" } },
  { prop: "dictSort", label: "排序" },
  { prop: "isDefault", label: "是否默认" },
  { prop: "status", label: "状态" },
  { prop: "remark", label: "备注" },
  { prop: "createTime", label: "创建时间" },
  { prop: "operation", label: "操作", width: 300 }
];

//删除按钮
const deleteBtn = async (row: any) => {
  await deleteDictData(row.id);
  proTable.value?.getTableList();
  ElMessage({
    message: "删除成功!",
    type: "success"
  });
};

// 批量删除
const batchDelete = async (ids: string[]) => {
  if (ids.length === 0) {
    ElMessage({
      message: "请先选择",
      type: "error"
    });
    return;
  }
  await deleteDictData(ids.toString());
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
  ElMessage({
    message: "删除成功!",
    type: "success"
  });
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
  ElMessageBox.confirm("确认导出数据?", "温馨提示", { type: "warning" }).then(() =>
    useDownload(exportDictData, "字典数据列表", proTable.value?.searchParam)
  );
};

// 打开 dialog(新增、查看、编辑)
const dialogRef = ref<InstanceType<typeof DictDataForm> | null>(null);
const openDialog = (type: string, row: any) => {
  const params = {
    type,
    title: type === "add" ? "新增" : type === "delete" ? "删除" : type === "update" ? "修改" : type === "view" ? "查看" : "",
    row: { ...row },
    isView: type === "view",
    disabled: type === "view",
    api: type === "add" ? insertDictData : type === "update" ? updateDictData : undefined,
    getTableList: proTable.value?.getTableList
  };
  dialogRef.value?.open(params);
};

defineExpose({
  open
});
</script>

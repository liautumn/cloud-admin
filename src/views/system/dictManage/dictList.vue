<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="字典管理"
      row-key="id"
      highlight-current-row
      :columns="columns"
      :request-api="selectDict"
      :pagination="true"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" @click="openDialog('add', null)" :icon="CirclePlus">新增字典</el-button>
      </template>
      <!-- 菜单图标 -->
      <template #icon="scope">
        <el-icon :size="18">
          <component :is="scope.row.icon"></component>
        </el-icon>
      </template>
      <!-- 菜单操作 -->
      <template #operation="scope">
        <el-button type="primary" link @click="toDictDataPage(scope.row)" :icon="MoreFilled">配置</el-button>
        <el-button type="primary" link @click="openDialog('update', scope.row)" :icon="EditPen">编辑</el-button>
        <el-button type="primary" link @click="deleteBtn(scope.row)" :icon="Delete">删除</el-button>
      </template>
    </ProTable>

    <DictForm ref="dialogRef" />
    <DictDataForm ref="dictDataRef" />
  </div>
</template>

<script setup lang="ts" name="dictMange">
import { ref } from "vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { Delete, EditPen, CirclePlus, MoreFilled } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import { selectDict, insertDict, updateDict, deleteDict } from "@/api/modules/dict";
import DictForm from "./dictForm.vue";
import DictDataForm from "./dictDataList.vue";
import { ElMessage } from "element-plus";

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
  { prop: "status", label: "是否停用" },
  { prop: "remark", label: "备注" },
  { prop: "operation", label: "操作", width: 300 }
];

//删除按钮
const deleteBtn = async (row: any) => {
  await deleteDict(row.id);
  proTable.value?.getTableList();
  ElMessage({
    message: "删除成功!",
    type: "success"
  });
};

// 打开 dialog(新增、查看、编辑)
const dialogRef = ref<InstanceType<typeof DictForm> | null>(null);
const openDialog = (type: string, row: any) => {
  const params = {
    type,
    title: type === "add" ? "新增" : type === "delete" ? "删除" : type === "update" ? "修改" : type === "view" ? "查看" : "",
    row: { ...row },
    isView: type === "view",
    disabled: type === "view",
    api: type === "add" ? insertDict : type === "update" ? updateDict : undefined,
    getTableList: proTable.value?.getTableList
  };
  dialogRef.value?.open(params);
};

// 打开 dialog(配置)
const dictDataRef = ref<InstanceType<typeof DictDataForm> | null>(null);
const toDictDataPage = (row: any) => {
  const params = {
    id: row.id,
    title: row.dictName
  };
  dictDataRef.value?.open(params);
};
</script>

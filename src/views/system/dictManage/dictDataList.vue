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
      <template #tableHeader>
        <el-button type="primary" @click="openDialog('add', null)" :icon="CirclePlus">新增数据</el-button>
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
    <DictDataForm ref="dialogRef" />
  </div>
</template>

<script setup lang="ts" name="dictMange">
import { ref } from "vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { Delete, EditPen, CirclePlus } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import { selectDictData, insertDictData, updateDictData, deleteDictData } from "@/api/modules/dict";
import DictDataForm from "./dictDataForm.vue";
import { ElMessage } from "element-plus";
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

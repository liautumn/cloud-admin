<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="岗位信息"
      row-key="id"
      highlight-current-row
      :columns="columns"
      :request-api="selectPost"
      :pagination="true"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button type="primary" @click="openDialog('add', formDefaultData)" :icon="CirclePlus">新增菜单</el-button>
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
        <el-button type="danger" link @click="deleteClick(scope.row)" :icon="Delete">删除</el-button>
      </template>
    </ProTable>

    <ImportExcel ref="importRef" />
    <PostForm ref="dialogRef" />
  </div>
</template>

<script setup lang="ts" name="postList">
import { ref } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { Delete, EditPen, CirclePlus, Download, Upload } from "@element-plus/icons-vue";
import { useDownload } from "@/hooks/useDownload";
import ImportExcel from "@/components/ImportExcel/index.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Post } from "@/api/interface/post";
import PostForm from "./postForm.vue";
import { selectPost, selectOnePost, insertPost, updatePost, deletePost, exportPost, importPost } from "@/api/modules/post";

const proTable = ref<ProTableInstance>();
console.log(selectOnePost);
const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};

// 表格配置项
const columns: ColumnProps<Post.ResList>[] = [
  { type: "selection", fixed: "left", width: 60 },
  { type: "index", width: 60, label: "序号" },
  { prop: "postCode", label: "岗位编码", search: { el: "input" } },
  { prop: "postName", label: "岗位名称", search: { el: "input" } },
  { prop: "postSort", label: "显示顺序", search: { el: "input" } },
  { prop: "remark", label: "备注", search: { el: "input" } },
  { prop: "status", label: "是否停用", search: { el: "input" } },
  { prop: "operation", label: "操作", width: 300 }
];

//声明参数
const formDefaultData = ref<Post.ResList>({
  id: "",
  postCode: "",
  postName: "",
  postSort: "1",
  remark: "",
  status: "1"
});

//删除按钮
const deleteClick = async (row: Post.ResList) => {
  await deletePost(row.id);
  proTable.value?.getTableList();
  ElMessage({
    message: "删除成功!",
    type: "success"
  });
};

// 批量删除信息
const batchDelete = async (ids: string[]) => {
  if (ids.length === 0) {
    ElMessage({
      message: "请先选择",
      type: "error"
    });
    return;
  }
  await deletePost(ids.toString());
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
    title: "部门信息",
    tempApi: exportPost,
    importApi: importPost,
    getTableList: proTable.value?.getTableList
  };
  importRef.value?.acceptParams(params);
};

// 导出
const exportClick = async () => {
  ElMessageBox.confirm("确认导出数据?", "温馨提示", { type: "warning" }).then(() =>
    useDownload(exportPost, "部门信息", proTable.value?.searchParam)
  );
};

// 打开 dialog(新增、查看、编辑)
const dialogRef = ref<InstanceType<typeof PostForm> | null>(null);
const openDialog = (type: string, row: Partial<Post.ResList> = {}) => {
  const params = {
    type,
    row,
    title: type === "add" ? "新增" : type === "delete" ? "删除" : type === "update" ? "修改" : type === "view" ? "查看" : "",
    disabled: type === "view",
    api: type === "add" ? insertPost : type === "update" ? updatePost : undefined,
    getTableList: proTable.value?.getTableList
  };
  dialogRef.value?.open(params);
};
</script>

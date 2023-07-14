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
        <el-button type="primary" v-if="BUTTONS.insert" @click="openDialog('insert', formDefaultData)" :icon="CirclePlus"
          >新增</el-button
        >
        <el-button type="danger" v-if="BUTTONS.delete" @click="batchDelete(scope.selectedListIds)" :icon="Delete">删除</el-button>
        <el-button type="primary" v-if="BUTTONS.import" @click="importClick" plain :icon="Upload">导入</el-button>
        <el-button type="primary" v-if="BUTTONS.export" @click="exportClick" plain :icon="Download">导出</el-button>
      </template>
      <!-- 菜单图标 -->
      <template #icon="scope">
        <el-icon :size="18">
          <component :is="scope.row.icon"></component>
        </el-icon>
      </template>
      <!-- 菜单操作 -->
      <template #operation="scope">
        <el-button type="primary" v-if="BUTTONS.view" link @click="openDialog('view', scope.row)" :icon="EditPen">查看</el-button>
        <el-button type="primary" v-if="BUTTONS.update" link @click="openDialog('update', scope.row)" :icon="EditPen"
          >编辑</el-button
        >
        <el-popconfirm v-if="BUTTONS.delete" title="确定删除?" @confirm="deleteClick(scope.row)">
          <template #reference>
            <el-button type="danger" link :icon="Delete">删除</el-button>
          </template>
        </el-popconfirm>
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
import { useAuthButtons } from "@/hooks/useAuthButtons";
import { Post } from "@/api/interface/system/post/post";
import PostForm from "./postForm.vue";
import { dictParse } from "@/api/modules/system/dict/dict";
import { selectPost, insertPost, updatePost, deletePost, exportPost, importPost } from "@/api/modules/system/post/post";

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
const columns: ColumnProps<Post.ResList>[] = [
  { type: "selection", fixed: "left", width: 60 },
  { type: "index", width: 60, label: "序号" },
  { prop: "postName", label: "岗位名称", search: { el: "input" } },
  { prop: "postCode", label: "岗位编码", search: { el: "input" } },
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
  id: "",
  postCode: "",
  postName: "",
  postSort: 1,
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
    ElMessage.error("请先选择");
    return;
  }
  await deletePost(ids.toString());
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
  ElMessage.success("删除成功");
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
    title: type === "insert" ? "新增" : type === "delete" ? "删除" : type === "update" ? "修改" : type === "view" ? "查看" : "",
    disabled: type === "view",
    api: type === "insert" ? insertPost : type === "update" ? updatePost : undefined,
    getTableList: proTable.value?.getTableList
  };
  dialogRef.value?.open(params);
};
</script>

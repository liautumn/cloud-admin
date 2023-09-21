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
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button type="primary" v-if="BUTTONS.insert" @click="openDialog('insert', {})" :icon="CirclePlus"
          >{{ $t("crud.insert") }}
        </el-button>
        <el-button type="danger" v-if="BUTTONS.delete" @click="batchDelete(scope.selectedListIds)" :icon="Delete"
          >{{ $t("crud.delete") }}
        </el-button>
        <el-button type="primary" v-if="BUTTONS.import" @click="importClick" plain :icon="Upload"
          >{{ $t("crud.import") }}
        </el-button>
        <el-button type="primary" v-if="BUTTONS.export" @click="exportClick" plain :icon="Download"
          >{{ $t("crud.export") }}
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
        <el-button type="primary" v-if="BUTTONS.view" link @click="openDialog('view', scope.row)" :icon="EditPen"
          >{{ $t("crud.view") }}
        </el-button>
        <el-button type="primary" v-if="BUTTONS.update" link @click="openDialog('update', scope.row)" :icon="EditPen"
          >{{ $t("crud.update") }}
        </el-button>
        <el-popconfirm v-if="BUTTONS.delete" :title="$t('crud.deleteConfirm')" @confirm="deleteClick(scope.row)">
          <template #reference>
            <el-button type="danger" link :icon="Delete">{{ $t("crud.delete") }}</el-button>
          </template>
        </el-popconfirm>
      </template>
    </ProTable>

    <ImportExcel ref="importRef" />
    <PostForm ref="dialogRef" />
  </div>
</template>

<script setup lang="ts" name="post">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { ElMessage, ElMessageBox } from "element-plus";
import { Delete, EditPen, CirclePlus, Download, Upload } from "@element-plus/icons-vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import { useDownload } from "@/hooks/useDownload";
import { Post } from "@/api/interface/system/post/post";
import { dictParse } from "@/api/modules/system/dict/dict";
import { selectPost, insertPost, updatePost, deletePost, exportPost, importPost } from "@/api/modules/system/post/post";
import ImportExcel from "@/components/ImportExcel/index.vue";
import ProTable from "@/components/ProTable/index.vue";
import PostForm from "./postForm.vue";

const $I18n = useI18n();
const proTable = ref<ProTableInstance>();
const { BUTTONS } = useAuthButtons();

// 表格配置项
const columns: ColumnProps<Post.ResObject>[] = [
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

//删除按钮
const deleteClick = async (row: Post.ResObject) => {
  await deletePost(row.id);
  proTable.value?.getTableList();
  ElMessage.success($I18n.t("crud.deleteMsg"));
};

// 批量删除信息
const batchDelete = async (ids: string[]) => {
  if (ids.length === 0) {
    ElMessage.warning($I18n.t("crud.beforeSelect"));
    return;
  }
  await deletePost(ids.toString());
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
  ElMessage.success($I18n.t("crud.deleteMsg"));
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
  ElMessageBox.confirm($I18n.t("crud.confirmExport"), $I18n.t("crud.kindReminder"), { type: "warning" }).then(() =>
    useDownload(exportPost, "部门信息", proTable.value?.searchParam)
  );
};

// 打开 dialog(新增、查看、编辑)
const dialogRef = ref<InstanceType<typeof PostForm> | null>(null);
const openDialog = (type: string, row: Partial<Post.ResObject> = {}) => {
  const params = {
    type,
    row,
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
    disabled: type === "view",
    api: type === "insert" ? insertPost : type === "update" ? updatePost : undefined,
    getTableList: proTable.value?.getTableList
  };
  dialogRef.value?.openDialog(params);
};
</script>

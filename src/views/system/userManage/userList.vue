<template>
  <div class="content-box">
    <TreeFilter id="value" label="label" title="部门列表" :request-api="getDeptList" @change="changeTreeFilter" />
    <ProTable
      ref="proTable"
      title="用户信息"
      row-key="id"
      highlight-current-row
      :columns="columns"
      :request-api="selectUser"
      :pagination="true"
      :data-callback="dataCallback"
      :initParam="initParam"
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
        <!--        <div v-if="scope.row.userType !== USERTYPE">-->
        <el-button type="primary" link v-if="BUTTONS.view" @click="openDialog('view', scope.row)" :icon="View">{{
          $t("crud.view")
        }}</el-button>
        <el-button type="primary" link v-if="BUTTONS.update" @click="openDialog('update', scope.row)" :icon="EditPen">{{
          $t("crud.update")
        }}</el-button>
        <el-popconfirm :title="$t('crud.deleteConfirm')" v-if="BUTTONS.delete" @confirm="deleteClick(scope.row)">
          <template #reference>
            <el-button type="danger" link :icon="Delete">{{ $t("crud.delete") }}</el-button>
          </template>
        </el-popconfirm>
        <!--        </div>-->
      </template>
    </ProTable>

    <ImportExcel ref="importRef" />
    <UserForm ref="dialogRef" />
  </div>
</template>

<script setup lang="ts" name="userList">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import ProTable from "@/components/ProTable/index.vue";
import TreeFilter from "@/components/TreeFilter/index.vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { Delete, EditPen, CirclePlus, Download, Upload, View } from "@element-plus/icons-vue";
import { useDownload } from "@/hooks/useDownload";
import ImportExcel from "@/components/ImportExcel/index.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { User } from "@/api/interface/system/user/user";
import UserForm from "./userForm.vue";
// import { USERTYPE } from "@/utils/dict/staticCode";
import { selectUser, insertUser, updateUser, deleteUser, exportUser, importUser } from "@/api/modules/system/user/user";
import { getDeptList } from "@/api/modules/system/dept/dept";
import { dictParse } from "@/api/modules/system/dict/dict";
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

const initParam = ref({
  deptId: ""
});

const changeTreeFilter = (val: string) => {
  initParam.value.deptId = val;
  proTable.value?.getTableList();
};

// 表格配置项
const columns: ColumnProps<User.ResList>[] = [
  { type: "selection", fixed: "left", width: 60 },
  { type: "index", label: "序号", width: 60 },
  { prop: "userName", label: "账号", width: 150 },
  { prop: "nickName", label: "昵称", width: 150 },
  { prop: "sex", label: "性别", enum: () => dictParse("sex"), fieldNames: { label: "label", value: "value" } },
  {
    prop: "status",
    label: "是否停用",
    enum: () => dictParse("whether"),
    fieldNames: { label: "label", value: "value" },
    width: 100
  },
  { prop: "phonenumber", label: "手机", width: 120 },
  { prop: "email", label: "邮箱", width: 180 },
  { prop: "loginIp", label: "登录IP", width: 150 },
  { prop: "loginDate", label: "登录时间", width: 180 },
  { prop: "operation", label: "操作", fixed: "right", width: 250 }
];

//声明参数
const formDefaultData = ref({
  deptId: "",
  userName: "",
  nickName: "",
  userType: "",
  email: "",
  phonenumber: "",
  sex: "2",
  avatar: "",
  password: "123456",
  remark: "",
  status: "1",
  loginIp: "",
  loginDate: ""
});

//删除按钮
const deleteClick = async (row: User.ResList) => {
  await deleteUser(row.id);
  proTable.value?.getTableList();
  ElMessage.success($I18n.t("crud.deleteMsg"));
};

// 批量删除信息
const batchDelete = async (ids: string[]) => {
  if (ids.length === 0) {
    ElMessage.warning($I18n.t("crud.beforeSelect"));
    return;
  }
  await deleteUser(ids.toString());
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
  ElMessage.success($I18n.t("crud.deleteMsg"));
};

// 导入
const importRef = ref<InstanceType<typeof ImportExcel> | null>(null);
const importClick = () => {
  const params = {
    title: "用户信息",
    tempApi: exportUser,
    importApi: importUser,
    getTableList: proTable.value?.getTableList
  };
  importRef.value?.acceptParams(params);
};

// 导出
const exportClick = async () => {
  ElMessageBox.confirm($I18n.t("crud.confirmExport"), $I18n.t("crud.kindReminder"), { type: "warning" }).then(() =>
    useDownload(exportUser, "用户信息", proTable.value?.searchParam)
  );
};

// 打开 dialog(新增、查看、编辑)
const dialogRef = ref<InstanceType<typeof UserForm> | null>(null);
const openDialog = (type: string, row: Partial<User.ResList> = {}) => {
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
    api: type === "insert" ? insertUser : type === "update" ? updateUser : undefined,
    getTableList: proTable.value?.getTableList
  };
  dialogRef.value?.open(params);
};
</script>

<style>
.content-box {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  .descriptions-box {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    height: 100%;
  }
}
</style>

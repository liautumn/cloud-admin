<template>
  <div class="table-box">
    <ProTable ref="proTable" title="菜单列表" row-key="id" :indent="30" :columns="columns" :data="menuData" :pagination="false">
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus">新增菜单</el-button>
      </template>
      <!-- 菜单图标 -->
      <template #icon="scope">
        <el-icon :size="18">
          {{ scope.row.icon }}
          <!--          <component :is="scope.row.icon"></component>-->
        </el-icon>
      </template>
      <!-- 菜单操作 -->
      <template #operation>
        <el-button type="primary" link :icon="EditPen">编辑</el-button>
        <el-button type="primary" link :icon="Delete">删除</el-button>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="ts" name="menuMange">
import { onMounted, ref } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { Delete, EditPen, CirclePlus } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import { getMenuListApi } from "@/api/modules/menu";

// const proTable = ref();
onMounted(() => {
  getTreeFilter();
});

const menuData = ref([]);
const a = ref(0);
const getTreeFilter = async () => {
  const {
    data: { list, total }
  } = await getMenuListApi();
  menuData.value = list;
  a.value = total;
};

// 表格配置项
const columns: ColumnProps[] = [
  { type: "index", label: "#", width: 150 },
  { prop: "title", label: "菜单名称", align: "left", search: { el: "input" } },
  { prop: "icon", label: "菜单图标" },
  { prop: "name", label: "菜单 name" },
  { prop: "path", label: "菜单路径", width: 300, search: { el: "input" } },
  { prop: "operation", label: "操作", width: 250, fixed: "right" }
];
</script>

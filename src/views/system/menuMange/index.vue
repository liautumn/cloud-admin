<template>
  <div class="table-box">
    {{ menuData }}
    <!--    <ProTable ref="proTable" title="菜单列表" row-key="id" :indent="30" :columns="columns" :data="menuData" :pagination="false">-->
    <!--      &lt;!&ndash; 表格 header 按钮 &ndash;&gt;-->
    <!--      <template #tableHeader>-->
    <!--        <el-button type="primary" :icon="CirclePlus">新增菜单</el-button>-->
    <!--      </template>-->
    <!--      &lt;!&ndash; 菜单图标 &ndash;&gt;-->
    <!--      <template #icon="scope">-->
    <!--        <el-icon :size="18">-->
    <!--          <component :is="scope.row.icon"></component>-->
    <!--        </el-icon>-->
    <!--      </template>-->
    <!--      &lt;!&ndash; 菜单操作 &ndash;&gt;-->
    <!--      <template #operation>-->
    <!--        <el-button type="primary" link :icon="EditPen">编辑</el-button>-->
    <!--        <el-button type="primary" link :icon="Delete">删除</el-button>-->
    <!--      </template>-->
    <!--    </ProTable>-->
  </div>
</template>

<script setup lang="ts" name="menuMange">
import { ref } from "vue";
// import { ColumnProps } from "@/components/ProTable/interface";
// import { Delete, EditPen, CirclePlus } from "@element-plus/icons-vue";
// import authMenuList from "@/assets/json/authMenuList.json";
// import ProTable from "@/components/ProTable/index.vue";
import { getMenuListApi } from "@/api/modules/menu";

// const proTable = ref();
const menuData = ref(list);
const list = async () => {
  let { data } = await getMenuListApi();
  console.log(data);
};
list();

// 表格配置项
// const columns: ColumnProps[] = [
//   { type: "index", label: "#", width: 150 },
//   { prop: "title", label: "菜单名称", align: "left", search: { el: "input" } },
//   { prop: "icon", label: "菜单图标" },
//   { prop: "name", label: "菜单 name" },
//   { prop: "path", label: "菜单路径", width: 300, search: { el: "input" } },
//   { prop: "component", label: "组件路径", width: 300 },
//   { prop: "operation", label: "操作", width: 250, fixed: "right" }
// ];
</script>

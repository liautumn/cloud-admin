<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="菜单列表"
      row-key="id"
      :indent="30"
      :columns="columns"
      :data="menuData"
      :pagination="true"
      @qhpagenum="getpagenum"
      @qhpagenumer="getpagenumer"
      @searchdata="getsearchdata"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" @click="addmode" :icon="CirclePlus">新增菜单</el-button>
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

    <!-- 添加框 -->
    <el-dialog v-model="addeaditmodeval.active" title="添加菜单" width="40%" draggable :modal="false">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        status-icon
        :rules="rules"
        label-width="120px"
        class="demo-form-inline"
        label-position="left"
      >
        <el-form-item label="菜单名称:" prop="pass" label-width="80">
          <el-input v-model="ruleForm.pass" />
        </el-form-item>
        <el-form-item label="name:" prop="checkPass" label-width="80">
          <el-input v-model="ruleForm.checkPass" />
        </el-form-item>
        <el-form-item label="路由地址:" prop="pass" label-width="80">
          <el-input v-model="ruleForm.pass" />
        </el-form-item>
        <el-form-item label="重定向:" prop="checkPass" label-width="80">
          <el-input v-model="ruleForm.checkPass" />
        </el-form-item>
        <el-form-item label="菜单目录:" prop="age" label-width="80">
          <el-input v-model.number="ruleForm.age" />
        </el-form-item>
        <el-form-item label="菜单图标:" prop="age" label-width="80">
          <el-input v-model.number="ruleForm.age" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="resetForm(ruleFormRef)">重置</el-button>
          <el-button type="primary" @click="submitForm(ruleFormRef)"> 提交 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="menuMange">
import { onMounted, ref, reactive } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { Delete, EditPen, CirclePlus } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import { getMenuListApi } from "@/api/modules/menu";
import type { FormInstance, FormRules } from "element-plus";

const proTable = ref(null);

onMounted(() => {
  console.log(proTable.value.search);
  getTreeFilter();
});

// 新增参数
const addeaditmodeval = reactive({
  title: "新增",
  active: false
});

// 新增
const addmode = () => {
  addeaditmodeval.title = "新增";
  addeaditmodeval.active = true;
};

const menuData = ref([]);
const a = ref(0);

const state = reactive({
  pageNum: 1,
  pageSize: 10
});
//切换页码
const getpagenum = (e: any) => {
  // console.log(e);
  state.pageSize = e;
  getTreeFilter();
};
//切换页码
const getpagenumer = (e: any) => {
  // console.log(e);
  state.pageNum = e;
  getTreeFilter();
};

//搜索
const getsearchdata = (e: any) => {
  const keys = Object.keys(e);
  keys.forEach(i => {
    Reflect.set(state, i, e[i]);
  });
  getTreeFilter();
};
const getTreeFilter = async () => {
  const {
    data: { list, total }
  } = await getMenuListApi(state);
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
// 表单
const ruleFormRef = ref<FormInstance>();

const checkAge = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error("Please input the age"));
  }
  setTimeout(() => {
    if (!Number.isInteger(value)) {
      callback(new Error("Please input digits"));
    } else {
      if (value < 18) {
        callback(new Error("Age must be greater than 18"));
      } else {
        callback();
      }
    }
  }, 1000);
};

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("Please input the password"));
  } else {
    if (ruleForm.checkPass !== "") {
      if (!ruleFormRef.value) return;
      ruleFormRef.value.validateField("checkPass", () => null);
    }
    callback();
  }
};
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("Please input the password again"));
  } else if (value !== ruleForm.pass) {
    callback(new Error("Two inputs don't match!"));
  } else {
    callback();
  }
};

const ruleForm = reactive({
  pass: "",
  checkPass: "",
  age: "",
  parentId: 0, //父级
  path: "", //路径
  name: "", //name
  redirect: "", //重定向
  icon: "", //图标
  title: "", //名称
  component: "string",
  activeMenu: "string",
  isLink: "string",
  isHide: "string",
  isFull: "string",
  isAffix: "string",
  isKeepAlive: "string",
  query: "string"
});

const rules = reactive<FormRules>({
  pass: [{ validator: validatePass, trigger: "blur" }],
  checkPass: [{ validator: validatePass2, trigger: "blur" }],
  age: [{ validator: checkAge, trigger: "blur" }]
});

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(valid => {
    if (valid) {
      console.log("submit!");
    } else {
      console.log("error submit!");
      return false;
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>
<style scoped>
.demo-form-inline .el-form-item {
  width: 50%;
}
.demo-form-inline .el-input {
  width: 90%;
}
.demo-form-inline {
  display: flex;
  flex-wrap: wrap;
}
</style>

<template>
  <el-dialog
    v-model="dialogFlag"
    :close-on-click-modal="true"
    :destroy-on-close="true"
    @close="close"
    :title="dialogProps.title"
    width="50%"
    top="7vh"
    draggable
    :modal="true"
  >
    <el-form
      ref="formRef"
      label-width="100px"
      label-suffix=" :"
      :model="dialogProps.row"
      :rules="rules"
      label-position="right"
      :disabled="dialogProps.disabled"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="单图片上传" prop="postName">
            <UploadImg v-model:fileId="dialogProps.row!.postName" width="135px" height="135px" :file-size="3">
              <template #empty>
                <el-icon>
                  <Avatar />
                </el-icon>
                <span>请上传图片</span>
              </template>
              <template #tip> 头像大小不能超过 3M</template>
            </UploadImg>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="多图片上传" prop="remark">
            <UploadImgs v-model:fileIds="dialogProps.row!.remark" :limit="3" height="140px" width="140px">
              <template #empty>
                <el-icon>
                  <Picture />
                </el-icon>
                <span>请上传图片</span>
              </template>
              <template #tip> 最多上传 3 张图片</template>
            </UploadImgs>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="图片预览" prop="view">
            <ImgView v-model:file-id="dialogProps.row!.remark" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="岗位编码" prop="postCode">
            <el-input v-model="dialogProps.row!.postCode" placeholder="岗位编码" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="岗位名称" prop="postName">
            <el-input v-model="dialogProps.row!.postName" placeholder="岗位名称" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示顺序" prop="postSort">
            <el-input-number v-model="dialogProps.row!.postSort" :min="1" style="width: 100%"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否停用" prop="isHide">
            <el-radio-group v-model="dialogProps.row!.status">
              <el-radio v-for="item in isData" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input
              type="textarea"
              v-model="dialogProps.row!.remark"
              :autosize="{ minRows: 2, maxRows: 8 }"
              placeholder="备注"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer" v-if="!dialogProps.disabled">
        <el-button @click="reset">重置</el-button>
        <el-button type="primary" @click="submit"> 提交 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="postForm">
import { FormInstance, FormRules, ElMessage } from "element-plus";
import { ref, reactive } from "vue";
import { Post } from "@/api/interface/post";
import UploadImg from "@/components/Upload/Img.vue";
import UploadImgs from "@/components/Upload/Imgs.vue";
import ImgView from "@/components/Upload/imgView.vue";
// import { dictParse } from "@/api/modules/dict";

// const dictWhether = ref({});
// onMounted(async () => {
//   dictWhether.value = await dictParse("whether");
// });

const formRef = ref<FormInstance>();
const dialogFlag = ref(false);

const isData = [
  {
    label: "是",
    value: "0"
  },
  {
    label: "否",
    value: "1"
  }
];

//表单字段规则
const rules = reactive<FormRules>({
  postCode: [{ required: true, message: "不能为空", trigger: "blur" }]
});

//定义表单需要的参数
interface DialogProps {
  type: string;
  title: string;
  disabled: boolean;
  row: Partial<Post.ResList>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

//声明参数
const dialogProps = ref<DialogProps>({
  type: "",
  title: "",
  disabled: false,
  row: {}
});

//打开dialog并传入表单数据等参数
const open = (params: DialogProps) => {
  dialogProps.value = params;
  dialogFlag.value = true;
};

//关闭dialog
const close = () => {
  formRef.value?.resetFields();
  dialogFlag.value = false;
};

//重置
const reset = () => {
  formRef.value?.resetFields();
};

//提交
const submit = () => {
  formRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      await dialogProps.value.api!(dialogProps.value.row);
      ElMessage.success({ message: `${dialogProps.value.title}成功！` });
      dialogProps.value.getTableList!();
      close();
    } catch (error) {
      ElMessage({
        message: error,
        type: "error"
      });
    }
  });
};

defineExpose({
  open
});
</script>

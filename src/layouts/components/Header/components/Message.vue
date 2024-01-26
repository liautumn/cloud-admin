<template>
  <div class="message">
    <el-badge :value="unreadNum" class="item">
      <i :class="'iconfont icon-xiaoxi'" @click="openDialog" class="toolBar-icon" />
    </el-badge>
    <el-dialog
      v-model="dialogFlag"
      title="消息列表"
      modal
      draggable
      close-on-click-modal
      destroy-on-close
      @open="open"
      @close="close"
      top="15vh"
      width="50%"
      style="border-radius: 8px"
    >
      <div class="dialogDiv">
        <el-table :data="messageList" style="width: 100%" @row-click="rowClick">
          <el-table-column prop="title" label="标题" align="center" />
          <el-table-column prop="content" label="内容" align="center" />
          <el-table-column prop="createBy" label="发送者" align="center" />
          <el-table-column prop="createTime" label="发送时间" align="center" />
          <el-table-column fixed="right" label="操作" width="120" align="center">
            <template #default="scope">
              <el-button link type="primary" v-if="scope.row.status !== '2'" size="small" @click="yd(scope.$index, scope.row)"
                >已读
              </el-button>
              <el-button link type="danger" size="small" @click="qc(scope.$index, scope.row)">清除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          v-model:current-page="queryParams.pageNum"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :small="true"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores/modules/user";
import { Message } from "@/api/interface/system/message/message";
import { MQTT_SERVICE, MQTT_USERNAME, MQTT_PASSWORD } from "@/config";
import { selectMessage, updateMessage, deleteMessage, getUnreadNum } from "@/api/modules/system/message/message";
import Stomp from "stompjs";

const dialogFlag = ref(false);
const messageList = ref<Message.ResObject[]>([]);
const total = ref<number>(0);
const unreadNum = ref<number>(0);
const queryParams = ref<Message.ReqParams>({
  title: "",
  content: "",
  path: "",
  type: "",
  status: "",
  pageNum: 1,
  pageSize: 10
});

const openDialog = () => {
  dialogFlag.value = true;
};

const initUnreadNum = () => {
  getUnreadNum().then(res => {
    unreadNum.value = res.data;
  });
};

let router = useRouter();
const rowClick = (row: Message.ResObject) => {
  router.push({
    path: row.path
  });
  dialogFlag.value = false;
};

const yd = (index: number, item: Message.ResObject) => {
  console.log(item, index);
  item.status = "2";
  updateMessage(item).then(() => {
    open();
    initUnreadNum();
  });
};

const qc = (index: number, item: Message.ResObject) => {
  console.log(item, index);
  item.status = "2";
  updateMessage(item).then(() => {
    deleteMessage(item.id).then(() => {
      open();
      initUnreadNum();
    });
  });
};

// ===================================================mq
let userStore = useUserStore();
const VIRTUAL_HOST = "/"; //  侦听器端口
const QUEUE_NAME = "message.direct.queue." + userStore.userInfo.id; //  侦听队列
let client = Stomp.client(MQTT_SERVICE);
const connectMQ = () => {
  //进行连接
  client.connect(MQTT_USERNAME, MQTT_PASSWORD, onConnected, onFailed, VIRTUAL_HOST);
};
const onConnected = () => {
  //订阅频道
  client.subscribe(QUEUE_NAME, responseCallback, onFailed);
};
const onFailed = (frame: any) => {
  console.log("MQ Failed: " + frame);
  ElMessage.error("MQ Failed: " + frame);
};
// 回传消息
const responseCallback = (frame: any) => {
  console.log("MQ msg=>" + frame.body);
  //接收消息处理
  let data: Message.ResObject = JSON.parse(frame.body);
  messageList.value.unshift(data);
  total.value = total.value + 1;
  //通知用户
  ElMessage.success("来新消息了！");
};
// 断开相应的连接
const closeMQ = () => {
  client.disconnect(function () {
    console.log(userStore.userInfo.id + " 已退出连接");
  });
};
// ===================================================mq

//开启时触发
const open = () => {
  selectMessage(queryParams.value).then(res => {
    messageList.value = res.data.list;
    queryParams.value.pageSize = res.data.pageSize;
    queryParams.value.pageNum = res.data.pageNum;
    total.value = res.data.total;
  });
};
//关闭时触发
const close = () => {
  dialogFlag.value = false;
};

const handleSizeChange = (val: number) => {
  console.log("handleSizeChange--->", val);
  open();
};

const handleCurrentChange = (val: number) => {
  console.log("handleCurrentChange--->", val);
  open();
};

onMounted(() => {
  connectMQ();
  initUnreadNum();
});

defineExpose({
  closeMQ
});
</script>

<style scoped lang="scss">
.message-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 260px;
  line-height: 45px;
}

.message-list {
  display: flex;
  flex-direction: column;

  .message-item {
    display: flex;
    align-items: center;
    padding: 15px 0 0 0;
    border-bottom: 1px solid var(--el-border-color-light);

    &:last-child {
      border: none;
    }

    .message-icon {
      width: 40px;
      height: 40px;
      margin: 0 20px 0 5px;
    }

    .message-content {
      display: flex;
      flex-direction: column;

      .message-title {
        margin-bottom: 5px;
      }

      .message-date {
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }
    }
  }
}

.dialogDiv {
  height: 500px;
  overflow: auto;
}
</style>

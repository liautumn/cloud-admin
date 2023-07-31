<template>
  <div class="message">
    <el-popover placement="bottom" :width="310" trigger="click">
      <template #reference>
        <el-badge :value="1" class="item">
          <i :class="'iconfont icon-xiaoxi'" class="toolBar-icon"></i>
        </el-badge>
      </template>
      <el-tabs v-model="activeName">
        <el-tab-pane label="通知(1)" name="first">
          <div class="message-list">
            <div class="message-item">
              <img src="@/assets/images/msg01.png" alt="" class="message-icon" />
              <div class="message-content">
                <span class="message-title">一键三连 autumn-cloud 🧡</span>
                <span class="message-date">一分钟前</span>
              </div>
            </div>
          </div>
          <div>
            <el-input v-model="msg" type="text" />
            <el-button type="primary" @click="sendMessage">发送</el-button>
            <el-button type="primary" @click="closeWebSocket">关闭</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="消息(0)" name="second">
          <div class="message-empty">
            <img src="@/assets/images/notData.png" alt="notData" />
            <div>暂无消息</div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="代办(0)" name="third">
          <div class="message-empty">
            <img src="@/assets/images/notData.png" alt="notData" />
            <div>暂无代办</div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "@/stores/modules/user";

const activeName = ref("first");
let userStore = useUserStore();

let webSocket = new WebSocket("ws://127.0.0.1:8088/system/websocket/" + userStore.userInfo.id);
//连通之后的回调事件
webSocket.onopen = function () {
  console.log("已经连通了websocket");
};

//接收后台服务端的消息
webSocket.onmessage = function (evt) {
  console.log("数据已接收:", evt.data);
};

//连接关闭的回调事件
webSocket.onclose = function () {
  console.log("连接已关闭...");
};

const closeWebSocket = () => {
  //直接关闭websocket的连接
  webSocket.close();
};

const msg = ref("");
const sendMessage = () => {
  webSocket.send(msg.value);
};
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
    padding: 20px 0;
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
</style>

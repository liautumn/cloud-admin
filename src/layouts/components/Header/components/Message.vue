<template>
  <div class="message">
    <el-popover placement="bottom" :width="310" trigger="click">
      <template #reference>
        <el-badge :value="num" class="item">
          <i :class="'iconfont icon-xiaoxi'" @click="getMessage" class="toolBar-icon" />
        </el-badge>
      </template>
      <el-tabs v-model="activeName">
        <el-tab-pane label="通知(1)" name="first">
          <div class="message-list" v-for="(item, index) in list" :key="index">
            <div class="message-item">
              <img src="@/assets/images/msg01.png" alt="" class="message-icon" />
              <div class="message-content">
                <span class="message-title">{{ item.title }}</span>
                <span class="message-date">{{ item.createTime }}</span>
              </div>
            </div>
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
import { selectMessage } from "@/api/modules/system/message/message";
import { Message } from "@/api/interface/system/message/message";

const activeName = ref("first");

//获取消息数据
const list = ref<Message.ResList[]>();
const num = ref<number>(0);
const getMessage = () => {
  selectMessage().then(res => {
    list.value = res.data.list;
    num.value = res.data.num;
  });
};
getMessage();
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

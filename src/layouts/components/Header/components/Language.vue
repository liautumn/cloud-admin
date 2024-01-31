<template>
  <el-dropdown trigger="click" @command="changeLanguage">
    <i :class="'iconfont icon-zhongyingwen'" class="toolBar-icon"></i>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item in languageList"
          :key="item.value"
          :command="item.value"
          :disabled="language === item.value"
        >
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { computed } from "vue";
import { useGlobalStore } from "@/stores/modules/global";
import { LanguageType } from "@/stores/interface";
//刷新菜单
import { initDynamicRouter } from "@/routers/modules/dynamicRouter";
import { useTabsStore } from "@/stores/modules/tabs";
import { selectNoTree } from "@/api/modules/system/menu/menu";

const i18n = useI18n();
const globalStore = useGlobalStore();
const language = computed(() => globalStore.language);

const languageList = [
  { label: "简体中文", value: "zh" },
  { label: "English", value: "en" }
];

const changeLanguage = async (lang: string) => {
  i18n.locale.value = lang;
  globalStore.setGlobalState("language", lang as LanguageType);
  //刷新菜单
  await initDynamicRouter();
  //刷新导航栏
  //刷新tabs
  const menuList: any = (
    await selectNoTree({
      component: "",
      menuType: "1",
      parentId: "",
      path: "",
      perms: "",
      status: "1",
      title: ""
    })
  ).data;
  const tabStore = useTabsStore();
  let tabsMenuList = tabStore.tabsMenuList;
  for (let i = 0; i < tabsMenuList.length; i++) {
    for (let j = 0; j < menuList.length; j++) {
      if (menuList[j].path == tabsMenuList[i].path) {
        tabsMenuList[i].title = language.value == "zh" ? menuList[j].title : language.value == "en" ? menuList[j].enTitle : "";
        break;
      }
    }
  }
};
</script>

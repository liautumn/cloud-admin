// @/stores/helper/dicts.js
import { ref } from "vue";
import { dictsParse } from "@/api/modules/system/dict/dict";

export function parseDicts(dictTypes) {
  const dicts: any = ref({});
  try {
    dictsParse(dictTypes).then(res => {
      dicts.value = res.data;
    });
  } catch (error) {
    console.error("加载字典数据失败：", error);
  }

  return {
    dicts
  };
}

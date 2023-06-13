import { defineStore } from "pinia";

export const dictStore = defineStore({
  id: "dictStore",
  state: (): { dictTypeId: string; dictType: string } => ({
    dictTypeId: "",
    dictType: ""
  }),
  actions: {
    // Set
    async set(dictTypeId: string, dictType: string) {
      this.dictTypeId = dictTypeId;
      this.dictType = dictType;
    },
    // Remove
    async remove() {
      this.dictTypeId = "";
      this.dictType = "";
    }
  }
});

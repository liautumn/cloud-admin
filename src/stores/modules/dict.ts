import { defineStore } from "pinia";
import { DictState } from "@/stores/interface";

export const dictStore = defineStore({
  id: "dictStore",
  state: (): DictState => ({
    row: {
      id: "",
      title: "",
      dictType: ""
    }
  }),
  actions: {
    // Set
    async set(row: any) {
      this.row = row;
    },
    // Remove
    async remove() {
      this.row = {
        id: "",
        title: "",
        dictType: ""
      };
    }
  }
});

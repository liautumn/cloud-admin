import { defineStore } from "pinia";

export const dictStore = defineStore({
  id: "dictStore",
  state: (): { row: any } => ({
    row: {
      id: "",
      title: "",
      dictType: ""
    }
  }),
  actions: {
    // Set
    set(row: any) {
      this.row = row;
    },
    // Remove
    remove() {
      this.row = {
        id: "",
        title: "",
        dictType: ""
      };
    }
  }
});

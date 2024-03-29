import { defineStore } from "pinia";
import { UserState } from "@/stores/interface";
import piniaPersistConfig from "@/stores/helper/persist";

export const useUserStore = defineStore({
  id: "autumn-user",
  state: (): UserState => ({
    token: "",
    userInfo: {
      id: "",
      deptName: "",
      userName: "",
      nickName: "",
      userType: "",
      email: "",
      phonenumber: "",
      sex: "",
      avatar: "",
      status: "",
      loginIp: "",
      loginDate: "",
      createTime: "",
      remark: ""
    }
  }),
  getters: {},
  actions: {
    // Set Token
    setToken(token: string) {
      this.token = token;
    },
    // Set setUserInfo
    setUserInfo(userInfo: UserState["userInfo"]) {
      this.userInfo = userInfo;
    }
  },
  persist: piniaPersistConfig("autumn-user")
});

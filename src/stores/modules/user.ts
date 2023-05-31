import { defineStore } from "pinia";
import { UserState } from "@/stores/interface";
import piniaPersistConfig from "@/config/piniaPersist";

export const useUserStore = defineStore({
  id: "autumn-user",
  state: (): UserState => ({
    token: "",
    userInfo: {
      userId: 0,
      deptId: 0,
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
  persist: piniaPersistConfig("autumn-token")
});

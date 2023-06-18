import { SYSTEM } from "@/api/config/servicePort";
import http from "@/api";
import { UserState } from "@/stores/interface/index";

// 获取用户信息
export const getOneUser = (params: string) => {
  return http.get<UserState["userInfo"]>(SYSTEM + `/user/getOneUser?id=${params}`);
};

// 编辑用户
export const updateUser = (params: UserState["userInfo"]) => {
  return http.post(SYSTEM + `/user/update`, params);
};

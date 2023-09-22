import { AUTH } from "@/api/config/servicePort";
import http from "@/api";
import { UserState } from "@/stores/interface/index";
import { Login } from "@/api/interface/auth/login";

// 获取用户信息
export const getOneUser = (params: string) => {
  return http.get<UserState["userInfo"]>(AUTH + `/getOneUser?id=${params}`, {}, { noLoading: true });
};

// 编辑用户
export const updateUser = (params: UserState["userInfo"]) => {
  return http.post(AUTH + `/update`, params, { noLoading: true });
};

// 修改用户密码
export const updatePassword = (params: Login.PassForm) => {
  return http.post(AUTH + `/updatePassword`, params, { noLoading: true });
};

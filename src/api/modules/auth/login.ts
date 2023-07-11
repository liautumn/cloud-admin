import { Login } from "@/api/interface/auth/login";
import { AUTH, SYSTEM } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 登录模块
 */
// 用户登录
export const loginApi = (params: Login.ReqLoginForm) => {
  return http.post<Login.ResLogin>(AUTH + `/login`, params, { noLoading: true });
};

// 获取菜单列表
export const getAuthMenuListApi = () => {
  return http.get<Menu.MenuOptions[]>(SYSTEM + `/menu/list`, {}, { noLoading: true });
};

// 获取按钮权限
export const getAuthButtonListApi = () => {
  return http.get<Login.ResAuthButtons>(SYSTEM + `/buttons`, {}, { noLoading: true });
};

// 用户退出登录
export const logoutApi = () => {
  return http.post(AUTH + `/logout`);
};

// 获取IP
export const getIp = () => {
  return "";
};

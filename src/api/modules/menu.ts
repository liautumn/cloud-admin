import { SYSTEM } from "@/api/config/servicePort";
import http from "@/api";
import { Menu, ResPage } from "@/api/interface";

// 获取菜单列表
export const getMenuListApi = (data: object) => {
  return http.get<ResPage<Menu.Result>>(SYSTEM + `/menu/select`, data, { noLoading: true });
};

// 添加菜单
export const getmenuinsertApi = (data: object) => {
  return http.post(SYSTEM + `/menu/insert`, data, { noLoading: true });
};

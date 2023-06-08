import { SYSTEM } from "@/api/config/servicePort";
import http from "@/api";
import { Menu, ResPage } from "@/api/interface";

// 获取菜单列表
export const selectMenu = (data: any) => {
  return http.get<ResPage<Menu.Result>>(SYSTEM + `/menu/select`, data, { noLoading: true });
};

// 添加菜单
export const insertMenu = (data: any) => {
  return http.post(SYSTEM + `/menu/insert`, data, { noLoading: true });
};

// 修改菜单
export const updateMenu = (data: any) => {
  return http.post(SYSTEM + `/menu/update`, data, { noLoading: true });
};

// 删除菜单
export const deleteMenu = (data: string) => {
  return http.get(SYSTEM + `/menu/delete?ids=` + data, { noLoading: true });
};

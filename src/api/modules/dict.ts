import { SYSTEM } from "@/api/config/servicePort";
import http from "@/api";
import { Menu, ResPage } from "@/api/interface";

// 获取菜单列表
export const selectDict = (data: any) => {
  return http.post<ResPage<Menu.Result>>(SYSTEM + `/dict/select`, data, { noLoading: true });
};

// 添加菜单
export const insertDict = (data: any) => {
  return http.post(SYSTEM + `/dict/insert`, data, { noLoading: true });
};

// 修改菜单
export const updateDict = (data: any) => {
  return http.post(SYSTEM + `/dict/update`, data, { noLoading: true });
};

// 删除菜单
export const deleteDict = (data: string) => {
  return http.get(SYSTEM + `/dict/delete?ids=` + data, { noLoading: true });
};

import { SYSTEM } from "@/api/config/servicePort";
import http from "@/api";
import { ResPage } from "@/api/interface";
import { Menu } from "@/api/interface/system/menu/menu";

// 获取菜单列表
export const selectMenu = (params: Menu.ReqParams) => {
  return http.post<ResPage<Menu.ResList>>(SYSTEM + `/menu/select`, params, { noLoading: true });
};

// 获取菜单树下拉列表
export const getMenuTree = (params: any) => {
  return http.post(SYSTEM + `/menu/getMenuTree`, params, { noLoading: true });
};

// 添加菜单
export const insertMenu = (params: FormData) => {
  return http.post(SYSTEM + `/menu/insert`, params, { noLoading: true });
};

// 修改菜单
export const updateMenu = (params: FormData) => {
  return http.post(SYSTEM + `/menu/update`, params, { noLoading: true });
};

// 删除菜单
export const deleteMenu = (params: string) => {
  return http.get(SYSTEM + `/menu/delete?ids=` + params, {}, { noLoading: true });
};

// 导入
export const importMenu = (params: FormData) => {
  return http.post(SYSTEM + `/menu/import`, params, { noLoading: true });
};

// 导出用户数据
export const exportMenu = (params: Menu.ReqParams) => {
  return http.download(SYSTEM + `/menu/export`, params, { noLoading: true });
};

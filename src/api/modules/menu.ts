import { SYSTEM } from "@/api/config/servicePort";
import http from "@/api";
import { ResPage } from "@/api/interface";
import { Menu } from "@/api/interface/menu";

// 获取菜单列表
export const selectMenu = (params: Menu.ReqMenuParams) => {
  return http.post<ResPage<Menu.ResMenuList>>(SYSTEM + `/menu/select`, params, { noLoading: true });
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
  return http.get(SYSTEM + `/menu/delete?ids=` + params, { noLoading: true });
};

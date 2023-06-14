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

// 导入
export const importMenu = (params: FormData) => {
  return http.post(SYSTEM + `/menu/import`, params);
};

// 导出用户数据
export const exportMenu = (params: Menu.ReqMenuParams) => {
  return http.download(SYSTEM + `/menu/export`, params);
};

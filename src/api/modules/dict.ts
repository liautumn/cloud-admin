import { SYSTEM } from "@/api/config/servicePort";
import http from "@/api";
import { ResPage } from "@/api/interface";
import { Menu } from "@/api/interface/menu";

// ===================================菜单类型接口=============================================
// 获取菜单列表
export const selectDict = (params: Menu.ReqMenuParams) => {
  return http.post<ResPage<any>>(SYSTEM + `/dict/select`, params, { noLoading: true });
};

// 添加菜单
export const insertDict = (params: any) => {
  return http.post(SYSTEM + `/dict/insert`, params, { noLoading: true });
};

// 修改菜单
export const updateDict = (params: any) => {
  return http.post(SYSTEM + `/dict/update`, params, { noLoading: true });
};

// 删除菜单
export const deleteDict = (params: string) => {
  return http.get(SYSTEM + `/dict/delete?ids=` + params, { noLoading: true });
};

// ===================================菜单数据接口=============================================

// 获取菜单列表
export const selectDictData = (params: Menu.ReqMenuParams) => {
  return http.post<ResPage<any>>(SYSTEM + `/dictData/select`, params, { noLoading: true });
};

// 添加菜单
export const insertDictData = (params: any) => {
  return http.post(SYSTEM + `/dictData/insert`, params, { noLoading: true });
};

// 修改菜单
export const updateDictData = (params: any) => {
  return http.post(SYSTEM + `/dictData/update`, params, { noLoading: true });
};

// 删除菜单
export const deleteDictData = (params: string) => {
  return http.get(SYSTEM + `/dictData/delete?ids=` + params, { noLoading: true });
};

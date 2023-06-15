import { SYSTEM } from "@/api/config/servicePort";
import http from "@/api";
import { ResPage } from "@/api/interface";

// ===================================菜单类型接口=============================================
// 获取菜单列表
export const selectDict = (params: FormData) => {
  return http.post<ResPage<any>>(SYSTEM + `/dict/select`, params, { noLoading: true });
};

// 添加菜单
export const insertDict = (params: FormData) => {
  return http.post(SYSTEM + `/dict/insert`, params, { noLoading: true });
};

// 修改菜单
export const updateDict = (params: FormData) => {
  return http.post(SYSTEM + `/dict/update`, params, { noLoading: true });
};

// 删除菜单
export const deleteDict = (params: string) => {
  return http.get(SYSTEM + `/dict/delete?ids=` + params, { noLoading: true });
};

// ===================================字典数据接口=============================================

// 获取菜单列表
export const selectDictData = (params: FormData) => {
  return http.post<ResPage<any>>(SYSTEM + `/dictData/select`, params, { noLoading: true });
};

// 添加菜单
export const insertDictData = (params: FormData) => {
  return http.post(SYSTEM + `/dictData/insert`, params, { noLoading: true });
};

// 修改菜单
export const updateDictData = (params: FormData) => {
  return http.post(SYSTEM + `/dictData/update`, params, { noLoading: true });
};

// 删除菜单
export const deleteDictData = (params: string) => {
  return http.get(SYSTEM + `/dictData/delete?ids=` + params, { noLoading: true });
};

// ===================================字典通用解析接口=============================================

export const dictParse = (params: string) => {
  return http.get(SYSTEM + `/dict/parse?dictType=` + params, { noLoading: false });
};

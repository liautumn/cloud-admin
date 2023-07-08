import { SYSTEM } from "@/api/config/servicePort";
import http from "@/api";
import { ResPage } from "@/api/interface";

// ===================================菜单类型接口=============================================
// 获取菜单列表
export const selectDictType = (params: FormData) => {
  return http.post<ResPage<any>>(SYSTEM + `/dictType/select`, params, { noLoading: true });
};

// 添加菜单
export const insertDictType = (params: FormData) => {
  return http.post(SYSTEM + `/dictType/insert`, params, { noLoading: true });
};

// 修改菜单
export const updateDictType = (params: FormData) => {
  return http.post(SYSTEM + `/dictType/update`, params, { noLoading: true });
};

// 删除菜单
export const deleteDictType = (params: string) => {
  return http.get(SYSTEM + `/dictType/delete?ids=` + params);
};

// 导入
export const importDictType = (params: FormData) => {
  return http.post(SYSTEM + `/dictType/import`, params);
};

// 导出用户数据
export const exportDictType = (params: FormData) => {
  return http.download(SYSTEM + `/dictType/export`, params);
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
  return http.get(SYSTEM + `/dictData/delete?ids=` + params);
};

// 导入
export const importDictData = (params: FormData) => {
  return http.post(SYSTEM + `/dictData/import`, params);
};

// 导出用户数据
export const exportDictData = (params: FormData) => {
  return http.download(SYSTEM + `/dictData/export`, params);
};

// ===================================字典通用解析接口=============================================

export const dictParse = (params: string) => {
  return http.get(SYSTEM + `/dictType/parse?dictType=` + params);
};

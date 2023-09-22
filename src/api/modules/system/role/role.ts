import { SYSTEM } from "@/api/config/servicePort";
import http from "@/api";
import { ResPage } from "@/api/interface";
import { Role } from "@/api/interface/system/role/role";

// 列表
export const selectRole = (params: Role.ReqParams) => {
  return http.post<ResPage<Role.ResObject>>(SYSTEM + `/role/select`, params, { noLoading: true });
};

// 获取角色权限下拉数据
export const getRoleList = (params: any) => {
  return http.post(SYSTEM + `/role/getRoleList`, params, { noLoading: true });
};

// 获取所属岗位下拉数据
export const getPostList = (params: any) => {
  return http.post(SYSTEM + `/post/getPostList`, params, { noLoading: true });
};

// 添加
export const insertRole = (params: any) => {
  return http.post(SYSTEM + `/role/insert`, params, { noLoading: true });
};

// 修改
export const updateRole = (params: any) => {
  return http.post(SYSTEM + `/role/update`, params, { noLoading: true });
};

// 删除
export const deleteRole = (params: string) => {
  return http.get(SYSTEM + "/role/delete?ids=" + params, {}, { noLoading: true });
};

// 导入
export const importRole = (params: any) => {
  return http.post(SYSTEM + `/role/import`, params, { noLoading: true });
};

// 导出
export const exportRole = (params: Role.ReqParams) => {
  return http.download(SYSTEM + `/role/export`, params, { noLoading: true });
};

import { SYSTEM } from "@/api/config/servicePort";
import http from "@/api";
import { ResPage } from "@/api/interface";
import { Dept } from "@/api/interface/system/dept/dept";

// 列表
export const selectDept = (params: Dept.ReqParams) => {
  return http.post<ResPage<Dept.ResList>>(SYSTEM + `/dept/select`, params, { noLoading: true });
};

// 添加
export const insertDept = (params: FormData) => {
  return http.post(SYSTEM + `/dept/insert`, params, { noLoading: true });
};

// 修改
export const updateDept = (params: FormData) => {
  return http.post(SYSTEM + `/dept/update`, params, { noLoading: true });
};

// 删除
export const deleteDept = (params: string) => {
  return http.get(SYSTEM + "/dept/delete?ids=" + params, {}, { noLoading: true });
};

// 导入
export const importDept = (params: FormData) => {
  return http.post(SYSTEM + `/dept/import`, params, { noLoading: true });
};

// 导出
export const exportDept = (params: Dept.ReqParams) => {
  return http.download(SYSTEM + `/dept/export`, params, { noLoading: true });
};

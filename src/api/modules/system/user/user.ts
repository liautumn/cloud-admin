import { SYSTEM } from "@/api/config/servicePort";
import http from "@/api";
import { ResPage } from "@/api/interface";
import { User } from "@/api/interface/system/user/user";

// 列表
export const selectUser = (params: User.ReqParams) => {
  return http.post<ResPage<User.ResList>>(SYSTEM + `/user/select`, params, { noLoading: true });
};

// 添加
export const insertUser = (params: FormData) => {
  return http.post(SYSTEM + `/user/insert`, params, { noLoading: true });
};

// 修改
export const updateUser = (params: FormData) => {
  return http.post(SYSTEM + `/user/update`, params, { noLoading: true });
};

// 删除
export const deleteUser = (params: string) => {
  return http.get(SYSTEM + "/user/delete?ids=" + params, {}, { noLoading: true });
};

// 导入
export const importUser = (params: FormData) => {
  return http.post(SYSTEM + `/user/import`, params, { noLoading: true });
};

// 导出
export const exportUser = (params: User.ReqParams) => {
  return http.download(SYSTEM + `/user/export`, params, { noLoading: true });
};

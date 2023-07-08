import { SYSTEM } from "@/api/config/servicePort";
import http from "@/api";
import { ResPage } from "@/api/interface";
import { Post } from "@/api/interface/post";

// 列表
export const selectPost = (params: Post.ReqParams) => {
  return http.post<ResPage<Post.ResList>>(SYSTEM + `/post/select`, params, { noLoading: true });
};

// 添加
export const insertPost = (params: FormData) => {
  return http.post(SYSTEM + `/post/insert`, params, { noLoading: true });
};

// 修改
export const updatePost = (params: FormData) => {
  return http.post(SYSTEM + `/post/update`, params, { noLoading: true });
};

// 删除
export const deletePost = (params: string) => {
  return http.get(SYSTEM + `/post/delete?ids=${params}`);
};

// 导入
export const importPost = (params: FormData) => {
  return http.post(SYSTEM + `/post/import`, params);
};

// 导出
export const exportPost = (params: Post.ReqParams) => {
  return http.download(SYSTEM + `/post/export`, params);
};

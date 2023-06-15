import { Upload } from "@/api/interface/index";
import { SYSTEM } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 文件上传模块
 */
// 图片上传
export const uploadImg = (params: FormData) => {
  return http.post<Upload.ResFileUrl>(SYSTEM + `/file/upload/img`, params);
};

// 视频上传
export const uploadVideo = (params: FormData) => {
  return http.post<Upload.ResFileUrl>(SYSTEM + `/file/upload/video`, params);
};

// 图片解析
export const fileParse = (params: string) => {
  return http.get(SYSTEM + `/file/parse?fileIds=${params}`);
};

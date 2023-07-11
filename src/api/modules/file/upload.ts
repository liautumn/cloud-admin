import { Upload } from "@/api/interface/file/file";
import { FILE } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 文件上传模块
 */
// 图片上传
export const uploadImg = (params: FormData) => {
  return http.post<Upload.ResFile>(FILE + `/file/upload`, params);
};

// 视频上传
export const uploadVideo = (params: FormData) => {
  return http.post<Upload.ResFile>(FILE + `/file/upload`, params);
};

// 图片解析
export const fileParse = (params: string) => {
  return http.get<Upload.ResFileList>(FILE + `/file/parse?fileIds=${params}`);
};

// 文件上传模块
export namespace Upload {
  export interface ResFile {
    fileId: string;
    name: string;
    url: string;
  }
  export interface ResFileObject {
    list: [{ fileId: string; name: string; url: string }];
  }
}

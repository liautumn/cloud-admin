// 消息记录表实体类
export namespace Message {
  export interface ReqParams {
    title: string;
    content: string;
    path: string;
    type: string;
    status: string;
  }

  export interface ResList {
    id: string;
    title: string;
    content: string;
    path: string;
    type: string;
    status: string;
    createBy: string;
    createTime: string;
    updateBy: string;
    updateTime: string;
  }
}

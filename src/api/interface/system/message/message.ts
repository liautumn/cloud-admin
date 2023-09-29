import { ReqPage } from "@/api/interface";

export namespace Message {
  export interface ReqParams extends ReqPage {
    title: string;
    content: string;
    path: string;
    type: string;
    status: string;
  }

  export interface ResObject {
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

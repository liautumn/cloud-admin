import { ReqPage } from "@/api/interface";

export namespace Dept {
  export interface ReqParams extends ReqPage {
    parentId: string;
    ancestors: string;
    deptName: string;
    orderNum: number;
    leader: string;
    phone: string;
    email: string;
    status: string;
  }

  export interface ResObject {
    id: string;
    parentId: string;
    ancestors: string;
    deptName: string;
    orderNum: number;
    leader: string;
    phone: string;
    email: string;
    status: string;
    createBy: string;
    createTime: string;
    updateBy: string;
    updateTime: string;
  }
}

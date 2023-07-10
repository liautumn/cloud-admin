import { ReqPage } from "@/api/interface";

// 部门信息实体类
export namespace Dept {
  export interface ReqParams extends ReqPage {
    parentId: string;
    ancestors: string;
    deptName: string;
    orderNum: string;
    leader: string;
    phone: string;
    email: string;
    status: string;
  }

  export interface ResList {
    id: string;
    parentId: string;
    ancestors: string;
    deptName: string;
    orderNum: string;
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

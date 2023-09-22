import { ReqPage } from "@/api/interface";

export namespace Role {
  export interface ReqParams extends ReqPage {
    roleName: string;
    roleKey: string;
    roleSort: string;
    dataScope: string;
    menuCheckStrictly: string;
    deptCheckStrictly: string;
    remark: string;
    status: string;
  }

  export interface ResObject {
    id: string;
    menuTreeList: [];
    roleName: string;
    roleKey: string;
    roleSort: number;
    dataScope: string;
    menuCheckStrictly: string;
    deptCheckStrictly: string;
    remark: string;
    status: string;
    createBy: string;
    createTime: string;
    updateBy: string;
    updateTime: string;
  }
}

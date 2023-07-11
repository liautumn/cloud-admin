import { ReqPage } from "@/api/interface";

// 角色信息实体类
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

  export interface ResList {
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

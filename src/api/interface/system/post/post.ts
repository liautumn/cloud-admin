import { ReqPage } from "@/api/interface/index";

// 菜单管理模块
export namespace Post {
  export interface ReqParams extends ReqPage {
    postCode: string;
    postName: string;
    remark: string;
    status: string;
  }

  export interface ResList {
    id: string;
    postCode: string;
    postName: string;
    postSort: string;
    remark: string;
    status: string;
  }
}

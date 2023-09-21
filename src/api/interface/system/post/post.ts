import { ReqPage } from "@/api/interface";

export namespace Post {
  export interface ReqParams extends ReqPage {
    postCode: string;
    postName: string;
    remark: string;
    status: string;
  }

  export interface ResObject {
    id: string;
    postCode: string;
    postName: string;
    postSort: number;
    remark: string;
    status: string;
  }
}

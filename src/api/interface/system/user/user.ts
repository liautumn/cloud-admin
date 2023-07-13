import { ReqPage } from "@/api/interface";

// 用户信息实体类
export namespace User {
  export interface ReqParams extends ReqPage {
    deptId: string;
    userName: string;
    nickName: string;
    userType: string;
    email: string;
    phonenumber: string;
    sex: string;
    avatar: string;
    password: string;
    remark: string;
    status: string;
    loginIp: string;
    loginDate: string;
  }

  export interface ResList {
    id: string;
    deptId: string;
    roleList: [];
    postList: [];
    userName: string;
    nickName: string;
    userType: string;
    email: string;
    phonenumber: string;
    sex: string;
    avatar: string;
    password: string;
    remark: string;
    status: string;
    loginIp: string;
    loginDate: string;
    createBy: string;
    createTime: string;
    updateBy: string;
    updateTime: string;
  }
}

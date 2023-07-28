import { UserState } from "@/stores/interface";
// 登录实体类
export namespace Login {
  export interface PassForm {
    id: string;
    oldPassword: string;
    newPassword: string;
    checkPassword: string;
  }

  export interface ReqLoginForm {
    userName: string;
    password: string;
    loginIp: string;
    isRemember: boolean;
    captchaVerification: any;
  }

  export type ResLogin = UserState;

  export interface ResAuthButtons {
    [key: string]: string[];
  }
}

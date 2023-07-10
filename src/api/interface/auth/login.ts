// 登录实体类
export namespace Login {
  export interface PassForm {
    id: string;
    oldPassword: string;
    newPassword: string;
    checkPassword: string;
  }
}

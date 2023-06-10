import { ReqPage } from "./index";

// 菜单管理模块
export namespace Menu {
  export interface ReqMenuParams extends ReqPage {
    title: string;
    path: string;
    component: string;
    parentId: string;
    perms: string;
    menuType: string;
    status: string;
  }

  export interface ResMenuList {
    id: string;
    title: string;
    name: string;
    path: string;
    component: string;
    redirect: string;
    parentId: string;
    icon: string;
    activeMenu: string;
    perms: string;
    orderNum: string;
    query: string;
    isLink: string;
    isHide: string;
    isFull: string;
    isAffix: string;
    isKeepAlive: string;
    menuType: string;
    status: string;
    remark: string;
    children?: ResMenuList[];
  }
}

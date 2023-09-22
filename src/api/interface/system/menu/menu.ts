export namespace Menu {
  export interface ReqParams {
    title: string;
    path: string;
    component: string;
    parentId: string;
    perms: string;
    menuType: string;
    status: string;
  }

  export interface ResObject {
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
    orderNum: number;
    query: string;
    isLink: string;
    isHide: string;
    isFull: string;
    isAffix: string;
    isKeepAlive: string;
    menuType: string;
    status: string;
    remark: string;
    children?: ResObject[];
  }
}

import { SYSTEM } from "@/api/config/servicePort";
import http from "@/api";
import { Menu, ResPage } from "@/api/interface";

// 获取菜单列表
export const getMenuListApi = () => {
  return http.get<ResPage<Menu.Result>>(SYSTEM + `/menu/select`, { pageNum: 0, pageSize: 10 }, { noLoading: true });
};

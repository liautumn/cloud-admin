// ? 全局默认配置项

// 首页地址（默认）
// export const HOME_URL: string = "/home/index";
export const HOME_URL: string = "/dashboard/dataVisualize";

// 登录页地址（默认）
export const LOGIN_URL: string = "/login";

// 默认主题颜色
export const DEFAULT_PRIMARY: string = "#009688";

// 路由白名单地址（必须是本地存在的路由 staticRouter.ts 中）
export const ROUTER_WHITE_LIST: string[] = ["403", "404", "/500"];

// rabbitmq
export const MQTT_SERVICE: string = "ws://127.0.0.1:15674/ws"; // mq服务地址
export const MQTT_USERNAME: string = "admin"; // mq连接用户名
export const MQTT_PASSWORD: string = "zhuang2001"; // mq连接密码

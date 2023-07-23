/**
 * 此处可直接引用自己项目封装好的 axios 配合后端联调
 */

import request from "../utils/axios.js"; //组件内部封装的axios
import { AUTH } from "@/api/config/servicePort";

//获取验证图片  以及token
export function captchaGet(data) {
  return request({
    url: AUTH + "/captcha/get",
    method: "post",
    data
  });
}

//滑动或者点选验证
export function captchaCheck(data) {
  return request({
    url: AUTH + "/captcha/check",
    method: "post",
    data
  });
}

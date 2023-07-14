import { ElMessageBox, ElMessage } from "element-plus";
import { HandleData } from "./interface";
import { useI18n } from "vue-i18n";

/**
 * @description 操作单条数据信息 (二次确认【删除、禁用、启用、重置密码】)
 * @param {Function} api 操作数据接口的api方法 (必传)
 * @param {Object} params 携带的操作数据参数 {id,params} (必传)
 * @param {String} message 提示信息 (不必传)
 * @param {String} confirmType icon类型 (不必传,默认为 warning)
 * @returns {Promise}
 */
const $I18n = useI18n();
export const useHandleData = (
  api: (params: any) => Promise<any>,
  params: any = {},
  message: string = $I18n.t("crud.deleteConfirm"),
  confirmType: HandleData.MessageType = "warning"
) => {
  return new Promise((resolve, reject) => {
    ElMessageBox.confirm(message, $I18n.t("public.kindReminder"), {
      confirmButtonText: $I18n.t("public.confirm"),
      cancelButtonText: $I18n.t("public.cancel"),
      type: confirmType,
      draggable: true
    }).then(async () => {
      const res = await api(params);
      if (!res) return reject(false);
      ElMessage({
        type: "success",
        message: $I18n.t("crud.deleteMsg")
      });
      resolve(true);
    });
  });
};

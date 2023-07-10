// import { dictParse } from "@/api/modules/dict";

/**
 * 获取字典数据
 */
export function getDict(code: string) {
  console.log(code);
  let data = [
    {
      label: "是",
      value: "0"
    },
    {
      label: "否",
      value: "1"
    }
  ];
  // await dictParse(code).then(res => {
  //   data = res.data;
  // });
  return data;
}

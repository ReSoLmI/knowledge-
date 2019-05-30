import cookie from 'jquery.cookie';
import {
  ajaxAsync
} from '@/util/common'
//项目启动前初始化函数
export async function init() {
  await initCatalogue();
}
// 初始化默认编码
async function initCatalogue() {
  if ($.cookie("_defaultCatalogue_")) {
    return;
  }
  let data = await ajaxAsync({
    url: "knowledge-service/rule/config",
    dataType: "json",
    type: "get",
  })
  if (data && data.length > 0) {
    let rule = data.find(d => {
      return d.defaultType == 1;
    })
    if (rule) {
      $.cookie("_defaultCatalogue_", rule.catalogueRule, {
        path: '/'
      });
    }
  }
}

/*获取默认编码*/
export function getCatalogue() {
  return $.cookie("_defaultCatalogue_");
}

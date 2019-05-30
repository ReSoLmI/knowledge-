import 'jquery.cookie';
/*------------------------------弹出框----------------------------*/

/*tip小黑框 常用于操作成功提示*/
export function tip_msg(msg, time, callbackFun) {
  layer.msg(msg || "操作成功！", {
    time: time || 1000,
    /*offset: '20px'*/
  }, function() {
    if (callbackFun) {
      callbackFun();
    }
  });
}

/*layer确定框 常用于错误提示*/
export function openLayer(content, time, fun) {
  return layer.open({
    style: 'background-color:rgba(0,0,0,0.8);color:white;max-width:70%;width:auto;border-radius: 4px;',
    shade: 'background-color: rgba(0,0,0,0)',
    content: content || "error",
    time: time || 2000,
    end: function() {
      if (fun) {
        fun();
      }
    }
  });
}

/*
 *确认框 常用于删除确认
 *@param {object} option {width,height,title,content,yes(确定回调),cancle(取消回调)}
 */
export function confirm_g(option) {
  option = option || {};
  option.width = option.width || '500px';
  option.content = option.content || '确定要删除?';
  var index = layer.open({
    type: 1,
    title: option.title || '删除',
    area: option.height ? [option.width, option.height] : option.width,
    shadeClose: true,
    content: '    <div id="pop-content-del-layer01">' +
      '        <div class="am-msg-lg-info">' +
      '            <div class="inner">' +
      '                <i class="i-question-lg"></i>' +
      '                <h3>' + option.content + '</h3>' +
      '            </div>' +
      '        </div>' +
      '        <div class="am-btn-area">' +
      '            <a class="am-pop-btn cancle">取消</a>' +
      '            <a class="am-pop-btn am-btn-confirm">确定</a>' +
      '        </div>' +
      '    </div>'
  })
  $('#pop-content-del-layer01 .cancle').off("click");
  $('#pop-content-del-layer01 .am-btn-confirm').off("click");
  $('#pop-content-del-layer01 .cancle').on('click', function() {
    if (typeof(option.cancle) == 'function') {
      option.cancle(index);
    }
  })
  $('#pop-content-del-layer01 .am-btn-confirm').on('click', function() {
    if (typeof(option.yes) == 'function') {
      option.yes(index);
    }
  })
}
/*----------------------------------弹出框end---------------------------*/




/*----------------------------------ajax相关----------------------------*/
export function ajax(options) {
  if ($.cookie("_token_")) {
    options.headers = {
      "Authorization": "Bearer " + $.cookie("_token_")
    };
  } else {
    options.headers = {};
  }
  let flag = '?';
  if (options.url.indexOf('?') > -1) {
    flag = '&'
  }
  $.ajax({
    type: options.type || "post",
    url: "/" + options.url + (options.cache ? '' : flag + "random=" + Math.random()),
    dataType: options.dataType || "json",
    beforeSend: function(request) {
      if (!options.isLogin) {
        request.setRequestHeader("Authorization", "Bearer " + $.cookie("_token_"));
      }
    },
    contentType: options.content_type || "application/json",
    timeout: options.timeout || 10000,
    async: (options.async != undefined) ? options.async : true,
    data: options.data || {},
    headers: options.headers,
    complete: function() {
      if (!options.noHideLoading) {
        layer.closeAll('loading');
      }
    },
    success: function(result) {
      if (!options.noHideLoading) {
        layer.closeAll('loading');
      }
      if (result) {
        if (result.error_code || result.error_code == "") {
          if (options.failure) {
            options.failure(result)
          } else {
            openLayer(result.error_info);
          }
        } else {
          _callSuccess(options.callback, result);
        }
      } else {
        _callSuccess(options.callback, result);
      }
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      if (!options.noHideLoading) {
        layer.closeAll('loading');
      }
      if (options.hideLayer) {
        layer.closeAll();
      }
      if (XMLHttpRequest.status == '500' || XMLHttpRequest.status == '401') {
        var obj = JSON.parse(XMLHttpRequest.responseText);
        //XMLHttpRequest.responseText

        if (obj.code == '10000') {
          // layer.open({
          //   type: 1,
          //   title: '提示',
          //   area: ['480px', ''],
          //   shadeClose: true, //点击遮罩关闭
          //   content: '<div>' +
          //     '<h3 class="health-score">系统异常，请稍后再试！</h3>' +
          //     '</div>'
          // });
           openLayer('系统异常，请稍后再试！');
        } else if (obj.code == '20401' || obj.code == "10007") {
          tip_msg("请重新登录！", null, function() {
            logout();
          });
        } else if (obj.error == "invalid_token") {
          logout();
        } else {
          _callError(options.failure, obj);
        }
      } else {
        layer.close();
        layer.open({
          type: 1,
          title: '提示',
          area: ['480px', ''],
          shadeClose: true, //点击遮罩关闭
          content: '<div>' +
            '<h3 class="health-score">调用数据失败，请稍后再试！</h3>' +
            '</div>'
        });
        _callError(options.failure, obj);
      }

    }
  })
}

/**
 * 调用成功之后 处理方法
 * @param callback(Function) 成功之后的回调方法
 * @param result 请求返回的结果集
 */
function _callSuccess(callback, result) {
  if (typeof(callback) == 'function') {
    callback(result);
  }
}

/**
 * 出现异常时调用异常信息
 * @param failure(Function) 失败时回调方法
 * @param errorMessage(String) 异常信息
 *
 */
function _callError(failure, errorMessage) {
  if (typeof(failure) == 'function') {
    failure(errorMessage);
  } else {
    openLayer(errorMessage.message);
  }
}


var z;
export function ajaxAsync(options) {
  options.hideLayer = options.hideLayer == undefined ? true : options.hideLayer;
  if ($.cookie("_token_")) {
    options.headers = {
      "Authorization": "Bearer " + $.cookie("_token_")
    };
  } else {
    options.headers = {};
  }

  return new Promise((resolve, reject) => {
    //layer.load(2,{offset: ['50%','50%']});
      let flag = '?';
    if (options.url.indexOf('?') > -1) {
      flag = '&'
    }
    $.ajax({
      type: options.type || "post",
      url: "/" + options.url + (options.cache ? '' : flag + "random=" + Math.random()),
      cache: options.cache || false,
      dataType: options.dataType || "json",
      beforeSend: function(request) {
        // layer.closeAll();
        if (!options.isLogin) {
          request.setRequestHeader("Authorization", "Bearer " + $.cookie("_token_"));
        }
      },
      contentType: options.content_type || "application/json",
      timeout: options.timeout || 10000,
      async: (options.async != undefined) ? options.async : true,
      data: options.data || {},
      headers: options.headers,
      complete: function() {
        if (!options.noHideLoading) {
          layer.closeAll('loading');
        }
      },
      success: function(result) {
        if (!options.noHideLoading) {
          layer.closeAll('loading');
        }
        if (result) {
          if (result.error_code || result.error_code == "") {
            reject(result);
          } else {
            resolve(result);
          }
        } else {
          resolve(result);
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        if (!options.noHideLoading) {
          layer.closeAll('loading');
        }
        if (options.hideLayer) {
          layer.closeAll();
        }
         if (options.is_failure === 'first') {
           reject(XMLHttpRequest);
           return;
         }
        if (XMLHttpRequest.status == '500' || XMLHttpRequest.status == '401') {
          var obj = JSON.parse(XMLHttpRequest.responseText);
          //XMLHttpRequest.responseText

          if (obj.code == '10000') {
            // layer.open({
            //   type: 1,
            //   title: '提示',
            //   area: ['480px', ''],
            //   shadeClose: true, //点击遮罩关闭
            //   content: '<div>' +
            //     '<h3 class="health-score">系统异常，请稍后再试！</h3>' +
            //     '</div>'
            // });
            openLayer('系统异常，请稍后再试！');
          } else if (obj.code == '20401' || obj.code == "10007") {
            tip_msg("请重新登录！", null, function() {
              logout();
            });
          } else if (obj.error == "invalid_token") {
            logout();
          } else {
            if (!options.showFailure) {
              openLayer(obj.message);
            }
          }
          //reject(obj);
        } else {
          try {
            layer.close(z);
          } catch (e) {}
          // z = layer.open({
          //   type: 1,
          //   title: '提示',
          //   area: ['480px', ''],
          //   shadeClose: true, //点击遮罩关闭
          //   content: '<div>' +
          //     '<h3 class="health-score">系统异常，请稍后再试！!</h3>' +
          //     '</div>'
          // });
            openLayer('系统异常，请稍后再试！');
          //reject(obj);
        }
        reject(XMLHttpRequest);
      }
    })
  })
}


/*-----------------ajax相关end---------------*/

/*退出登录*/
export function logout() {
  $.cookie("_id_", "", {
    path: '/',
    expires: -1
  });
  $.cookie("_un_", "", {
    path: '/',
    expires: -1
  });
  $.cookie("_ut_", "", {
    path: '/',
    expires: -1
  });
  $.cookie("_token_", "", {
    path: '/',
    expires: -1
  });
  // 
  // pageFrom=patientinfo
  if (window.sessionStorage.getItem("_transLogout_")) {
    exec_iframe_login();
  } else {
    window.top.location.href = getPlatformUrl() + "/user/html/login.html";
  }
}

/*获取平台的地址*/
export function getPlatformUrl() {
  let href;
  try {
    href = window.top.location.href
  } catch (e) {
    href = window.location.href
  }
  return getUrlParam('platformUrl', href) || $.cookie("_platformUrl_");
}

/*获取url属性值*/
export function getUrlParam(name, href) {
  var result = "";
  var url = href || window.location.href;
  if (url.indexOf("?") > -1) {
    var param = url.substring(url.indexOf("?") + 1);
    name += "=";
    if (param.indexOf(name) > -1) {
      var r = param.substr(param.indexOf(name) + name.length);
      if (r.indexOf("&") != -1) {
        r = r.substring(0, r.indexOf("&"));
      }
      result = r;
    }
  }
  return decodeURIComponent(result);
}

//跨域iframe交互  关闭弹框
export function exec_iframe() {
  if (getUrlParam("pageFrom") == 'patientinfo') {
    let transPage = unescape(getUrlParam("transPage"));
    let transFun = getUrlParam("transFun");
    if (typeof(exec_obj) == 'undefined') {
      let exec_obj = document.createElement('iframe');
      exec_obj.id = 'transIframe';
      exec_obj.name = 'transIframe';
      exec_obj.src = transPage + "?transFun=" + transFun;
      exec_obj.style.display = 'none';
      document.body.appendChild(exec_obj);
    } else {
      exec_obj.src = transPage + "?transFun=" + transFun + '&random=' + Math.random();
    }
  } else {
    let index = parent.layer.getFrameIndex(window.name);
    parent.layer.close(index);
  }
}
//跳到登陆页
export function exec_iframe_login() {
  var transPageObj = JSON.parse(window.sessionStorage.getItem("_transLogout_"));
  let transPage = unescape(transPageObj.transPage);
  let transFun = transPageObj.transLogoutFun;
  if (typeof(exec_obj) == 'undefined') {
    let exec_obj = document.createElement('iframe');
    exec_obj.id = 'transIframe';
    exec_obj.name = 'transIframe';
    exec_obj.src = transPage + "?transFun=" + transFun;
    exec_obj.style.display = 'none';
    document.body.appendChild(exec_obj);
  } else {
    exec_obj.src = transPage + "?transFun=" + transFun + '&random=' + Math.random();
  }
  if (typeof(parent.exec_iframe_login) == 'function') {
    parent.exec_iframe_login();
  }
}


/*获取服务器当前时间*/
export async function getSysTime() {
    var time = "";
    try {
      time = await ajaxAsync({
        url: 'enr2.0/sys/date',
        type: 'post',
        is_failure:'first',
        dataType: "text",
      })
    } catch (e) {
      time = new Date().format('yyyy-MM-dd hh:mm:ss');
    }
    return time;
  }

/*设置token等用户信息*/
export function setUserInfo() {
  var token = getUrlParam("token");
  var transLogoutFun = getUrlParam("transLogoutFun");
  var transPage = getUrlParam("transPage");
  var organCode = getUrlParam("organCode");
  if (token) {
    $.cookie("_token_", token, {
      path: '/',
      expires: 10
    });
    // window.sessionStorage.setItem("_token_", token);
  }
  if (organCode) {
    window.sessionStorage.setItem("_organCode_", organCode);
  }
  if (transLogoutFun) {
    window.sessionStorage.setItem("_transLogout_", JSON.stringify({ 'transPage': transPage, 'transLogoutFun': transLogoutFun }));
    window.exec_iframe_login = exec_iframe_login;
  }
}

/*获取医院组织机构码*/
export function getOrganCode() {
  return window.sessionStorage.getItem("_organCode_") || getUrlParam('organCode');
}

/**
 * 根据年龄字符串 计算年龄对应字段信息
 * @param {string} age 年龄
 * @returns {object} year-岁 month-月 day-天 age-完整年龄展示
 */
export function calculateAge(age) {
  // 年龄信息
  var ageInfo = {
    year: '', // 岁
    month: '', // 月
    day: '', // 天
    age: '' // 完整年龄展示
  }
  // 年龄为空时 认为成年人
  if (!age) {
    ageInfo.year = 'adult'
    ageInfo.age = '未知'
    return ageInfo
  }
  // 将字符串中所有「个」替换为空
  age = age.replace(/个/g, '')
  // 年字符串所在位置
  var yearFlag = age.indexOf('岁')
  // 月字符串所在位置
  var monthFlag = age.indexOf('月')
  // 天字符串所在位置
  var dayFlag = age.indexOf('天')
  // 截取年字符串后内容
  var yearEnd = age.substring(yearFlag + 1, age.length)
  // 截取月字符串后内容
  var monthEnd = age.substring(monthFlag + 1, age.length)

  // 年龄字符为纯数字或者只含有岁字符时 认为年龄为X岁 示例：X、X岁
  if ((yearFlag === -1 && monthFlag === -1 && dayFlag === -1) || (yearFlag > -1 && monthFlag === -1 && dayFlag === -1 && !yearEnd)) {
    ageInfo.year = yearFlag > -1 ? age.substring(0, yearFlag) : age

    ageInfo.age = ageInfo.year + '岁'
    return ageInfo
  }
  // 年龄字符同时含有岁和月字符或者只含有岁字符但是岁字符后面还有数字时 认为年龄为X岁X月 示例：X岁X月 X岁X
  if ((yearFlag > -1 && monthFlag > -1 && dayFlag === -1 && !monthEnd) || (yearFlag > -1 && monthFlag === -1 && dayFlag === -1 && yearEnd)) {
    ageInfo.year = age.substring(0, yearFlag)
    ageInfo.month = monthFlag > -1 ? age.substring(yearFlag + 1, monthFlag) : yearEnd

    ageInfo.age = ageInfo.year + '岁' + ageInfo.month + '个月'
    return ageInfo
  }
  // 年龄字符同时含有岁和天字符时 认为年龄为X岁X天 示例：X岁X天
  if (yearFlag > -1 && monthFlag === -1 && dayFlag > -1) {
    ageInfo.year = age.substring(0, yearFlag)
    ageInfo.month = '0'
    ageInfo.day = age.substring(yearFlag + 1, dayFlag)

    ageInfo.age = ageInfo.year + '岁' + ageInfo.day + '天'
    return ageInfo
  }
  // 年龄字符同时含有岁、月、天字符或者只含有岁、月字符但是月字符后面还有数字时 认为年龄为X岁X月X天 示例：X岁X月X天 X岁X月X
  if ((yearFlag > -1 && monthFlag > -1 && dayFlag > -1) || (yearFlag > -1 && monthFlag > -1 && dayFlag === -1 && monthEnd)) {
    ageInfo.year = age.substring(0, yearFlag)
    ageInfo.month = age.substring(yearFlag + 1, monthFlag)
    ageInfo.day = dayFlag > -1 ? age.substring(monthFlag + 1, dayFlag) : monthEnd

    ageInfo.age = ageInfo.year + '岁' + ageInfo.month + '个月' + ageInfo.day + '天'
    return ageInfo
  }
  // 年龄字符只含有月字符时 认为年龄为0岁X个月 示例：X月
  if (yearFlag === -1 && monthFlag > -1 && dayFlag === -1 && !monthEnd) {
    ageInfo.year = '0'
    ageInfo.month = age.substring(0, monthFlag)

    ageInfo.age = ageInfo.month + '个月'
    return ageInfo
  }
  // 年龄字符同时含有月和天字符或者只含有月字符但是月字符后面还有数字时 认为年龄为X月X天 示例：X月X天 X月X
  if ((yearFlag === -1 && monthFlag > -1 && dayFlag > -1) || (yearFlag === -1 && monthFlag > -1 && dayFlag === -1 && monthEnd)) {
    ageInfo.year = '0'
    ageInfo.month = age.substring(0, monthFlag)
    ageInfo.day = dayFlag > -1 ? age.substring(monthFlag + 1, dayFlag) : monthEnd

    ageInfo.age = ageInfo.month + '个月' + ageInfo.day + '天'
    return ageInfo
  }
  // 年龄字符只含有天字符时 认为年龄为0岁0个月X天
  if (yearFlag === -1 && monthFlag === -1 && dayFlag > -1) {
    ageInfo.year = '0'
    ageInfo.month = '0'
    ageInfo.day = age.substring(0, dayFlag)

    ageInfo.age = ageInfo.day + '天'
    return ageInfo
  }
};

/*base64转file，主要用于文件上传*/
export function transformBase64ToFile(base64Url, imageType) {
  let base64 = base64Url.split(',');
  // 处理不带data:image/png;base64,的数据
  let binary = window.atob(base64.length > 1 ? base64[1] : base64[0]);
  let array = [];
  for (var i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  let bigImge = new Blob([new Uint8Array(array)], { type: imageType });
  let form = document.forms[0];
  let formData = new FormData(form);
  let timestamp = new Date().getTime();
  formData.append('key', timestamp + '.png');
  formData.append("imageName", bigImge)
  return formData;
}

export function getUserInfo(){
  return {
    userId:$.cookie('_loginName_'),
    userName:$.cookie('_staffName_')
  }
}


/*根据页面来源判断病人类型*/
export function getPatientSourceType(pageFrom) {
  let result = "";
  if (pageFrom == 'patientinfo') {
    result = 'IH';
  } else if (pageFrom == 'emergencyNursing') {
    result = 'ET';
  } else {
    result = 'OD';
  }
  return result;
}

/*图片转base64*/
export function getBase64Image(img) {
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, img.width, img.height);
  var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
  var dataURL = canvas.toDataURL("image/" + ext);
  return dataURL;
}


export function convertImgToBase64(url, outputFormat) {
  //downLoadImg(url);
  //return;
  return new Promise((resolve,reject) => {
    var canvas = document.createElement('CANVAS'),
          ctx = canvas.getContext('2d'),
          img = new Image;  
    img.crossOrigin = '*';  
    img.onload = function() {    
      canvas.height = img.height;    
      canvas.width = img.width;    
      ctx.drawImage(img, 0, 0);    
      var dataURL = canvas.toDataURL(outputFormat || 'image/png');
      // callback.call(this, dataURL);    
      canvas = null; 
      resolve(dataURL); 
    };  
    img.src = url;
  })  
}
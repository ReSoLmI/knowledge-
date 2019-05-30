import cookie from 'jquery.cookie';
let roles = null;
if (window.sessionStorage.getItem('attchedRoles')) {
  roles = window.sessionStorage.getItem('attchedRoles');
}
const attchedRoles = JSON.parse(roles) || [];

const common = {

  //跨域iframe交互
  exec_iframe: function () {
    //
    // pageFrom=patientinfo
    if (common.getUrlParam("pageFrom") == 'patientinfo') {
      let transPage = unescape(common.getUrlParam("transPage"));
      let transFun = common.getUrlParam("transFun");
      if (typeof (exec_obj) == 'undefined') {
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

      // let index = common.getUrlParam("layerId");
      // window.parent.layer.closeALL();
    }

  },
  dateForm: function (val) {
    if (!val) {
      return;
    }
    var list = val.split(" ");
    var date = list[0].split("-");
    var y = parseInt(date[0]);
    var m = parseInt(date[1]) - 1;
    var d = parseInt(date[2]);

    if (list.length > 1) {
      var time = list[1].split(":");
      var h = parseInt(time[0]);
      var min = parseInt(time[1]);
      var s = parseInt(time[2]);
      return new Date(y, m, d, h, min, s);
    } else {
      return new Date(y, m, d);
    }
  },
  layerMsg: function (content, time, fun) {
    return layer.open({
      type: 1,
      title: '提示',
      area: ['480px', ''],
      shadeClose: true, //点击遮罩关闭
      time: time || 2000,
      content: content,
      end: function () {
        if (fun) {
          fun();
        }
      }

    });
  },
  tip_msgArea: function (msg, time, callbackFun) {
    console.log('5555555555555');
    layer.msg(msg || "操作成功！", {
      time: time || 1000,
      offset: '100px',
      anim: 6
    }, function () {
      if (callbackFun) {
        callbackFun();
      }
    });
  },
  tip_msg: function (msg, time, callbackFun) {
    debugger
    layer.msg(msg || "操作成功！", {
      time: time || 1000,
      /*offset: '20px'*/
    }, function () {
      if (callbackFun) {
        callbackFun();
      }
    });
  },
  isNullOrEmpty: function (str) {
    if (str == "" || str == undefined || str == null) {
      return true;
    } else {
      return false;
    }
  },
  /*查询是否存在该角色，如果不存在添加到数组中*/
  convertRole: function (arr, key) {
    let obj = arr.find(al => {
      return al.roleCode == key;
    })
    if (obj) {
      attchedRoles.push({
        'roleCode': key
      });
    }
  },
  /**
   * [getAllRight 获取所有的权限，取得评估单配置，护理诊断配置以及问卷配置三个角色并缓存]
   * @param  {[type]} to     [需要跳转的路径]
   * @param  {[type]} router [路由]
   * @return {[type]}        [description]
   */
  getAllRight: function (to, router) {
    let that = this;
    if (attchedRoles.length == 0) {
      common.ajax({
        url: "user-service/userdetail",
        dataType: "json",
        type: "get",
        async: false,
        data: {},
        callback: function (data) {
          let arr = data.attachedRoles;
          that.convertRole(arr, 'ASSESSMENT_CONF');
          that.convertRole(arr, 'DIAGNOSIS_CONF');
          that.convertRole(arr, 'QUESTIONNAIRE_CONF');
          if (attchedRoles.length > 0) {
            window.sessionStorage.setItem("attchedRoles", JSON.stringify(attchedRoles));
          } else {
            window.sessionStorage.setItem("attchedRoles", []);
          }
          that.showRouter(to, router);
        }
      });
    } else {
      that.showRouter(to, router);
    }
  },
  /**
   * [showRouter 指定跳转的路由]
   * @param  {[type]} to     [初始跳转到的页面]
   * @param  {[type]} router [路由]
   * @return {[type]}        [description]
   */
  showRouter: function (to, router) {
    let that = this;
    let arr = attchedRoles.filter(ak => {
      return ak.roleCode == 'ASSESSMENT_CONF';
    });
    let ss = to;
    if (arr.length == 0) {
      let otherRoles = attchedRoles.filter(al => {
        return al.roleCode == 'DIAGNOSIS_CONF' || al.roleCode == 'QUESTIONNAIRE_CONF';
      })
      if (otherRoles.length == 0 && to.path != '/noRightMsg') {
        /*三个角色都没有配置则跳转到提示页面*/
        router.push({
          path: '/noRightMsg'
        });
      } else {
        if (attchedRoles.find(al => {
            return al.roleCode == 'DIAGNOSIS_CONF';
          })) {
          /*如果有护理诊断配置员角色，则跳转到护理诊断配置界面*/
          if ((to.path == '/' || to.path == '/questionList') && to.path != '/nursingDiagnosis') {
            router.push({
              path: '/nursingDiagnosis'
            });
          }
        } else if (attchedRoles.find(ak => {
            return ak.roleCode == 'QUESTIONNAIRE_CONF';
          })) {
          /*如果只有问卷配置角色，则只跳转到问卷配置界面*/
          if ((to.path == '/' || to.path == '/questionList') && to.path != '/questionnaireTemplate') {
            router.push({
              path: '/questionnaireTemplate'
            });
          }
        }
      }
    }
  },
  getUrlParam: function (name, herf) {
    var result = "";
    var url = decodeURI(herf || window.location.href);
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
  },

  setUserInfo: function () {

    var token = this.getUrlParam("token");
    var platformUrl = this.getUrlParam("platformUrl");
    if (token != "") {
      $.cookie("_token_", token, {
        path: '/',
        expires: 10
      });
      /*	var url=this.getPlatformUrl()+"/user-service/userdetail";
      	this.ajax({
      	    url:url,
      	    dataType : "json",
      	    type:"get",
      	    async:false,
      	    callback : function( data){
      	        $.cookie("_loginId_",data.loginId, { path: '/', expires: 10 });
      	        $.cookie("_loginName_",data.loginName, { path: '/', expires: 10 });
      	        $.cookie("_staffName_",data.staffName, { path: '/', expires: 10 });
      	    }
      	});*/
    }
    if (platformUrl != "") {
      $.cookie("_platformUrl_", platformUrl, {
        path: '/',
        expires: 10
      });
    }
    common.setOrganCode();
  },
  setWardCode: function () {
    var wardCode = this.getUrlParam("wardCode");
    if (wardCode != "") {
      $.cookie("_wardCode_", wardCode, {
        path: '/',
        expires: 10
      });
    }
  },
  setOrganCode: function () {
    var organCode = this.getUrlParam("organCode");
    if (organCode != "") {
      $.cookie("_organCode_", organCode, {
        path: '/',
        expires: 10
      });
    }
  },
  getOrganCode: function () {
    return $.cookie("_organCode_");
  },
  getWardCode: function () {
    return $.cookie("_wardCode_");
  },
  getPlatformUrl: function () {
    let href;
    try {
      href = window.top.location.href
    } catch (e) {
      href = window.location.href
    }
    var platformUrl = this.getUrlParam('platformUrl', href);
    if (this.isNullOrEmpty(platformUrl)) {
      platformUrl = $.cookie("_platformUrl_");
      if (!this.isNullOrEmpty(platformUrl)) {
        this.setCookie("_platformUrl_", platformUrl, "d10");
      }
    }
    return platformUrl;

  },
  getServiceUrl: function () {
    var serviceUrl = $.cookie("_serviceUrl_");
    if (!serviceUrl) {
      serviceUrl = $.cookie("_serviceUrl_");
      this.setCookie("_serviceUrl_", serviceUrl, {
        path: '/',
        expires: 10
      });
    }
    return serviceUrl;
  },

  setCookie: function (name, value, time) {
    var strsec = this.getsec(time);
    var exp = new Date();
    exp.setTime(exp.getTime() + strsec * 1);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/";
  },
  getsec: function (str) {
    var str1 = str.substring(1, str.length) * 1;
    var str2 = str.substring(0, 1);
    if (str2 == "s") {
      return str1 * 1000;
    } else if (str2 == "h") {
      return str1 * 60 * 60 * 1000;
    } else if (str2 == "d") {
      return str1 * 24 * 60 * 60 * 1000;
    }
  },

  logout: function () {
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

    if (!this.getPlatformUrl()) {
      window.top.location.href = "" + "/user/html/login.html";
      return;
    }
    window.top.location.href = this.getPlatformUrl() + "/user/html/login.html";

  },

  ajax: function (options) {
    options.hideLayer = options.hideLayer == undefined ? true : options.hideLayer;
    if ($.cookie("_token_")) {
      options.headers = {
        "Authorization": "Bearer " + $.cookie("_token_")
      };
    } else {
      options.headers = {};
    }
    let newUrl = options.url + "?random=" + Math.random();
    if (options.url.indexOf('?') > -1) {
      newUrl = options.url + "&random=" + Math.random();
    }
    $.ajax({
      type: /*"get"*/ options.type || "post",
      url: newUrl,
      dataType: options.dataType || "json",
      beforeSend: function () {
        layer.load(2, {
          offset: ['50%', '50%']
        });
      },
      contentType: options.content_type || "application/json",
      //data :JSON.stringify({"testStr":"testStr"}),
      timeout: options.timeout || 10000,
      async: (options.async != undefined) ? options.async : true,
      data: options.data || {},
      headers: options.headers,
      //timeout:300000,
      complete: function () {
        layer.closeAll('loading');
      },
      success: function (result) {
        layer.closeAll('loading');
        if (result) {
          if (result.error_code || result.error_code == "") {
            if (options.failure) {
              options.failure(result)
            } else {
              common._callException(result);
            }
          } else {
            common._callSuccess(options.callback, result);
            /*setTimeout(function(){zh_tran('t');},0)*/
          }
        } else {
          common._callSuccess(options.callback, result);
          /*setTimeout(function(){zh_tran('t');},0)*/
        }
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {

        layer.closeAll('loading');
        if (options.hideLayer) {
          layer.closeAll();
        }
        var result = eval('(' + XMLHttpRequest.responseText + ')')
        if (options.failure) {
          options.failure(result)
          return
        }
        /*var result = eval('(' + XMLHttpRequest.responseText + ')');
         if(result.success){
         _callSuccess(options.callback,result);
         }else{
         if(options.failure){
         options.failure(result)
         }else{
         _callException(result);
         }
         }*/
        if (XMLHttpRequest.status == '500' || XMLHttpRequest.status == '401') {
          var obj = JSON.parse(XMLHttpRequest.responseText);
          //XMLHttpRequest.responseText

          if (obj.code == '10000') {
            layer.open({
              type: 1,
              title: '提示',
              area: ['480px', ''],
              shadeClose: true, //点击遮罩关闭
              content: '<div>' +
                '<h3 class="health-score">系统异常，请稍后再试！</h3>' +
                '</div>'
            });
          } else if (obj.code == '20401' || obj.code == "10007") {

            common.tip_msg("请重新登录！", null, function () {
              common.logout();
            });
          } else if (obj.error == "invalid_token") {
            common.logout();
          } else {
            common._callError(options.failure, obj);
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
          common._callError(options.failure, obj);
        }
      }
    });
  },


  /**
   * 出现异常时调用异常信息
   * @param failure(Function) 失败时回调方法
   * @param errorMessage(String) 异常信息
   *
   */
  _callError(failure, errorMessage) {
    if (failure) {
      failure(errorMessage);
    } else {
      layer.open({
        type: 1,
        title: '提示',
        area: ['480px', ''],
        shadeClose: true, //点击遮罩关闭
        content: '<div class="article-01">' +
          '<h3 class="health-score">' + errorMessage.message + '</h3>' +
          '</div>'
      });
    }
  },

  /**
   * 调用成功之后 处理方法
   * @param callback(Function) 成功之后的回调方法
   * @param result 请求返回的结果集
   */
  _callSuccess(callback, result) {
    if (callback) {
      callback(result);
    }
  },
  /*使用方法
   var now = new Date();
   var nowStr = now.format("yyyy-MM-dd hh:mm:ss");
   //使用方法2:
   var testDate = new Date();
   var testStr = testDate.format("YYYY年MM月dd日hh小时mm分ss秒");
   alert(testStr);
   //示例：
   alert(new Date().Format("yyyy年MM月dd日"));
   alert(new Date().Format("MM/dd/yyyy"));
   alert(new Date().Format("yyyyMMdd"));
   alert(new Date().Format("yyyy-MM-dd hh:mm:ss"));
   */
  format(date, format) {
    var o = {
      "M+": date.getMonth() + 1,
      //month
      "d+": date.getDate(),
      //day
      "h+": date.getHours(),
      "H+": date.getHours(),
      //hour
      "m+": date.getMinutes(),
      //minute
      "s+": date.getSeconds(),
      //second
      "q+": Math.floor((date.getMonth() + 3) / 3),
      //quarter
      "S": date.getMilliseconds() //millisecond
    };

    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
      if (new RegExp("(" + k + ")").test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
      }
    }
    return format;
  },
  /**
   * [getAnotherDay 获取距离某个日期的指定类型的某一天]
   * @param  {[type]} type     [类型]
   * @param  {[type]} num      [差值]
   * @param  {[type]} isFormat [是否需要格式化]
   * @param  {[Date]} startDay [指定日期]
   * @return {[type]}          [description]
   * getAnotherDay('date', -1, true) 获取昨天+格式化
   */
  getAnotherDay(type, num, isFormat, startDay) {
    var _day = startDay || new Date();
    switch (type) {
      case 'year':
        _day = _day.setFullYear(_day.getFullYear() + num);
        break;
      case 'month':
        _day = _day.setMonth(_day.getMonth() + num);
        break;
      case 'date':
        _day = _day.setDate(_day.getDate() + num);
        break;
    }
    _day = new Date(_day);
    return !isFormat ? _day : _day.format('yyyy-MM-dd');
  },
  showSex(val) {
    var sexs = {
      1: "男",
      0: "女"

    };
    return sexs[val] || '未知';
  },
  showSexClass(val) {
    var sexs = {
      1: "i-male",
      2: "i-female"
    };
    return sexs[val] || 'null';
  },
  getTextClass(level) {
    let colorObj = {
      1: "txt-nurse-first",
      2: "txt-nurse-second",
      3: "txt-nurse-three",
      0: "txt-nurse-premium"
    }
    return colorObj[level];

  },
  getLevelClass(level) {
    let colorObj = {
      1: "span-nurse-first", //"span-plain-nurse-first",
      2: "span-nurse-second", //"span-plain-nurse-second",
      3: "span-nurse-three",
      0: "span-nurse-premium"
    }
    return colorObj[level];

  },
  stopScroll() {
    $('.mint-popup').bind('touchmove', function () {
      event.preventDefault();
    })
  },

  navBackbutton(name, fn) {

    if (typeof (fn) === 'function') {
      // document.removeEventListener("backbutton", function(){
      //   fn(name);
      // } , false);
      document.addEventListener("backbutton", function () {
        fn(name);
      }, false);
    }
  },

  queryAllWards(wardCode) {
    return new Promise((resolve, reject) => {
      common.ajax({
        url: 'sys-service/sys/v1/units',
        type: 'get',
        async: false,
        dataType: 'json',
        data: {
          'organCode': common.getOrganCode(),
          // 'wardCode': wardCode
        },
        callback: (result) => {
          var wardList = []
          for (var ward in result) {
            wardList = wardList.concat(result[ward])
          }
          console.log(this.wardList)
          resolve(wardList)
        }
      })
    })
  }
}

export default common;

/*使用方法
 var now = new Date();
 var nowStr = now.format("yyyy-MM-dd hh:mm:ss");
 //使用方法2:
 var testDate = new Date();
 var testStr = testDate.format("YYYY年MM月dd日hh小时mm分ss秒");
 alert(testStr);
 //示例：
 alert(new Date().Format("yyyy年MM月dd日"));
 alert(new Date().Format("MM/dd/yyyy"));
 alert(new Date().Format("yyyyMMdd"));
 alert(new Date().Format("yyyy-MM-dd hh:mm:ss"));
 */
Date.prototype.format = function (format) {
  format = format || 'yyyy-MM-dd';
  var that = this;
  var o = {
    "M+": that.getMonth() + 1,
    //month
    "d+": that.getDate(),
    //day
    "h+": that.getHours(),
    //hour
    "m+": that.getMinutes(),
    //minute
    "s+": that.getSeconds(),
    //second
    "q+": Math.floor((that.getMonth() + 3) / 3),
    //quarter
    "S": that.getMilliseconds() //millisecond
  };

  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }

  for (var k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }
  return format;
};

String.prototype.format = function () {
  var args = arguments;
  return this.replace(/\{(\d+)\}/g, function (s, i) {
    return args[i];
  });
}

Array.prototype.where = function (str) {
  var rs = [];
  for (var i in this) {
    var o = this[i];
    if (typeof (this[i]) != 'function')
      if (eval(str)) rs.push(o);
  }
  return rs;
};

Array.prototype.remove = function (val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};

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
    $.ajax({
      type: options.type || "post",
      url: "/" + options.url + (options.cache ? "" : ("?random=" + Math.random())),
      cache: options.cache || false,
      dataType: options.dataType || "json",
      beforeSend: function (request) {
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
      complete: function () {
        if (!options.noHideLoading) {
          layer.closeAll('loading');
        }
      },
      success: function (result) {
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
      error: function (XMLHttpRequest, textStatus, errorThrown) {
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
            layer.open({
              type: 1,
              title: '提示',
              area: ['480px', ''],
              shadeClose: true, //点击遮罩关闭
              content: '<div>' +
                '<h3 class="health-score">系统异常，请稍后再试！</h3>' +
                '</div>'
            });
          } else if (obj.code == '20401' || obj.code == "10007") {
            common.tip_msg("请重新登录！", null, function () {
              common.logout();
            });
          } else if (obj.error == "invalid_token") {
            common.logout();
          } else {
            if (!options.showFailure) {
              common.openLayer(obj.message);
            }
          }
          //reject(obj);
        } else {
          try {
            layer.close(z);
          } catch (e) {}
          z = layer.open({
            type: 1,
            title: '提示',
            area: ['480px', ''],
            shadeClose: true, //点击遮罩关闭
            content: '<div>' +
              '<h3 class="health-score">系统异常，请稍后再试！!</h3>' +
              '</div>'
          });
          //reject(obj);
        }
        reject(obj);
      }
    })
  })
}

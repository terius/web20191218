var com = (function() {
  "use strict";

  let com = {};
  com.api = {};

  /************************************时间处理【开始】************************************/
  //时间格式化处理
  Date.prototype.Format = function(fmt) {
    // author: meizz
    var o = {
      "M+": this.getMonth() + 1, // 月份
      "d+": this.getDate(), // 日
      "H+": this.getHours(), // 小时
      "m+": this.getMinutes(), // 分
      "s+": this.getSeconds(), // 秒
      "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
      S: this.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length)
      );
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length == 1
            ? o[k]
            : ("00" + o[k]).substr(("" + o[k]).length)
        );
    return fmt;
  };

  //当前时间转成 年-月-日 时:分:秒
  com.getNowDateTime = function() {
    var now = new Date();
    return com.getDateTime(now);
  };
  //当前时间转成 年-月-日
  com.getNowDate = function() {
    var now = new Date();
    return com.getDate(now);
  };
  //转成 年-月-日
  com.getDate = function(d) {
    var year = "" + d.getFullYear();
    var month = "" + (d.getMonth() + 1);
    if (month.length == 1) {
      month = "0" + month;
    }
    var day = "" + d.getDate();
    if (day.length == 1) {
      day = "0" + day;
    }
    return year + "-" + month + "-" + day;
  };
  //转成 年-月-日 时:分:秒
  com.getDateTime = function(d) {
    var hour = "" + d.getHours();
    if (hour.length == 1) {
      hour = "0" + hour;
    }
    var minute = "" + d.getMinutes();
    if (minute.length == 1) {
      minute = "0" + minute;
    }
    var second = "" + d.getSeconds();
    if (second.length == 1) {
      second = "0" + second;
    }
    return com.getDate(d) + " " + hour + ":" + minute + ":" + second;
  };
  com.convertUnixTime = function(unix_timestamp) {
    if (!unix_timestamp) {
      return "";
    }
    var date = new Date(unix_timestamp);
    return com.getDateTime(date);
  };
  /************************************时间处理【结束】************************************/

  /************************************jquery ajax处理【开始】************************************/

  com.ajaxBeforeSend = function(event, xhr) {
    //  com.showLoading(xhr.type == "GET" ? "努力加载中" : "努力执行中");
    com.showLog("jquery get：" + xhr.url);
    var searchIndex = xhr.url.indexOf("?");
    //if (searchIndex > 0) {
    //    var queryparam = com.trim(decodeURIComponent(xhr.url));
    //    xhr.url = queryparam;
    //}
    if (xhr.processData && xhr.data) {
      xhr.data = com.trim(decodeURIComponent(xhr.data));
    }
  };

  com.ajaxComplete = function(event, xhr, options) {
    //  $.hideLoading();
    if (event.responseJSON) {
      // return event.responseJSON.data;
      com.showLog(event.responseJSON);
    }
  };

  com.ajaxFail = function(error) {
    alert(error.responseText, "错误");
    com.showLog(error);
  };

  com.dataFilter = function(data, type) {
    var result = JSON.parse(data);
    if (!result.success) {
      alert(result.msg);
      throw result.msg;
    }
    return JSON.stringify(result);
  };

  //修改jquery全局ajax事件
  $.ajaxSettings = $.extend($.ajaxSettings, {
    error: com.ajaxFail,
    beforeSend: com.ajaxBeforeSend,
    complete: com.ajaxComplete,
    dataFilter: com.dataFilter
  });

  com.ajaxQuery = function(url, data, dataType) {
    dataType = dataType || "json";
    data = data || {};
    return $.ajax({
      type: "get",
      url: url,
      dataType: dataType,
      data: data,
      timeout: 5000
    });
  };

  com.postForm = function(path, params, method) {
    method = method || "post"; // Set method to post by default if not specified.

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for (var key in params) {
      if (params.hasOwnProperty(key)) {
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", params[key]);

        form.appendChild(hiddenField);
      }
    }

    document.body.appendChild(form);
    form.submit();

    document.body.removeChild(form);
  };

  com.api.url = "http://zone.sll.link:20001/";
  com.api.defaultOpts = {
    //beforeSend: function (xhr) {
    //    xhr.setRequestHeader('Authorization', 'Bearer ' + com.api.token);
    //},
    dataType: "json",
    type: "GET",
    contentType: "application/json"
  };
  com.requestApi = function(method, data, option) {
    var options = $.extend({}, com.api.defaultOpts, option);
    if (!options.notcheck) {
      options.beforeSend =
        options.beforeSend ||
        function(xhr) {
          var token = sessionStorage.getItem("token");
          if (!token) {
            alert("用户未登陆或已过期");
            throw "用户未登陆或已过期";
          }
          xhr.setRequestHeader("Authorization", "Bearer " + token);
        };
    }
    options.data = data;
    options.url = com.api.url + method;
    // com.alert(options);
    return $.ajax(options);
  };

  com.getData = async function(method, requestData) {
    return com.requestApi(method, requestData);
  };

  com.getDataAny = async function(method, requestData) {
    return com.requestApi(method, requestData, { notcheck: true });
  };

  com.postData = function(method, data) {
    return com.requestApi(method, data, { type: "POST" });
    // if (location.hostname == "localhost") {
    // }
    // else {
    //     return com.requestApi(method, data, { type: "POST" });
    // }
  };

  /************************************jquery ajax处理【结束】************************************/

  /************************************一般js方法【开始】************************************/
  com.showLog = function(msg, title) {
    var now = com.getNowDateTime();
    var t = title ? title : "";
    if (typeof msg === "string") {
      console.log(msg, now + "  " + t);
    } else {
      console.log(JSON.stringify(msg, null, 4), now + "  " + t);
    }
  };

  //通用警告框
  com.alert = function(msg) {
    if (msg instanceof Object) {
      alert(JSON.stringify(msg, null, 4));
    } else {
      alert(msg);
    }
  };

  //获取url参数（未使用）
  com.funcUrl = function(name, value, type) {
    var loca = window.location;
    var baseUrl = type == undefined ? loca.origin + loca.pathname + "?" : "";
    var query = loca.search.substr(1);
    // 如果没有传参,就返回 search 值 不包含问号
    if (name == undefined) {
      return query;
    }
    // 如果没有传值,就返回要查询的参数的值
    if (value == undefined) {
      var val = query.match(new RegExp("(^|&)" + name + "=([^&]*)(&|$)"));
      return val != null ? decodeURI(val[2]) : null;
    }
    var url;
    if (query == "") {
      // 如果没有 search 值,则返回追加了参数的 url
      url = baseUrl + name + "=" + value;
    } else {
      // 如果没有 search 值,则在其中修改对应的值,并且去重,最后返回 url
      var obj = {};
      var arr = query.split("&");
      for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].split("=");
        obj[arr[i][0]] = arr[i][1];
      }
      obj[name] = value;
      url =
        baseUrl +
        JSON.stringify(obj)
          .replace(/[\"\{\}]/g, "")
          .replace(/\:/g, "=")
          .replace(/\,/g, "&");
    }
    return url;
  };

  /************************************一般js方法【结束】************************************/

  //自定义生成js文件
  com.writejs = function(path) {
    document.write(
      unescape(
        "%3Cscript src='" +
          path +
          "?t=" +
          new Date().getTime() +
          "' type='text/javascript'%3E%3C/script%3E"
      )
    );
  };

  //获取页面参数
  com.getParam = function(pname) {
    var params = location.search.substr(1); //  获取参数 平且去掉？
    var ArrParam = params.split("&");
    //if (ArrParam.length == 1) {
    //    //只有一个参数的情况
    //    return params.split('=')[1];
    //}
    //else {
    //多个参数参数的情况
    for (var i = 0; i < ArrParam.length; i++) {
      if (ArrParam[i].split("=")[0].toLowerCase() == pname.toLowerCase()) {
        return decodeURIComponent(ArrParam[i].split("=")[1]);
      }
    }
    return "";
    // }
  };

  //去掉所有的html标记，包含前后空格
  com.trim = function(str) {
    if (str == undefined) {
      return "";
    }
    return $.trim(str.replace(/<[^>]+>/g, ""));
  };

  //显示加载页面
  com.showLoading = function(text) {
    var html = '<div class="weui_loading">';
    html += '<i class="weui-loading weui-icon_toast"></i>';
    html += "</div>";
    html += '<p class="weui-toast_content">' + (text || "努力加载中") + "</p>";
    com.show(html, "weui_loading_toast");
  };

  //显示提示信息
  com.show = function(html, className) {
    className = className || "";
    var mask = $("<div class='weui-mask_transparent'></div>").appendTo(
      document.body
    );

    var tpl = '<div class="weui-toast ' + className + '">' + html + "</div>";
    var dialog = $(tpl).appendTo(document.body);

    dialog.addClass("weui-toast--visible");
    dialog.show();
  };

  //设置Cookie
  com.setCookie = function(name, value, expDays) {
    var exp = new Date();
    exp.setDate(exp.getDate() + expDays);
    document.cookie = name + "=" + value + ";expires=" + exp.toGMTString();
  };

  //设置返回页面
  com.setReturnUrl = function(url) {
    if (url != undefined && url.length > 1) {
      localStorage.returnUrl = url.toLowerCase();
    }
  };

  //获取返回页面
  com.getReturnUrl = function() {
    var url = localStorage.returnUrl;
    if (url) {
      return url;
    }
    return "/MyCenter/Index"; //默认返回个人中心
  };

  //设置返回按钮所要跳转的url(有点问题，弃用)
  com.setBackUrl = function(backUrl) {
    return;
    pushHistory();
    var bool = false;
    setTimeout(function() {
      bool = true;
    }, 1500);
    window.addEventListener(
      "popstate",
      function(e) {
        if (bool) {
          // alert("我监听到了浏览器的返回按钮事件啦");//根据自己的需求实现自己的功能
          window.location.href = backUrl; //需要返回的页面
        }
        pushHistory();
      },
      false
    );

    function pushHistory() {
      var state = {
        title: "title",
        url: "#"
      };
      window.history.pushState(state, "title", "");
    }
  };

  //长按事件
  com.longClick = function(obj, startCallBack, endCallBack) {
    var timeOutEvent = 0;
    var longPress = function() {
      timeOutEvent = 0;
      startCallBack.call();
    };
    $(obj).on({
      touchstart: function(e) {
        e.preventDefault();
        timeOutEvent = setTimeout(function() {
          longPress();
        }, 800);
      },
      touchmove: function() {
        clearTimeout(timeOutEvent);
        timeOutEvent = 0;
      },
      touchend: function() {
        clearTimeout(timeOutEvent);
        if (timeOutEvent != 0) {
          com.showLog("你这是点击，不是长按");
          //  v.show("你这是点击，不是长按");
        } else {
          //  v.show("长按事件结束");
          endCallBack.call();
        }
        return false;
      }
    });
  };

  //显示弹出框
  com.showModal = function(title, text, buttons) {
    $.modal({
      title: title,
      text: '<div class="custom-modal">' + text + "</div>",
      buttons: buttons
    });
  };

  //显示确认框
  com.showConfirm = function(title, text) {
    return new Promise((resolve, reject) => {
      $.confirm({
        title: title,
        text: '<div class="custom-modal">' + text + "</div>",
        onOK: function() {
          resolve();
        },
        onCancel: function() {
          reject();
        }
      });
    });
  };

  //彻底冻结某个对象，不允许改变任何属性或添加属性
  com.constantize = obj => {
    Object.freeze(obj);
    Object.keys(obj).forEach((key, i) => {
      if (typeof obj[key] === "object") {
        constantize(obj[key]);
      }
    });
  };

  com.triggerClick = function(node) {
    if (document.createEvent) {
      var evt = document.createEvent("MouseEvents");
      evt.initEvent("click", true, false);
      node.dispatchEvent(evt);
    } else if (document.createEventObject) {
      node.fireEvent("onclick");
    } else if (typeof node.onclick == "function") {
      node.onclick();
    }
  };

  com.checkArrayExistValue = function(arr, key, value) {
    if (!arr || arr.length < 1) {
      return false;
    }
    if (arguments.length === 3) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i][key] == value) {
          return true;
        }
      }
    } else {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] == key) {
          return true;
        }
      }
    }

    return false;
  };

  com.removeItem = function(array, val, value) {
    let index = -1;
    if (arguments.length === 3) {
      index = com.findIndexInArray(array, val, value);
    } else {
      index = array.indexOf(val);
    }
    if (index > -1) {
      array.splice(index, 1);
    }
    return array;
  };

  /**
   * 查找元素的索引
   */
  com.findIndexInArray = function(arr, key, value) {
    console.log("arr查找元素的索引", arr);
    for (let i = 0; i < arr.length; i++) {
      if (arr[i][key] === value) {
        return i;
      }
    }
    return -1;
  };

  com.validate = function(type, value) {
    let val = com.trim(value);
    if (type == "phone") {
      if (!val || val.length != 11) {
        return false;
      }
      return /^0?(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/.test(
        val
      );
    }
  };

  com.initPullRefresh = function(id) {
    var _element = document.getElementById(id),
      //  _refreshText = document.querySelector('.refreshText'),
      _startPos = 0,
      _transitionHeight = 0;
    var dom = document.getElementById("comdetail");
    _element.addEventListener(
      "touchstart",
      function(e) {
        //  e.preventDefault();
        console.log(dom.scrollTop);
        console.log("初始位置：", e.touches);
        _startPos = e.touches[0].pageY;
        // _element.style.position = "relative";
        //   _element.style.transition = "transform 0s";
      },
      false
    );

    // _element.addEventListener(
    //   "touchmove",
    //   function(e) {
    //     // $(".load").show();
    //     console.log("当前位置：", e.touches[0].pageY);
    //     _transitionHeight = e.touches[0].pageY - _startPos;

    //     if (_transitionHeight > 0 && _transitionHeight < 50) {
    //       //   _refreshText.innerText = '下拉刷新';
    //       _element.style.transform = "translateY(" + _transitionHeight + "px)";

    //       if (_transitionHeight > 55) {
    //         //   _refreshText.innerText = '释放更新';
    //       }
    //     }
    //   },
    //   false
    // );

    // _element.addEventListener(
    //   "touchend",
    //   function(e) {
    //     _element.style.transition = "transform 0.5s ease 1s";
    //     _element.style.transform = "translateY(0px)";
    //     // $(".load").hide();
    //     //   _refreshText.innerText = '更新中...';

    //     // todo...
    //   },
    //   false
    // );
  };

  com.addNoDupToArray = function(array, key, item) {
    if (arguments.length === 3) {
      if (!this.checkArrayExistValue(array, key, item[key])) {
        array.push(item);
      }
    } else {
      if (!this.checkArrayExistValue(array, key)) {
        array.push(key);
      }
    }
  };

  com.getNodupInArray = function(array, key) {
    const arr = [];
    for (let i = 0; i < array.length; i++) {
      if (array[i][key] != "") {
        com.addNoDupToArray(arr, array[i][key]);
      }
    }
    return arr;
  };

  com.randomNum = function(minNum, maxNum) {
    switch (arguments.length) {
      case 1:
        return parseInt(Math.random() * minNum + 1, 10);
        break;
      case 2:
        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
        break;
      default:
        return 0;
        break;
    }
  };

  com.clone = function(obj) {
    var o, i, j, k;
    if (typeof obj != "object" || obj === null) return obj;
    if (obj instanceof Array) {
      o = [];
      i = 0;
      j = obj.length;
      for (; i < j; i++) {
        if (typeof obj[i] == "object" && obj[i] != null) {
          o[i] = com.clone(obj[i]);
        } else {
          o[i] = obj[i];
        }
      }
    } else {
      o = {};
      for (i in obj) {
        if (typeof obj[i] == "object" && obj[i] != null) {
          o[i] = com.clone(obj[i]);
          //  o[i] = arguments.callee(obj[i]);
        } else {
          o[i] = obj[i];
        }
      }
    }

    return o;
  };

  com.saveSession = function(key, val) {
    if (val != null && val != undefined) {
      if (typeof val === "object") {
        sessionStorage.setItem(key, JSON.stringify(val));
      } else {
        sessionStorage.setItem(key, val);
      }
    }
  };
  /**
   * 从sessionStorage获取数据
   */
  com.getSession = function(key, isObject) {
    var val = sessionStorage.getItem(key);
    // this.showLog(val);
    try {
      if (isObject) {
        return JSON.parse(val);
      }
      return val;
    } catch {
      return val;
    }
  };

  com.isNumeric = function(value) {
    return /^-{0,1}\d+$/.test(value);
  };

  com.pageQuery = function(array, pageIndex, pageCount) {
    pageIndex = pageIndex || 1;
    pageCount = pageCount || 10;
    let start = (pageIndex - 1) * pageCount;
    let end = start + pageCount;
    let arr = [];
    for (let i = 0; i < array.length; i++) {
      if (i >= start && i < end) {
        arr.push(array[i]);
      }
    }
    return arr;
  };

  return com;
})();

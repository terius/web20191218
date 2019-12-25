var server = (function() {
  "use strict";
  let config = {
    env: 1 //1-本地数据 2-正式数据
  };
  const pageDefaultSize = 10;
  let server = {};
  let initLocalData = function() {
    blog_list.forEach(function(item) {
      item.user_info = user_list.find(d => d.guid == item.create_user);
      //   item.pictures = item.pictures.split(",");
    });

    live_list.forEach(function(item) {
      item.user_info = user_list.find(d => d.guid == item.create_user);
    });

    type_list = type_list.sort((a, b) => a.show_index - b.show_index);
  };
  if (config.env == 1) {
    initLocalData();
  }
  //发送手机号码获取手机验证码
  server.sendPhoneNum = function(phone) {
    if (!phone || phone.length != 11 || !com.isNumeric(phone)) {
      alert("请输入正确的手机号码");
      return false;
    }
    com.postData("appUser/smsRegister?phone=" + phone);
  };

  //注册用户
  server.reg = function(info) {
    var data = {};
    com.postData("appUser/save", {});
  };

  //获取博客首页标题
  server.getTypes = async function() {
    if (config.env == 1) {
      return type_list;
    } else {
      const rs = await com.getDataAny("api/getBlogType");
      return rs.data;
    }
  };

  //获取博客列表
  server.getBlogList = async function(data) {
    console.log(data, "获取博客列表-查询参数");
    if (config.env == 1) {
      return com.pageQuery(
        blog_list.filter(d => d.type == data.type),
        data.index,
        data.length
      );
    } else {
      const rs = await com.getDataAny("api/main", data);
      return rs.data;
    }
  };

  //获取直播列表
  server.getLiveList = async function() {
    if (config.env == 1) {
      return com.pageQuery(live_list, 1, 5);
    } else {
      const rs = await com.getDataAny("imChatRoom/channellist", {
        index: 1,
        length: 6
      });
      return rs.data;
    }
  };

  //获取单条blog信息
  server.getBlogInfo = async function(param) {
    if (config.env == 1) {
      return blog_list.find(d => d.guid == param.guid);
    } else {
      const rs = await com.getDataAny("api/getOneBlog", param);
      return rs.data;
    }
  };

  return server;
})();

//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '登 陆',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    defaultavatar: '../../img/icon.png',
    loginImg: 'https://www.moodfish.cn/upload/wx/mark_02.png',
    defaultSize: 'default',
    primarySize: 'default',
    warnSize: 'default',
    disabled: false,
    plain: false,
    loading: false,
    regtype: 3, //注册类型(0-官方,1-AI测评小程序,2-心理鱼公众号，3-心理鱼小程序，4-AI助手，5-AI咨询，10-百度小程序，11-百度网页，20-支付宝小程序，100-其它)
    mptype: 2 //小程序类型mptype(1- 心理鱼，2-AI心理健康助手, 3-AI心理自助咨询, 20-支付宝小程序，101-百度心理鱼)
  },
  //事件处理函数
  bindViewTap: function() {

  },
  onLoad: function(options) {
    let regtype = 0;
    if (!!options.regtype) {
      regtype = options.regtype;
    }

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        fromtype: 0
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          fromtype: 0
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
            fromtype: 0
          })
        }
      })
    }
    //跳转H5
    //this.getMakeWxMinProgramInfo();
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getWxMinProgramInfo: function(e) {
    //获取小程序用户信息
    let that = this;
    //存储用户ID信息
    let wxUserIdInfo = wx.getStorageSync('wxUserIdInfo');
    if (!!wxUserIdInfo && !!wxUserIdInfo.unionid && wxUserIdInfo.unionid.length > 0) {
      console.log('本地存储ID信息：' + JSON.stringify(wxUserIdInfo));
      this.goToSick();
    } else {

      wx.request({
        url: app.config.server + '/third/getWxMinProgramInfo.html',
        method: 'get',
        data: {
          "code": app.globalData.mincode,
          'mptype': this.data.mptype
        },
        success: function(res) {
          console.log('getWxMinProgramInfo:' + JSON.stringify(res));
          if (res.statusCode == 200) {
            if (res.data.code == 0) {
              let wxuseridinfo = res.data.data;
              if (!!wxuseridinfo.errcode) {
                console.log('获取用户信息失败：' + wxuseridinfo.errmsg)
                wx.showModal({
                  title: '提示',
                  content: '获取用户信息失败：' + wxuseridinfo.errmsg,
                  success(res) {
                    if (res.confirm) {

                    } else if (res.cancel) {

                    }
                  }
                })
              } else {
                wxuseridinfo.nickname = '';
                wxuseridinfo.sex = 0;
                wx.setStorageSync('wxUserIdInfo', wxuseridinfo);
                console.log('重新获得用户ID信息：' + JSON.stringify(wxuseridinfo));
                that.goToSick();

              }
            }
          }
          // wx.hideLoading();
        }
      })
    }

  },
  goToSick: function(e) {
    if (!!app.globalData.mincode && app.globalData.mincode.length > 0) {
      wx.navigateTo({
        url: '../sick/sick?regtype=' + this.data.regtype, //    
        success: function() {}, //成功后的回调；  
        fail: function() {}, //失败后的回调；  
        complete: function() {}
      })
    }

  },
  onShareAppMessage: function() {
    wx.showShareMenu({
      withShareTicket: true
    })
    return {
      title: '心理鱼', //分享内容
      path: '/pages/index/index', //分享地址
      imageUrl: '', //分享图片
      success: function(res) {
        if (res.errMsg == 'shareAppMessage:ok') { //判断分享是否成功
          if (res.shareTickets == undefined) { //判断分享结果是否有群信息
            //分享到好友操作...
            console.log("分享到好友操作");

          } else {
            //分享到群操作...
            var shareTicket = res.shareTickets[0];

            wx.getShareInfo({
              shareTicket: shareTicket,
              success: function(e) {
                //当前群相关信息
                var encryptedData = e.encryptedData;
                var iv = e.iv;
              }
            })

            console.log("分享到群操作");

          }
        } else {
          console.log("分享失败");
        }
      },
      fail: function(res) {
        console.log("转发失败", res);
      },
      complete: function(res) {

      }

    }
  }

})
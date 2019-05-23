//app.js
App({
  config: {
    host: 'server.moodfish.cn',
    port: 9001,
    appid: 'wxba76f60583b08cb3',
    client: 'https://sick.moodfish.cn', //https://sick.moodfish.cn & http://192.168.1.27:8000
    server: 'https://server.moodfish.cn:9001' //https://server.moodfish.cn:9001 & http://192.168.1.27:9001
  },
  onLaunch: function() {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log('wx.login:' + JSON.stringify(res));
        this.globalData.mincode = res.code;
        this.MakeWxMinProgramInfo();
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              //console.log('wx.getUserInfo:' + JSON.stringify(res))
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  MakeWxMinProgramInfo: function(e) {
    //生成小程序用户信息  
    //存储用户ID信息
    let wxUserIdInfo = wx.getStorageSync('wxUserIdInfo');
    if (!!wxUserIdInfo && !!wxUserIdInfo.unionid && wxUserIdInfo.unionid.length > 0) {
      console.log('本地存储ID信息：' + JSON.stringify(wxUserIdInfo));
    } else {
      wx.request({
        url: this.config.server + '/third/MakeWxMinProgramInfo.html',
        method: 'get',
        data: {
          "code": this.globalData.mincode,
          'mptype': 1
        },
        success: function(res) {
          console.log('MakeWxMinProgramInfo:' + JSON.stringify(res));

        }
      })
    }

  },
  globalData: {
    userInfo: null,
    mincode: ''
  },
})
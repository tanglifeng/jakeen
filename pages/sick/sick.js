//sick.js
const util = require('../../utils/util.js')
const app = getApp()

Page({
  data: {
    info: {
      src: ''
    },
    regtype: 3
  },
  onLoad: function(options) {

    wx.showLoading({
      title: '页面加载中...',
    })
    let regtype = 0;
    if (!!options.regtype) {
      regtype = options.regtype;
    }

    let wxUserIdInfo = wx.getStorageSync('wxUserIdInfo');
    if (!!wxUserIdInfo && wxUserIdInfo.unionid)
      this.setData({
        info: {
          src: app.config.client + '?fromtype=2&mptype=1&wxMinUserIdInfo=' + wxUserIdInfo.openid + '#' + wxUserIdInfo.unionid + '&wxmincode=' + app.globalData.mincode + '&regtype=' + this.data.regtype
        }
      })


  },
  binderror: function(e) {
    console.log(e);
  },
  bindload: function(e) {
    wx.hideLoading();
    console.log(this.data.info.src);
  },
  bindmessage: function(e) {
    console.log('bindmessage', e.detail);
  },
  onShareAppMessage(options) {
    console.log(options.webViewUrl)
  }
})
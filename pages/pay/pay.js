//pay.js
//获取应用实例
const app = getApp()

Page({
  data: {
    payInfo: {}
  },
  //事件处理函数
  bindViewTap: function() {

  },
  onLoad: function(options) {
    console.log('options', options);
    let tenpInfo = JSON.parse(options.payinfo);
    if (!!tenpInfo) {

      let payInfo = {
        appId: tenpInfo.appId,
        timeStamp: tenpInfo.timeStamp, // timestamp
        nonceStr: tenpInfo.nonceStr, // nonce
        package: 'prepay_id=' + tenpInfo.package, //prepay_id=
        signType: tenpInfo.signType, //'MD5'
        paySign: tenpInfo.paySign,
      }

      this.setData({
        payInfo: payInfo
      })
      console.log('payInfo', this.data.payInfo);

      wx.requestPayment({
        timeStamp: this.data.payInfo.timeStamp,
        nonceStr: this.data.payInfo.nonceStr,
        package: this.data.payInfo.package,
        signType: 'MD5',
        paySign: this.data.payInfo.paySign,
        success(res) {
          console.log('wxpay success')
          wx.navigateBack();
        },
        fail(res) {
          console.log('wxpay fail', res)
          wx.navigateBack();
        }
      })

    }
  }

})
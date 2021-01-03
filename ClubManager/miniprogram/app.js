//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('连接数据库失败！')

    } else {
      wx.cloud.init({
        env: 'project-a37od',
        traceUser: true,
      })
    }

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId 
        wx.cloud.callFunction({
          name:'getOpenId',
          complete: res => {
            // console.log('云函数获取到的openid: ', res.result.openid)
            console.log('云函数获取到的openid:******* ')
            this.globalData.openid = res.result.openid
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
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
  globalData: {
    STATUS_RESER_WP: "邀请中",
    STATUS_RESER_WA: "审核中",
    STATUS_RESER_OK: "已过审",
    STATUS_RESER_FN: "已结束",
    STATUS_RESER_NO: "未通过",
    STATUS_RESER_FD: "违约",

    STATUS_USER_CR: "可预约",
    STATUS_USER_HR: "已预约",
    STATUS_USER_BL: "小黑屋",
    STATUS_USER_TR: "游客",

    STATUS_VENUE_CR: "可预约",
    STATUS_VENUE_NO: "未开放",
    STATUS_VENUE_HR: "已预约",

    userInfo: null,
    openid:null,
    hasuser:false,
    usermsg:null,
  }
})

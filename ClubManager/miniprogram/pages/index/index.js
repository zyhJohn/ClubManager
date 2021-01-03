//index.js
const app = getApp()

Page({
  data: {
    motto: '欢迎使用社团管理系统~',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  bindViewTap: function() {
    wx.switchTab({
      url: '../home/home',
    })
  },

  onLoad: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  getUserInfo: function(e) {
    wx.request({
      url: 'http://119.3.239.83/test.php',
      data: {
        name: 'root',
        password: '123456',
        database: 'clubmanager',//数据库名
        openid: this.data.openid,
      },
      success: function (res) {
        console.log(res)
      },
    })
  }
})

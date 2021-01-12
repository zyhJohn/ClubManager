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
        this.init()
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
  init: function () {
    var date = new Date();
    var month = date.getMonth() + 1
    var year = date.getFullYear()
    var day = date.getDate()
    const db = wx.cloud.database()
    db.collection('reservation').where({
      reservation_status: this.globalData.STATUS_RESER_OK,
    }).get({
      success: res => {
        var data = res.data
        // console.log(data)
        var l = data.length
        for (var i = 0; i < l; i++) {
          var rdate = data[i].reservation_date.split("-")
          console.log(rdate)
          if ((year > rdate[0]) || ((year == rdate[0]) & (month > rdate[1])) || ((year == rdate[0]) & (month == rdate[1]) & (day > day[2]))){

            wx.cloud.callFunction({
              name: 'modifyDatabase',
              data: {
                name: 'reservation',
                id: data[i]._id,
                data: {
                  reservation_status: this.globalData.STATUS_RESER_FN,
                },
              },
              complete: res => {
                console.log("finish")
                console.log(res.result)
              },
            })
            this.updateMenbermsg(data[i])
          }
        }
      }
    })
  },
  updateMenbermsg:function(data){
    console.log(data)
    var menbers = data.reservation_menber
    this.updateMenberStatus(data.user_no)
    if (menbers !== "") {
      var menbersnolist = menber.split(",")
      for (var i = 0; i < menbersnolist.length; i++) {
        this.updateMenberStatus(menbersnolist[i])
      }
    }
  },
  updateMenberStatus: function (no) {
    const db = wx.cloud.database()
    console.log()
    db.collection('user').where({
      user_no: no,
    }).get({
      success: res => {
        var id = res.data[0]._id
        wx.cloud.callFunction({
          name: 'modifyDatabase',
          data: {
            name: 'user',
            id: id,
            data: {
              reservation_id: "",
              user_status: this.globalData.STATUS_USER_CR,
            },
          },
          complete: res => {

          },
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  globalData: {
    STATUS_USER_GM: "管理员",
    STATUS_USER_NL: "普通用户",
    STATUS_USER_CO: "社长",
    STATUS_USER_CM: "社员",
    STATUS_USER_TR: "游客",

    STATUS_ACTIVITY_WA: "审核中",
    STATUS_ACTIVITY_OK: "已过审",
    STATUS_ACTIVITY_FN: "已结束",
    STATUS_ACTIVITY_NO: "未通过",

    STATUS_ACTIVITY_USER_OK: "已加入",
    STATUS_ACTIVITY_USER_NO: "未加入",
    STATUS_ACTIVITY_USER_WA: "审核中",

    STATUS_VENUE_CR: "可预约",
    STATUS_VENUE_NO: "未开放",
    STATUS_VENUE_HR: "已预约",

    userInfo: null,
    openid:null,
    hasuser:false,
    usermsg:null,
  }
})
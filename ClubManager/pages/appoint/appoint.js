//appoint.js
const util = require('../../utils/util.js')
const app = getApp()

Page({
  data: {
    isread: false,
    iswrite: false,
    venue_id: "",
    date: null,
    venuename: '',
    venuedes: '',
    venuetime: '',
    venuetool: '',
    venueaddr: '',
    venuemax: 0,
    url: "cloud://yuntest1-xt878.7975-yuntest1-xt878-1300763170/picture/unconfirm.png",
    list:{}
  },

  onLoad: function(options) {
    this.setData({
      date: options.date,
      venue_id: options.venue_id,
      url1: "cloud://yuntest1-xt878.7975-yuntest1-xt878-1300763170/picture/unconfirm.png",
      url2: "cloud://yuntest1-xt878.7975-yuntest1-xt878-1300763170/picture/unconfirm.png"
    })
    this.getVenueInfo()

  },

  onShow: function() {
    if (this.data.isread) {
      /*改变tubiao*/
      this.setData({
        url1: "cloud://yuntest1-xt878.7975-yuntest1-xt878-1300763170/picture/confirm.png"
      })
    }
    if (this.data.iswrite) {
      /*改变tubiao*/
      this.setData({
        url2: "cloud://yuntest1-xt878.7975-yuntest1-xt878-1300763170/picture/confirm.png"
      })
    }
  },



  read: function() {
    wx.navigateTo({
      url: '../attention/attention'
    })
  },

  getVenueInfo: function () {
    var venueid = this.data.venue_id
    console.log(venueid)
    const db = wx.cloud.database()
    db.collection('venue').where({
      _id: venueid,
    }).get({
      success: res => {
        var data = res.data[0]
        // console.log('[数据库] [查询记录] 成功: ', res.data[0])
        this.setData({
          venuename: data.venue_name,
          venuedes: data.venue_des,
          venuetime: data.venue_time,
          venuetool: data.venue_tools,
          venueaddr: data.venue_addr,
          venuemax: data.venue_maxnum
        })
      },
    })
  },

  appointment: function() {
    // wx.setStorageSync('date', this.data.date);
    // console.log(this.data.isread)
    if (this.data.isread) {
      if (app.globalData.usermsg.user_status == "已预约") {
        wx.showToast({
          title: '您已有预约',
          icon: 'none',
          duration: 2000
        })
      }
      else{
        let date = JSON.stringify(this.data.date)
        wx.navigateTo({
          url: '../table/table?venue_id=' + this.data.venue_id + "&date=" + date
        })
      }
    } else {
      wx.showToast({
        title: '请先阅读《毕至居预约说明》，并且同意',
        icon: 'none',
        duration: 2000
      })
    }
  },

  submit: function() {
    if (this.data.isread && this.data.iswrite) {
      wx.showModal({
        title: '提示',
        content: '提交后将进入待添加成员状态，该状态下仍可在详情页面修改部分信息',
        icon: 'none',
        duration: 3000,
        success: res => {
          if (res.confirm) {
            console.log('用户点击确定')
            this.putReserMsg()
            wx.navigateBack({
              delta: 2,
            });
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      wx.showToast({
        title: '请先填写预约单！',
        icon: 'none',
        duration: 2000
      })
    }
  },
  putReserMsg: function () {
    var TIME = util.formatTime(new Date());
    const db = wx.cloud.database()
    db.collection('reservation').add({
      // 要插入的数据
      data: {
        user_no: app.globalData.usermsg.user_no,
        reservation_phone: this.data.list.reservation_phone,
        reservation_date: this.data.date,
        reservation_menber: "",
        reservation_menbercount: this.data.list.reservation_menbercount,
        reservation_usetools: this.data.list.reservation_usetools,
        reservation_status: this.data.list.reservation_status,
        venue_id: this.data.venue_id,
        reservation_reason: this.data.list.reservation_reason,
        reservation_tools: this.data.list.reservation_tools,
        reservation_from: this.data.list.reservation_from,
        creat_time: TIME
      }
    }).then(res => {
      // 插入数据成功
      // console.log(res._id)
      this.creatInviteCode(res._id)
      this.userAddId(res._id)
      app.globalData.usermsg.user_status = "已预约"
    }).catch(err => {
      // 插入数据失败
      console.log(err)
    })
  },

  //设置轮播容器的高度
  setContainerHeight: function(e) {

    //图片的原始宽度
    var imgWidth = e.detail.width;

    //图片的原始高度
    var imgHeight = e.detail.height;

    //同步获取设备宽度
    var sysInfo = wx.getSystemInfoSync();
    console.log("sysInfo:", sysInfo);

    //获取屏幕的宽度
    var screenWidth = sysInfo.screenWidth;

    //获取屏幕和原图的比例
    var scale = screenWidth / imgWidth;

    //设置容器的高度
    this.setData({
      height: imgHeight * scale
    })
    console.log(this.data.height);
  },
  userAddId: function (id) {
    const db = wx.cloud.database();
    db.collection('user').doc(app.globalData.usermsg._id).update({
      data: {
        reservation_id: id, 
        user_status: app.globalData.STATUS_USER_HR,
      }
    }).then(res => {
      // console.log(res)
    })

  },

  creatInviteCode: function (id) {
    // console.log(id)
    const db = wx.cloud.database()
    var code = this.creatCode()
    while (!this.isuniqueCode(code)) {
      code = this.creatCode()
    }
    db.collection('invite').add({
      // 要插入的数据
      data: {
        invite_code: code,
        reservation_id: id,
      }
    }).then(res => {
      // 插入数据成功
      console.log(res)
    }).catch(err => {
      // 插入数据失败
      console.log(err)
    })
  },
  creatCode: function () {
    var arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    var code = ""
    for (var i = 0; i < 4; i++) {
      var pos = Math.round(Math.random() * (arr.length - 1));
      code += arr[pos];
    }
    return code
  },
  isuniqueCode: function (code) {
    var is = true;
    const db = wx.cloud.database()
    db.collection('invite').where({
      invite_code: code,
    }).get({
      success: res => {
        // console.log(res)
        if (res.data[0] === undefined) {
          // console.log("isNULL")
          is = true
        } else {
          // console.log(res.data[0])
          is = false
        }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
    return is
  },
})
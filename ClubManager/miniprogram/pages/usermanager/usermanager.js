// pages/user/user.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */

  data: {
    list: [],
    nouser:true,
    isShowConfirm: false,
    userno:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.checkEndDate()
    this.getBlacklist()
  },

  touchstart: function (e) {
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY
    })
  },

  touchmove: function (e) {
    let index = e.currentTarget.dataset.index,//当前索引
      startX = this.data.startX,//开始X坐标
      startY = this.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = this.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    this.data.list.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    // //更新数据
    this.setData({
      list: this.data.list
    })
  },

  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI)
  },

  del: function (e) {
    wx.showModal({
      title: '提示',
      content: '确定将其移除黑名单吗？',
      success: (res) => {
        if (res.confirm) {
          let listItem = this.data.list[e.currentTarget.dataset.index]
          console.log(listItem)
          this.setUserstatus(listItem.sno, app.globalData.STATUS_USER_CR)
          this.removeBlackMsg(listItem._id)
          this.data.list.splice(e.currentTarget.dataset.index, 1)
          this.setData({
            list: this.data.list
          })
          if (this.data.list.length === 0) {
            this.setData({
              nouser: true
            })
          } else {
            this.setData({
              nouser: false
            })
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  add: function () {
    var startTime = new Date()
    var timestamp = Date.parse(startTime);
    timestamp = timestamp / 1000 + 24 * 60 * 60 * 7;
    var endTime = new Date(this.toDate(timestamp))

    wx.cloud.callFunction({
      name: 'addDatabase',
      data: {
        name: 'blackroom',
        data: {
          blackroom_startdate: startTime,
          blackroom_finishdate: endTime,
          user_no: this.data.userno
        },
      },
      complete: res => {
        console.log("操作成功")
        this.getBlacklist()
      },
    })

    this.setUserstatus(this.data.userno, app.globalData.STATUS_USER_BL)
    this.setData({
      isShowConfirm: false
    })
  },

  getBlacklist:function (){
    const db = wx.cloud.database()
    db.collection('blackroom').get({
      success: res => {
        // console.log('[数据库] [查询记录] 成功: ', res.data[0])
        var data = res.data
        this.data.list = []
        for (var i = 0; i < data.length; i++) {
          this.getUserMsg(data[i].user_no,data[i]._id)
        }
        if (data.length===0){
          this.setData({
            nouser:true
          })
        }else{
          this.setData({
            nouser: false
          })
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
  },

  getUserMsg: function (userno,_id) {
    const db = wx.cloud.database()
    var list = this.data.list
    db.collection('user').where({
      user_no: userno
    }).get({
      success: res => {
        var data = res.data[0]
        var jstr = {}
        jstr.sno = data.user_no
        jstr.name = data.user_name
        jstr.tel = data.user_phone
        jstr.isTouchMove = false
        jstr._id = _id
        list.push(jstr)
        this.setData({
          list: list,
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

  checkEndDate: function () {
    const db = wx.cloud.database()
    const _ = db.command
    var currentTime = new Date();
    console.log(currentTime)
    db.collection('blackroom').where({
      blackroom_finishdate: _.lte(currentTime),
    }).get({
      success: res => {
        var i = 0;
        for(i = 0;i < data.length ; i++){
          this.setUserstatus(res.data[i].user_no, app.globalData.STATUS_USER_CR)
          this.removeBlackMsg(res.data[i]._id)
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
  },

  removeBlackMsg: function (id) {
    wx.cloud.callFunction({
      name: 'removeDatabase',
      data: {
        name: 'blackroom',
        id: id,
      },
      complete: res => {
        console.log(id,res)
        console.log("removeBlackroomMsg操作成功")
      },
    })
  },

  setUserstatus: function (no,status) {
    const db = wx.cloud.database()
    db.collection('user').where({
      user_no : no
    }).get({
      success: res => {
        this.updateStatus(res.data[0]._id,status)
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

  updateStatus: function (userid,status) {
    wx.cloud.callFunction({
      name: 'modifyDatabase',
      data: {
        name: 'user',
        id: userid,
        data: {
          user_status: status,
        },
      },

      complete: res => {
        console.log(userid)
        console.log("操作成功")
      },
    })
  },

  toDate: function (number) {
    var n = number;
    var date = new Date(parseInt(n) * 1000);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
  },
  showConfirm:function(){
    this.setData({
      isShowConfirm:true
    })
  },
  cancel:function(){
    this.setData({
      isShowConfirm: false
    })
  },
  setValue:function(e){
    this.setData({
      userno: e.detail.value,
    })
  }
})
// pages/admin/admin.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    welcome: "管理员，你好！",
    ActivityList: [],
    noenreser:true,
    venuename: "",
    venuetime: "",
    rsid: "",
    rsstatus: "",
    venue_id: "",
    rsdate: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title:"慢吞吞地加载中",
      mask:true,
    })
    this.setReservation()
  },

  onReady: function () {
    wx.hideLoading()
  },
  
  button1: function () {
    this.onLoad()
    this.onReady()
  },

  button2: function () {
    wx.redirectTo({
      url: '../adminclub/adminclub'
    })
  },

  button3: function () {
    wx.redirectTo({
      url: '../usermanager/usermanager'
    })
  },

  check: function (event) {

    var i = event.currentTarget.dataset.index
    // console.log("sadasd" + i)
    wx.navigateTo({
      url: '../check/check?reser_id=' + this.data.ActivityList[i].reserid + "&venue_id=" + this.data.ActivityList[i].venueid
    })

  },

  setReservation: function () {
    const db = wx.cloud.database()
    const _ = db.command
    // console.log(this.data.userno)
    db.collection('reservation').where({
      reservation_status: _.or(_.eq(app.globalData.STATUS_RESER_OK), _.eq(app.globalData.STATUS_RESER_WA)),
    }).get({
      success: res => {
        // console.log('[数据库] [查询记录] 成功: ', res.data[0])
        var data = res.data
        console.log(data)
        var list = []
        for (var i = 0; i < data.length; i++) {
          var jstr = {}
          jstr.reserid = data[i]._id
          jstr.reserdate = data[i].reservation_date
          jstr.status = data[i].reservation_status
          jstr.venueid = data[i].venue_id
          jstr.venuename = ""
          jstr.venuetime = ""
          list.push(jstr)
          this.setData({
            ActivityList: list,
          })
          // console.log("num:"+i+"   "+this.data.ActivityList)
          this.setVenue(i, data[i].venue_id)

        }
      },
    })
  },
  setVenue: function (i, id) {
    const db = wx.cloud.database()
    // console.log(id)
    db.collection('venue').where({
      _id: id,
    }).get({
      success: res => {
        console.log('[数据库] [查询记录] 成功: ', res.data[0])
        var data = res.data[0]
        var list = this.data.ActivityList
        list[i].venuename = data.venue_name + " " + data.venue_time
        list[i].venuetime = data.venue_time
        this.setData({
          ActivityList: list,
        })
        console.log(this.data.ActivityList)

        if (this.data.ActivityList.length > 0) {
          this.setData({
            noenreser: false,
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
})
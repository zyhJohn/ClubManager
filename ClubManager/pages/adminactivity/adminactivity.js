// pages/admin/admin.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    welcome: "管理员，你好！",
    ActivityList: [],
    lisnone:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title:"慢吞吞地加载中",
      mask:true,
    })
  },

  onReady: function () {
    wx.hideLoading()
  },

  onShow: function(){
    this.setData({
      ActivityList: [],
    })
    this.setActivityList()
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
      url: '../adminactivitycheck/adminactivitycheck?activity_id=' + this.data.ActivityList[i].activityid
    })

  },

  setActivityList: function(){
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('activity').where({
      activity_status: _.eq(app.globalData.STATUS_ACTIVITY_WA),
    }).get({
      success: res => {
        // console.log('[数据库] [查询记录] 成功: ', res.data[0])
        var data = res.data
        var list = []
        for (var i = 0; i < data.length; i++) {
          var jstr = {}
          jstr.activityid = data[i]._id
          jstr.activityname = data[i].activity_name
          jstr.clubname = data[i].club_name
          jstr.clubid = data[i].club_no
          jstr.status = data[i].activity_status
          list.push(jstr)
          this.setData({
            ActivityList: list,
          })
        }

        if (this.data.ActivityList.length > 0) {
          this.setData({
            lisnone: false,
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
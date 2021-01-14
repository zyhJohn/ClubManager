// pages/admin/admin.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    welcome: "欢迎来到管理界面！",
    contactList: [],
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
    this.setActivityList()
  },

  onReady: function () {
    wx.hideLoading()
  },
  
  button1: function () {
    wx.navigateTo({
      url: '../activityapply/activityapply'
    })
  },

  button2: function () {
    wx.navigateBack({
      delta: 1,
    })
  },

  button3: function () {
    wx.redirectTo({
      url: '../clubmanager/clubmanager'
    })
  },

  button4: function () {
    this.onLoad
    this.onReady
  },

  detail: function (event) {
    var i = event.currentTarget.dataset.index
    // console.log("sadasd" + i)
    wx.navigateTo({
      url: '../detail/detail?activity_id=' + this.data.contactList[i].activityid
    })

  },

  setActivityList: function(){
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('activity').where({
      activity_status: _.or(_.eq(app.globalData.STATUS_ACTIVITY_WA), _.eq(app.globalData.STATUS_ACTIVITY_OK), _.eq(app.globalData.STATUS_ACTIVITY_FN)),
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
            contactList: list,
          })
        }

        if (this.data.contactList.length > 0) {
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
// pages/admin/admin.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    welcome: "欢迎来到管理界面！",
    club_id:"",
    ClubcheckList: [],
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
    this.setData({
      club_id:options.club_id,
    })
    this.setClubchecklist()
  },

  onReady: function () {
    wx.hideLoading()
  },

  clubcheckdetail: function (event) {
    var i = event.currentTarget.dataset.index
    // console.log("sadasd" + i)
    wx.navigateTo({
      url: '../clubcheckdetail/clubcheckdetail?clubcheck_id=' + this.data.ClubcheckList[i].clubcheckid
    })

  },
  
  setClubchecklist: function () {
    const db = wx.cloud.database()
    const _ = db.command
    // console.log(this.data.userno)
    db.collection('clubcheck').where({
      club_id: this.data.club_id,
      apply_status: _.eq(app.globalData.STATUS_CLUB_USER_WA),
    }).get({
      success: res => {
        // console.log('[数据库] [查询记录] 成功: ', res.data[0])
        var data = res.data
        var list = []
        for (var i = 0; i < data.length; i++) {
          var jstr = {}
          jstr.clubcheckid = data[i]._id
          jstr.clubname = data[i].club_name
          jstr.username = data[i].user_name
          jstr.userno = data[i].user_no
          jstr.status = data[i].apply_status
          list.push(jstr)
          this.setData({
            ClubcheckList: list,
          })
        }

        if (this.data.ClubcheckList.length > 0) {
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
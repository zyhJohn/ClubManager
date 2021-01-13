// pages/admin/admin.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    welcome: "管理员，你好！",
    ClubList: [],
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
      ClubList: [],
    })
    this.setNOClublist()
    this.setWAClublist()
  },
  
  button1: function () {
    wx.redirectTo({
      url: '../adminactivity/adminactivity'
    })
  },

  button2: function () {

    this.onLoad()
    this.onReady()
    this.onShow()
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
      url: '../adminclubcheck/adminclubcheck?club_id=' + this.data.ClubList[i].clubid+'&club_status='+this.data.ClubList[i].status
    })

  },
  setWAClublist: function () {
    const db = wx.cloud.database()
    const _ = db.command
    // console.log(this.data.userno)
    db.collection('club').where({
      club_status: _.eq(app.globalData.STATUS_CLUB_WA),
    }).get({
      success: res => {
        // console.log('[数据库] [查询记录] 成功: ', res.data[0])
        var data = res.data
        var list = this.data.ClubList
        for (var i = 0; i < data.length; i++) {
          var num = parseInt(data[i].num_member)
          if(num >= 5){
            var jstr = {}
            jstr.clubid = data[i]._id
            jstr.clubname = data[i].club_name
            jstr.clubtype = data[i].club_type
            jstr.status = data[i].club_status
            list.push(jstr)
          }
          this.setData({
            ClubList: list,
          })
        }

        if (this.data.ClubList.length > 0) {
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
  setNOClublist: function () {
    const db = wx.cloud.database()
    const _ = db.command
    // console.log(this.data.userno)
    db.collection('club').where({
      club_status:  _.eq(app.globalData.STATUS_CLUB_NO),
    }).get({
      success: res => {
        // console.log('[数据库] [查询记录] 成功: ', res.data[0])
        var data = res.data
        var list = this.data.ClubList
        for (var i = 0; i < data.length; i++) {
          var jstr = {}
          jstr.clubid = data[i]._id
          jstr.clubname = data[i].club_name
          jstr.clubtype = data[i].club_type
          jstr.status = data[i].club_status
          list.push(jstr)
          this.setData({
            ClubList: list,
          })
        }

        if (this.data.ClubList.length > 0) {
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
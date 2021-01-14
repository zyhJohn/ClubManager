// pages/home/home.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: "",
    userstatus: "",
    userno: "",

    searchkey: "",
    isadmin:false,

    clubid: "",
    clubname: "",
    status: "",
    ActivityList:[],
    lisnone:true,
    url1: "cloud://project-a37od.7072-project-a37od-1300720385/icon/home.png",
    url2: "cloud://project-a37od.7072-project-a37od-1300720385/icon/group.png",
    url3: "cloud://project-a37od.7072-project-a37od-1300720385/icon/manager.png",
    url4: "cloud://project-a37od.7072-project-a37od-1300720385/icon/user.png"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title:"慢吞吞地加载中",
      mask:true,
    })
    // this.init()
    this.getUsermsg();

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideLoading()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getUsermsg();

  },

  activity: function (event) {
    // console.log(event)
    var i = event.currentTarget.dataset.index
    wx.navigateTo({
      url: '../activitydetail/activitydetail?activity_id=' + this.data.ActivityList[i].activityid
    })
  },

  button1: function () {
    // wx.navigateTo({
    //   url: '../home/home'
    // })
    this.onLoad()
    this.onReady()
  },

  button2: function () {
    if (app.globalData.hasuser  ){
      wx.redirectTo({
        url: '../club/club'
      })
    } else {
      wx.showToast({
        title: '请先完善个人信息',
        icon: 'none',
        duration: 2000
      })
    }

  },

  button3: function () {
    if (app.globalData.hasuser) {
      wx.navigateTo({
        url: '../clubmanager/clubmanager'
      })
    } else {
      wx.showToast({
        title: '请先完善个人信息',
        icon: 'none',
        duration: 2000
      })
    }
  },

  button4: function () {
    wx.navigateTo({
      url: '../user/user'
    })
  },

  search:function(){
    var str = ""+this.data.searchkey
    if(str === ""&&this.data.isadmin){
      wx.navigateTo({
        url: '../admincheck/admincheck'
      })
    }
    //wx.navigateTo({
    //  url: '../invite/invite?search_key='+this.data.searchkey,
    //})
  },

  getUsermsg: function () {
    const db = wx.cloud.database()
    db.collection('user').where({
      _openid: app.globalData.openid,
    }).get({
      success: res => {
        var data = res.data[0]
        console.log('[数据库] [查询记录] 成功: ', res.data[0])
        app.globalData.usermsg = data
        this.setData({
          username: data.user_name,
          userstatus: data.user_status,
          userno: data.user_no,
          isadmin: data.is_admin
        })
        console.log(this.data.userstatus)
        app.globalData.hasuser = true
        this.setActivityList()
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

  getSearchkey: function (e) {
    this.setData({
      searchkey: e.detail.value,
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
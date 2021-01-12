// pages/home/home.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: "请去“我的”完善个人信息",
    userstatus: app.globalData.STATUS_USER_TR,
    userno: "2333",

    searchkey: "",

    rsid: "",
    rsstatus: "",
    rsdate: null,
    venuename: "",
    venuetime: "",
    venue_id: "",
    nowList: [],
    historyList:[],
    nownoen:true,
    hisnone:true,
    url1:"cloud://yuntest1-xt878.7975-yuntest1-xt878-1300763170/picture/ihome.png",
    url2: "cloud://yuntest1-xt878.7975-yuntest1-xt878-1300763170/picture/adduser.png",
    url3: "cloud://yuntest1-xt878.7975-yuntest1-xt878-1300763170/picture/add.png",
    url4: "cloud://yuntest1-xt878.7975-yuntest1-xt878-1300763170/picture/user.png"
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

  appoint: function () {
    wx.navigateTo({
      url: '../detail/detail?reser_id=' + this.data.rsid + "&venue_id=" + this.data.venue_id
    })
  },

  appoint2: function (event) {
    // console.log(event)
    var i = event.currentTarget.dataset.index
    console.log("sadasd" + i)
    wx.navigateTo({
      url: '../detail/detail?reser_id=' + this.data.historyList[i].reserid + "&venue_id=" + this.data.historyList[i].venueid
    })
  },
  button1: function () {
    wx.redirectTo({
      url: '../home/home'
    })
  },

  button2: function () {
    this.onLoad()
    this.onReady()
  },

  button3: function () {
    wx.navigateTo({
      url: '../clubmanager/clubmanager'
    })
  },

  button4: function () {
    wx.navigateTo({
      url: '../user/user'
    })
  },

  search:function(){
    wx.navigateTo({
      url: '../invite/invite?search_key='+searchkey,
    })
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
          userno: data.user_no
        })
        console.log(this.data.userstatus)
        app.globalData.hasuser = true
        this.getNowReservation();
        this.setHistoryReservation();
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

  getNowReservation: function () {
    const db = wx.cloud.database()
    const _ = db.command
    // console.log(this.data.userno)
    db.collection('reservation').where({
      _id: app.globalData.usermsg.reservation_id,
      reservation_status: _.or(_.eq(app.globalData.STATUS_RESER_WA), _.eq(app.globalData.STATUS_RESER_WP), _.eq(app.globalData.STATUS_RESER_OK)),
    }).get({
      success: res => {
        // console.log('[数据库] [查询记录] 成功: ', res.data[0])
        var data = res.data[0]
        if(data===undefined){
          this.setData({
            venuename: "",
            venuetime: "",
            rsid: "",
            rsstatus: "",
            venue_id: "",
            rsdate: "",
            nowList:[],
            nownoen:true,
          })
        }else{
          this.setData({
            rsid: data._id,
            rsstatus: data.reservation_status,
            venue_id: data.venue_id,
            rsdate: data.reservation_date,
          })
          var id = data.venue_id
          this.getVenueName(id)
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
  getVenueName: function (id) {
    // console.log("asdasda",id)
    const db = wx.cloud.database()
    db.collection('venue').where({
      _id: id,
    }).get({
      success: res => {
        // console.log('[数据库] [查询记录] 成功: ', res.data[0])
        var data = res.data[0]
        this.setData({
          venuename: data.venue_name,
          venuetime: data.venue_time,
        })
        this.setNowReservation();

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
  setNowReservation: function () {
    var jstr = {}
    jstr.name = this.data.venuename + " " + this.data.venuetime
    jstr.date = this.data.rsdate
    jstr.status = this.data.rsstatus
    this.setData({
      nowList: [jstr],
    })
    if(this.data.nowList.length>0){
        this.setData({
            nownoen:false,
        })
    }
  },
  setHistoryReservation: function () {
    const db = wx.cloud.database()
    const _ = db.command
    // console.log(this.data.userno)
    db.collection('reservation').where({
      user_no: this.data.userno,
      reservation_status: _.or(_.eq(app.globalData.STATUS_RESER_FN), _.eq(app.globalData.STATUS_RESER_FD)),
    }).get({
      success: res => {
        // console.log('[数据库] [查询记录] 成功: ', res.data[0])
        var data = res.data
        // console.log(data)
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
            historyList: list,
          })
          // console.log(this.data.historyList)
          this.setHistoryVenue(i, data[i].venue_id)

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
  setHistoryVenue: function (i, id) {
    const db = wx.cloud.database()
    db.collection('venue').where({
      _id: id,
    }).get({
      success: res => {
        // console.log('[数据库] [查询记录] 成功: ', res.data[0])
        var data = res.data[0]
        var list = this.data.historyList
        list[i].venuename = data.venue_name + " " + data.venue_time
        list[i].venuetime = data.venue_time
        this.setData({
          historyList: list,
        })
        // console.log(this.data.historyList)

        if (this.data.historyList.length > 0) {
          this.setData({
            hisnone: false,
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
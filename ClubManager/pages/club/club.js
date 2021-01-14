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
    isadmin:false,

    clubid: "",
    clubname: "",
    clubtype: "",
    status: "",
    ClubList:[],
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

  club: function (event) {
    // console.log(event)
    var i = event.currentTarget.dataset.index
    wx.navigateTo({
      url: '../clubdetail/clubdetail?club_id=' + this.data.ClubList[i].clubid + '&hasIn=' + this.data.ClubList[i].hasIn
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
    var str = ""+this.data.searchkey
    if(str === ""&&this.data.isadmin){
      wx.navigateTo({
        url: '../admincheckToC/admincheckToC'
      })
    }
    //wx.navigateTo({
    //  url: '../invite/invite?search_key='+this.data.searchkey,
    //})
  },

  getUsermsg: function () {
    this.setData({
      username: app.globalData.usermsg.user_name,
      userstatus: app.globalData.usermsg.user_status,
      userno: app.globalData.usermsg.user_no,
      isadmin: app.globalData.usermsg.is_admin
    })
    this.setClubList()
  },

  getSearchkey: function (e) {
    this.setData({
      searchkey: e.detail.value,
    })
  },

  setClubList: function(){
    this.setMemberClubList()
    this.setLeaderClublist()
  },

  setMemberClubList: function () {
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('club').where({
      user_no: _.neq(app.globalData.usermsg.user_no),
      club_status: _.or(_.eq(app.globalData.STATUS_CLUB_WA), _.eq(app.globalData.STATUS_CLUB_OK)),
    }).get({
      success: res => {
        // console.log('[数据库] [查询记录] 成功: ', res.data[0])
        var data = res.data
        console.log(data)
        var list = this.data.ClubList
        for (var i = 0; i < data.length; i++) {
          var flag = 1
          var member =data[i].club_member
          var memberlist = member.split(",")
          for(var j = 0; j < memberlist.length; j++){
            console.log( memberlist[j]=== app.globalData.usermsg.user_no)
            if( memberlist[j]=== app.globalData.usermsg.user_no ){
              flag=1
              break
            }else{
              flag=0
            }
          }
          var jstr = {}
          jstr.clubid = data[i]._id
          jstr.clubname = data[i].club_name
          jstr.clubtype = data[i].club_type
          jstr.status = data[i].club_status
          jstr.hasIn = flag,
          list.push(jstr)
          console.log(jstr)
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
  setLeaderClublist: function () {
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('club').where({
      user_no: app.globalData.usermsg.user_no,
      club_status: _.or(_.eq(app.globalData.STATUS_CLUB_WA), _.eq(app.globalData.STATUS_CLUB_OK), _.eq(app.globalData.STATUS_CLUB_NO)),
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
          jstr.hasIn = 1,
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
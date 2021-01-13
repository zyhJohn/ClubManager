// pages/admin/admin.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    welcome: "欢迎来到管理界面！",
    ClubList: [],
    lisnone:true,
    hasIn:1,

    username: "",
    userstatus: "",
    userno:"",

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title:"慢吞吞地加载中",
      mask:true,
    })
    this.setClublist()
  },

  onReady: function () {
    wx.hideLoading()
  },
  
  button1: function () {
    wx.navigateTo({
      url: '../clubapply/clubapply'
    })
  },

  button2: function () {
    wx.navigateBack({
      delta: 1,
    })
  },

  button3: function () {
    this.onLoad
    this.onReady
  },

  button4: function () {
    wx.redirectTo({
      url: '../activitymanager/activitymanager'
    })
  },

  clubdetail: function (event) {
    var i = event.currentTarget.dataset.index
    // console.log("sadasd" + i)
    wx.navigateTo({
      url: '../clubdetail/clubdetail?club_id=' + this.data.ClubList[i].clubid  + '&hasIn='+ this.data.hasIn
    })

  },

  setClublist: function () {
    this.setLeaderClublist()
    this.setMemberClublist()
  },
  
  setMemberClublist: function () {
    const db = wx.cloud.database()
    const _ = db.command
    // console.log(this.data.userno)
    db.collection('club').where({
      club_status: _.or(_.eq(app.globalData.STATUS_CLUB_WA), _.eq(app.globalData.STATUS_CLUB_OK), _.eq(app.globalData.STATUS_CLUB_NO)),
    }).get({
      success: res => {
        // console.log('[数据库] [查询记录] 成功: ', res.data[0])
        var data = res.data
        var list = this.data.ClubList
        for (var i = 0; i < data.length; i++) {
          var member =data[i].club_member
          var memberlist = member.split(",")
          for(var j = 0; j < memberlist.length; j++){
            if( memberlist[j]=== app.globalData.usermsg.user_no ){
              console.log(memberlist[j]=== app.globalData.usermsg.user_no)
              var jstr = {}
              jstr.clubid = data[i]._id
              jstr.clubname = data[i].club_name
              jstr.clubtype = data[i].club_type
              jstr.status = data[i].club_status
              list.push(jstr)
              console.log(jstr)
              this.setData({
                ClubList: list,
              })
              break
            }else{
            }
          }
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
    // console.log(this.data.userno)
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
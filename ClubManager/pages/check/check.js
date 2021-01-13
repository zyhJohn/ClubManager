// pages/detail/detail.

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // reservationid:"",
    code:"",

    //页面传参
    reser_id:"699679fa5de45233011827ac5f4b6efd",
    venue_id:"c3429d2d-4898-45c0-8b9c-22dc67f290f6",
    //预约信息
    venuename:"",
    reserstatus: "",
    venueaddr: "",
    veneutime: "",
    userno: "",
    userid: "",
    leadername: "",
    venuedes: "",
    reserdate: "",
    reserfrom: "",
    resermenbercount: "",
    reserphone: "",
    reserreason: "",
    tools: "",
    havetools: false,

    resermenbers:"",
    menberslist: [{
      name:"无"
    }],



  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.setData({
      reser_id:options.reser_id,
      venue_id:options.venue_id,
    })

    this.setresermsg()
    this.setvenuemsg()
    this.setInviteCode()
  },

  setvenuemsg:function(){
    const db = wx.cloud.database()
    db.collection('venue').where({
      _id: this.data.venue_id
    }).get({
      success: res => {
        // console.log('[数据库] [查询记录] 成功: ', res)
        var data = res.data[0]
        this.setData({
          venuename: data.venue_name,
          venueaddr: data.venue_addr,
          veneutime: data.venue_time,
          venuedes: data.venue_des,
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
  setmenbers:function(str){
    var s = str.split(",")
    var list = [];
    for(var i=0;i<s.length;i++){
      var jstr = {}
      jstr.no = s[i]
      jstr.name =""
      list.push(jstr)
    }

    const db = wx.cloud.database()
    var size = list.length
    for (var i = 0; i < list.length; i++){
      console.log(list[i].no)
      db.collection('user').where({
        user_no: list[i].no,
      }).get({
        success: res => {
          console.log('[数据库] [查询记录] 成功: ', res.data[0])
          // console.log(i-(size--))//伪传入i
          list[i - (size--)].name = res.data[0].user_name
          // console.log(list)
          this.setData({
            menberslist: list,
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
    }
  },
  setInviteCode:function(){
    const db = wx.cloud.database()
    db.collection('invite').where({
      reservation_id: this.data.reser_id,
    }).get({
      success: res => {
        // console.log('[数据库] [查询记录] 成功: ', res.data[0].msg)
        this.setData({
          code: res.data[0].invite_code
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
  setresermsg:function(){
    const db = wx.cloud.database()
    db.collection('reservation').where({
      _id: this.data.reser_id,
    }).get({
      success: res => {
        // console.log('[数据库] [查询记录] 成功: ', res.data[0].msg)
        this.setData({
          reserstatus: res.data[0].reservation_status,
          reserdate: res.data[0].reservation_date,
          reserfrom: res.data[0].reservation_from,
          resermenbercount: res.data[0].reservation_menbercount,
          reserphone: res.data[0].reservation_phone,
          reserreason: res.data[0].reservation_reason,
          tools: res.data[0].reservation_tools,
          havetools: res.data[0].reservation_usetools,
          userno: res.data[0].user_no,
        })
        this.getLeader()
        this.setmenbers(res.data[0].reservation_menber)
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
  getLeader:function(){
    const db = wx.cloud.database()
    db.collection('user').where({
      user_no: this.data.userno
    }).get({
      success: res => {
        // console.log(res.data[0])
        this.setData({
          leadername: res.data[0].user_name,
        })
      }
    })
  },

  checkout:function(){
    wx.showModal({
      title: '提示',
      content: '是否确定通过审核',
      icon: 'none',
      duration: 3000,
      success: res => {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.cloud.callFunction({
            name: 'modifyDatabase',
            data: {
              name: 'reservation',
              id: this.data.reser_id,
              data: {
                reservation_status: app.globalData.STATUS_RESER_OK,
              },
            },
            complete: res => {
              wx.navigateBack({
                delta: 1,
              })
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  refuseCheck:function(){
    wx.showModal({
      title: '提示',
      content: '是否确定拒绝预约',
      icon: 'none',
      duration: 3000,
      success: res => {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.cloud.callFunction({
            name: 'modifyDatabase',
            data: {
              name: 'reservation',
              id: this.data.reser_id,
              data: {
                reservation_status: app.globalData.STATUS_RESER_NO,
              },
            },
            complete: res => {
              this.getMemberid()
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  getMemberid:function(){
    var i = 0;
    const db = wx.cloud.database()
    for(i=0;i<this.data.menberslist.length;i++){
      db.collection('user').where({
        user_no: this.data.menberslist[i].no
      }).get({
        success: res => {
          // console.log(res.data[0])
          this.modifyUserStatus(res.data[0]._id)
        }
      })
    }
  },
  
  modifyUserStatus:function(n){
    wx.cloud.callFunction({
      name: 'modifyDatabase',
      data: {
        name: 'user',
        id: n,
        data: {
          user_status: app.globalData.STATUS_USER_CR,
        },
      },
      complete: res => {
        
      },
    })
  }
})
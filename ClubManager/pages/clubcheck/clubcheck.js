// pages/table/table.js\
const app = getApp()
Page({

  data: {
    name: "",
    no: "",
    phone: "",

    club_id:"",
    club_name:"",
    reason:"",
    status:app.globalData.STATUS_CLUB_USER_WA,

    ps:"",

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      club_id:options.club_id,  
    })
    this.getUsermsg()
    this.getClubmsg()
  },

  /**
   * 获取input值
   */
  getReasonInput: function(e) {
    this.setData({
      reason: e.detail.value,
    })
  },

  getPsInput: function(e) {
    this.setData({
      ps: e.detail.value,
    })
  },

  getUsermsg: function(){
    this.setData({
      name: app.globalData.usermsg.user_name,
      no: app.globalData.usermsg.user_no,
      phone: app.globalData.usermsg.user_phone,
    })
  },
  getClubmsg: function(){
    const db = wx.cloud.database()
    db.collection('club').where({
      _id: this.data.club_id
    }).get({
      success: res => {
        // console.log('[数据库] [查询记录] 成功: ', res)
        var data = res.data[0]
        this.setData({
          club_name: data.club_name,
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

  formSubmit: function(e) {
    if (this.data.club_reason === ""){
      wx.showToast({
        title: '请填写申请加入理由',
        icon: 'none',
        duration: 2000
      });
    }else{
      wx.showModal({
        title: '提示',
        content: '提交后将有社长在七个工作日内进行审核，请耐心等候。',
        icon: 'none',
        duration: 3000,
        success: res => {
          if (res.confirm) {
            console.log('用户点击确定')
            this.putClubMsg()
            wx.navigateBack({
              delta: 2,
            });
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
    
  },

  formReset: function() {
    console.log('form发生了reset事件'),
      wx.navigateBack({
        delta: 1,
      })
  },

  putClubMsg: function () {
    const db = wx.cloud.database()
    db.collection('clubcheck').add({
      // 要插入的数据
      data: {
        club_id: this.data.club_id,
        club_name: this.data.club_name,
        user_no: this.data.no,
        user_name: this.data.name,
        user_phone: this.data.phone,
        apply_reason: this.data.reason,
        apply_status: this.data.status,
        ps: this.data.ps,
      }
    }).then(res => {
      // 插入数据成功
      // console.log(res._id)
    }).catch(err => {
      // 插入数据失败
      console.log(err)
    })
  },
})
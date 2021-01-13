// pages/table/table.js\
const util = require('../../utils/util.js')
const app = getApp()
Page({

  data: {
    name: "",
    no: "",
    phone:"",

    club_id:"",
    club_name:"",
    club_introduce:"",
    club_status:app.globalData.STATUS_CLUB_NO,
    club_reason:"",
    ps:"",
    close_time:"",

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      club_id:options.club_id,  
    })
    this.getClubmsg()
  },

  /**
   * 获取input值
   */
  getReasonInput: function(e) {
    this.setData({
      club_reason: e.detail.value,
    })
  },

  getPsInput: function(e) {
    this.setData({
      ps: e.detail.value,
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
          name:data.user_name,
          no:data.user_no,
          phone:data.user_phone,
          club_name: data.club_name,
        })
        this.setmenbers(data.club_member)
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
        title: '请先完整填写信息哦~',
        icon: 'none',
        duration: 2000
      });
    }else{
      wx.showModal({
        title: '提示',
        content: '提交后社团将进入解散中状态。会有管理员在七个工作日内进行审核，请耐心等候。',
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
    var TIME = util.formatTime(new Date());
    const db = wx.cloud.database()
    db.collection('club').doc(this.data.club_id).update({
      // 要更新的数据
      data: {
        club_reason: this.data.club_reason,
        club_status: this.data.club_status,
        ps: this.data.ps,
        close_time: TIME
      }
    }).then(res => {
      // 更新数据成功
      // console.log(res._id)
    }).catch(err => {
      // 更新数据失败
      console.log(err)
    })
  },
})
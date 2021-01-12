// pages/table/table.js\
const util = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isread: false,

    user_name: "",
    user_no: "",
    list:{},

    club_name:"",
    club_type:"",
    club_introduce:"",
    creat_reason:"",
    creat_time:"",
    ps:"",

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (app.globalData.hasuser) {
      var msg = app.globalData.usermsg
      this.setData({
        user_name: msg.user_name,
        user_no: msg.user_no,
      })
    } else {
      wx.navigateBack({
        delta: 1,
      })
    }
  },

  onShow: function() {
    if (this.data.isread) {
      /*改变tubiao*/
      this.setData({
        url1: "cloud://yuntest1-xt878.7975-yuntest1-xt878-1300763170/picture/confirm.png"
      })
    }
  },

  /**
   * 获取input值
   */
  getNameInput: function(e) {
    this.setData({
      club_name: e.detail.value,
    })
  },
  getTypeInput: function(e) {
    this.setData({
      club_type: e.detail.value,
    })
  },
  getIntroduceInput:function(e){
    this.setData({
      club_introduce: e.detail.value,
    })
  },
  getReasonInput: function(e) {
    this.setData({
      creat_reason: e.detail.value,
    })
  },
  getPsInput: function(e) {
    this.setData({
      ps: e.detail.value,
    })
  },

  read: function() {
    wx.navigateTo({
      url: '../clubattention/clubattention'
    })
  },

  formSubmit: function(e) {
    if (this.data.club_name === "" || this.data.club_type === "" || this.data.creat_reason === "" || this.data.club_introduce === ""){
      wx.showToast({
        title: '请先完整填写信息哦~',
        icon: 'none',
        duration: 2000
      });
    }else if(this.data.isread){
      wx.showToast({
        title: '请先阅读《社团守则》，并且同意',
        icon: 'none',
        duration: 2000
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '提交后会有管理员在七个工作日内进行审核，请耐心等候',
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
    db.collection('club_apply').add({
      // 要插入的数据
      data: {
        user_no: app.globalData.usermsg.user_no,
        user_name: app.globalData.usermsg.user_name,
        club_type: this.data.club_type,
        club_introduce: this.data.club_introduce,
        club_name: this.data.club_name,
        creat_reason: this.data.creat_reason,
        ps: this.data.ps,
        creat_time: TIME
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
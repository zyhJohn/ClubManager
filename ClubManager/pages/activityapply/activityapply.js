// pages/table/table.js\
const util = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_name: "",
    user_no: "",
    club_name:"",
    club_no:"",
    activity_place:"",
    creat_time:"",
    activity_content:"",
    activity_name:"",
    ps:"",

    list:{},
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

  },

  /**
   * 获取input值
   */
  getClubNameInput: function(e) {
    this.setData({
      club_name: e.detail.value,
    })
    this.getClubNo()
  },
  getActivityNameInput: function(e) {
    this.setData({
      activity_name: e.detail.value,
    })
  },
  getActivityContentInput:function(e){
    this.setData({
      activity_content: e.detail.value,
    })
  },
  getActivityPlaceInput: function(e) {
    this.setData({
      activity_place: e.detail.value,
    })
  },
  getPsInput: function(e) {
    this.setData({
      ps: e.detail.value,
    })
  },

  getClubNo: function(){
    const db = wx.cloud.database()
    db.collection('club').where({
      club_name:this.data.club_name
    }).get({
      success: res => {
        this.setData({
          club_no: res.data[0]._id
        })
      }
    })
  },

  formSubmit: function(e) {
    if (this.data.club_name === "" || this.data.activity_name === "" || this.data.activity_content === "" || this.data.activity_place === ""){
      wx.showToast({
        title: '请先完整填写信息哦~',
        icon: 'none',
        duration: 2000
      });
    }else if (this.data.club_no === "" || this.data.club_no === "undefined"){
      wx.showToast({
        title: '社团名称填写有误，请确认是否存在该社团',
        icon: 'none',
        duration: 2000
      });
    }else{
      wx.showModal({
        title: '提示',
        content: '提交后会有管理员在七个工作日内进行审核，请耐心等候',
        icon: 'none',
        duration: 3000,
        success: res => {
          if (res.confirm) {
            console.log('用户点击确定')
            this.putactivityMsg()
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

  putactivityMsg: function () {
    var TIME = util.formatTime(new Date());
    const db = wx.cloud.database()
    db.collection('activity').add({
      // 要插入的数据
      data: {
        user_no: app.globalData.usermsg.user_no,
        user_name: app.globalData.usermsg.user_name,
        club_name: this.data.club_name,
        club_no: this.data.club_no,
        activity_place: this.data.activity_place,
        activity_content: this.data.activity_content,
        activity_name: this.data.activity_name,
        activity_status: app.globalData.STATUS_ACTIVITY_WA,
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
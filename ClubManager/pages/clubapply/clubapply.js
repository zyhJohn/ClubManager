// pages/table/table.js\
const util = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isread: false,

    shows: false,
    selectDatas: ['科技学术类', '文艺体育类', '理论学习类','公益服务类'], 
    indexs: 0,

    name: "",
    no: "",
    phone:"",

    club_name:"",
    club_type:"",
    club_introduce:"",
    club_status:app.globalData.STATUS_CLUB_WA,
    club_reason:"",
    club_member:"",
    ps:"",
    creat_time:"",
    close_time:"",
    nummember:"1",

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (app.globalData.hasuser) {
      this.getUsermsg();
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

  // 点击下拉显示框
  selectTaps() {
    this.setData({
      shows: !this.data.shows,
    });
  },
  // 点击下拉列表
  optionTaps(e) {
    let Indexs = e.currentTarget.dataset.index; //获取点击的下拉列表的下标
    console.log(Indexs)
    this.setData({
      indexs: Indexs,
      shows: !this.data.shows
    });
  },

  /**
   * 获取input值
   */
  getNameInput: function(e) {
    this.setData({
      club_name: e.detail.value,
    })
  },

  getIntroduceInput:function(e){
    this.setData({
      club_introduce: e.detail.value,
    })
  },

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

  read: function() {
    wx.navigateTo({
      url: '../clubattention/clubattention'
    })
  },

  getUsermsg: function () {
    this.setData({
      name: app.globalData.usermsg.user_name,
      no: app.globalData.usermsg.user_no,
      phone: app.globalData.usermsg.user_phone
    })
  },

  formSubmit: function(e) {
    if (this.data.club_name === "" || this.data.club_introduce === ""){
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
        content: '提交后社团将进入创建中状态。当社团成员大于等于5时，会有管理员在七个工作日内进行审核，请耐心等候。',
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
    db.collection('club').add({
      // 要插入的数据
      data: {
        user_no: this.data.no,
        user_name: this.data.name,
        user_phone: this.data.phone,
        club_type: this.data.selectDatas[this.data.indexs],
        club_reason: this.data.club_reason,
        club_status: this.data.club_status,
        club_member: this.data.club_member,
        club_introduce: this.data.club_introduce,
        club_name: this.data.club_name,
        num_member: this.data.nummember,
        ps: this.data.ps,
        creat_time: TIME,
        close_time: this.data.close_time
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
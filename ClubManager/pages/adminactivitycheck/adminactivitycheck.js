// pages/detail/detail.

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //页面传参
    activity_id:"21ded5cb5ffdcad804bf45676de73a0c",
    //社团信息
    clubname:"",
    activityname:"",
    activitycontent:"",
    activityplace:"",
    activitystatus:"",


    leaderno:"",
    leadername: "",
    leaderphone: "",

    ps:"",

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      activity_id:options.activity_id, 
    })
    this.setactivitymsg()
  },

  submit:function(){
    const db = wx.cloud.database()
    db.collection('activity').doc(this.data.activity_id).update({
      data:{
        activity_status: app.globalData.STATUS_ACTIVITY_OK,
      }
    }).then(res=>{
      console.log(res)
      wx.navigateBack({
        delta: 1,
      })
     })
  },

  setactivitymsg:function(){
    const db = wx.cloud.database()
    db.collection('activity').where({
      _id: this.data.activity_id
    }).get({
      success: res => {
        // console.log('[数据库] [查询记录] 成功: ', res)
        var data = res.data[0]
        this.setData({
          clubname: data.club_name,
          activityname: data.activity_name,
          activitycontent: data.activity_content,
          activityplace: data.activity_place,
          leaderno: data.user_no,
          leadername: data.user_name,
          ps: data.ps,
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

})
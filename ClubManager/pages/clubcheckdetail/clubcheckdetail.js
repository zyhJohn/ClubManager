// pages/detail/detail.

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //页面传参
    clubcheck_id:"21ded5cb5ffdcad804bf45676de73a0c",
    //申请信息
    clubid:"",
    clubname:"",
    userno:"",
    username: "",
    reason:"",
    member:"",
    num:1,

    ps:"",

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      clubcheck_id:options.clubcheck_id, 
    })

    this.setcheckmsg()
  },

  setcheckmsg:function(){
    const db = wx.cloud.database()
    db.collection('clubcheck').where({
      _id: this.data.clubcheck_id
    }).get({
      success: res => {
        // console.log('[数据库] [查询记录] 成功: ', res)
        var data = res.data[0]
        this.setData({
          reason: data.apply_reason,
          username: data.user_name,
          userno: data.user_no,
          clubid: data.club_id,
          clubname: data.club_name,
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

  setClub:function(){
    const db = wx.cloud.database()
    db.collection('club').where({
      _id: this.data.clubid
    }).get({
      success :res => { 
        this.setData({
          member: res.data[0].club_member,
          num: parseInt(res.data[0].num_member)+1
        })
        this.updateClub()
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

  updateClub:function(){
    const db = wx.cloud.database()
    db.collection('club').doc(this.data.clubid).update({
      data:{
        club_member: this.data.member,
        num_member: ""+this.data.num,
      }
    }).then(res=>{
      console.log(res)
     })
  },

  submit:function(){
    const db = wx.cloud.database()
    db.collection('clubcheck').doc(this.data.clubcheck_id).update({
      data:{
        apply_status: app.globalData.STATUS_CLUB_USER_OK,
      }
    }).then(res=>{
      this.setClub()
      wx.navigateBack({
        delta: 1,
      })
      console.log(res)
     })
  }
})
const app = getApp()
// pages/invite/invite.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code:"",
  },

  getInviteInput: function (e) {
    this.setData({
      code: e.detail.value,
    })
    // console.log(e.detail.value+":::"+this.data.code)
  },


  formSubmit: function (e) {
    this.isAdmin()
  },

  formReset: function () {
    console.log('form发生了reset事件'),
    wx.navigateBack({
      delta: 1,
    })
  },
  isAdmin:function(){
    var is =false
    var str = ""+this.data.code
    const db = wx.cloud.database()
    db.collection('admin').where({
      admin_code: str,
    }).get({
      success: res => {
        // console.log('[数据库] [查询记录] 成功: ', res)
        if (res.data[0] === undefined) {
          is = false
        }else{
          is = true
          console.log("hello admin")
          wx.redirectTo({
            url: '../adminactivity/adminactivity'
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
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
    if (app.globalData.usermsg.user_status === app.globalData.STATUS_USER_CR){
      this.addReservation()
    } else if (app.globalData.usermsg.user_status === app.globalData.STATUS_USER_HR){
      if (app.globalData.usermsg.reservation_id === "") {
        wx.showToast({
          title: '(๑•́ ₃ •̀๑)亲亲，等下周再来叭~',
          icon: 'none',
          duration: 3000
        })
      } else {
        wx.showToast({
          title: '(˘•ω•˘)不要贪心哦~你已经加入过一场预约了呢~',
          icon: 'none',
          duration: 3000
        })
      }

    } else if (app.globalData.usermsg.user_status === app.globalData.STATUS_USER_BL) {
      wx.showToast({
        title: '￣へ￣哼哼，让你不遵守规则，在小黑屋好好反省吧！',
        icon: 'none',
        duration: 3000
      })
    }

    //一下方法为加入预约功能，预约表添加成员，成员表添加预约id

    // // console.log('form发生了submit事件，携带数据为：', e.detail.value),
    // wx.navigateBack({
    //   delta: 1,
    // })
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
    if (str.substr(0,4)==="adad"){
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
            wx.navigateTo({
              url: '../resermanager/resermanager'
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
    }
    return is
  },
  addReservation:function(){
    const db = wx.cloud.database()
    console.log(this.data.code)
    db.collection('invite').where({
      invite_code: this.data.code,
    }).get({
      success: res => {
          // console.log('[数据库] [查询记录] 成功: ', res)
          if (res.data[0] === undefined) {
            wx.showToast({
              title: '无效邀请码',
              icon: 'none',
              duration: 1000
            })
          } else {
            //弹出预约信息实现，形式不限
            console.log(res.data[0].reservation_id)
            var reserid = res.data[0].reservation_id
            wx.showModal({
              title: '前方高能',
              content: '罒ω罒嘿嘿嘿~确定加入这场神秘的活动咩？',
              success: res => {
                if (res.confirm) {
                  console.log('用户点击确定')
                  wx.showToast({
                    title: '欢迎新同志！快去主界面康康叭~',
                    icon: 'none',
                    duration: 2000
                  })
                  //确认后预约表添加成员信息
                  this.addmenber(reserid)
                  this.addreserId(reserid)
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
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
  addmenber: function (id) {
    const db = wx.cloud.database();
    var menbers =""
    db.collection('reservation').where({
      _id: id,
    }).get({
      success: res => {
        menbers = res.data[0].reservation_menber
        var user_no = res.data[0].user_no
        // console.log("``````" + "menbers:"+menbers)
        
        if (user_no !== app.globalData.usermsg.user_no){
          var newmenbers = (menbers === "") ? app.globalData.usermsg.user_no : (menbers + "," + app.globalData.usermsg.user_no)
          this.updateMenbers(id, newmenbers)
        }else{
          wx.showToast({
            title: '咳咳咳，自己的活动不用再加入哦~',
            icon: 'none',
            duration: 3000
          })
        }

      }
    })

  },
  updateMenbers: function (id, newmenbers){
    // console.log("````" + newmenbers + "id:" + id)
    wx.cloud.callFunction({
      name: 'modifyDatabase',
      data:{
        name:'reservation',
        id: id,
        data:{
          reservation_menber:newmenbers,
        },
      },
      complete: res => {
        console.log(res)
      },
    })
  },
  addreserId:function(id){
    console.log(id)
    const db = wx.cloud.database();
    db.collection('user').doc(app.globalData.usermsg._id).update({
      data:{
        reservation_id: id,
        user_status: app.globalData.STATUS_USER_HR,
      }
    }),

    app.globalData.usermsg.reservation_id = id
  },
})
// pages/detail/detail.

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isleader:false,
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
    leadername: "",
    venuedes: "",
    reserdate: "",
    reserfrom: "",
    resermenbercount: "",
    reserphone: "",
    reserreason: "",
    tools: "",
    havetools: false,
    finish:false,
    resermenbers:"",
    menberindex:0,
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
    this.setData({
      isleader: this.isLeader(),
    })
    this.setresermsg()
    this.setvenuemsg()
    this.setInviteCode()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },



  exit: function () {
    this.quitReservation()
  },
  close:function(){
    this.closeReservation()
  },
  isLeader:function(){
    const db = wx.cloud.database()
    db.collection('reservation').where({
      _id: this.data.reser_id
    }).get({
      success: res => {
        // console.log('[数据库] [查询记录] 成功: ', res)
        this.setData({
          isleader: res.data[0].user_no == app.globalData.usermsg.user_no ? true : false,
        })
        if (this.data.isleader) {
          this.setData({
            leadername: app.globalData.usermsg.user_name,
          })
        } else {
          db.collection('user').where({
            user_no: res.data[0].user_no
          }).get({
            success: res => {
              this.setData({
                leadername: res.data[0].user_name,
              })
            }
          })
        }
        if (res.data[0].reservation_status === app.globalData.STATUS_RESER_FN || res.data[0].reservation_status === app.globalData.STATUS_RESER_FD) {
          this.setData({
            finish: true,
            isleader:false,
          })
        } else{
          this.setData({
            finish: false,
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

        })
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
  //踢出成员
  removeMenber:function(e){
    var that = this
    if (this.data.menberslist[0].no === undefined){
      wx.showToast({
        icon: 'none',
        title: '|´Д｀|嗝，没有成员有啥好踢的……',
        duration:2000
      })
    }else{
      // console.log(this.data.menberslist)
      wx.showActionSheet({
        itemList: this.getMenbersListName(),
        success: res => {

          this.updateReservation(this.data.menberslist[res.tapIndex].no)
          this.updateMenberStatus(this.data.menberslist[res.tapIndex].no)
          wx.showToast({
            icon:"none",
            title: '抛弃队友中……',
            mask:true,
            duration: 2000
          })
          this.setresermsg()
          console.log(res.tapIndex)
        },
        fail: function (res) {
          console.log(res.errMsg)
        }
      })
    }
  },
  getMenbersListName:function(){
    var l = this.data.menberslist.length
    var list = []
    for (var i = 0; i < l; i++){
      list.push(this.data.menberslist[i].name)
    }
    console.log(list)
    return list
  },
  //退出预约功能
  quitReservation:function(){
    wx.showModal({
      title: '亲亲',
      content: '真滴要退出这个紧张刺激的毕至居活动咩？',
      success: res => {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.showToast({
            title: '同志，有缘再见！',
            icon: 'none',
            duration: 2000
          })
          this.updateReservation(app.globalData.usermsg.user_no)
          this.updateMenberStatus(app.globalData.usermsg.user_no)
          wx.navigateBack({
            delta: 1,
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //取消预约功能
  closeReservation:function(){
    wx.showModal({
      title: '亲亲',
      content: '真滴要关闭这个紧张刺激的毕至居活动咩？',
      success: res => {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.showToast({
            title: '同志，下次再来！',
            icon: 'none',
            duration: 2000
          })
          const db = wx.cloud.database()
          db.collection('reservation').where({
            _id: this.data.reser_id,
          }).get({
            success: res => {
              // console.log('[数据库] [查询记录] 成功: ', res.data[0])
              var menbers = res.data[0].reservation_menber
              // console.log("[2]" + menbers)
              this.updateMenberStatus(app.globalData.usermsg.user_no)
              if(menbers!==""){
                var menbersnolist = menber.split(",")
                for (var i = 0; i < menbersnolist.length; i++) {
                  this.updateMenberStatus(menbersnolist[i])
                }
              }
              this.removeReservation(this.data.reser_id)
              this.removeInviteCode(this.data.reser_id)
              wx.navigateBack({
                delta: 1,
              });
            },
            fail: err => {
              wx.showToast({
                icon: 'none',
                title: '查询记录失败'
              })
              console.error('[数据库] [查询记录] 失败：', err)
            }
          })
          
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  removeInviteCode:function(reserid){
    const db = wx.cloud.database()
    db.collection('invite').where({
      reservation_id: reserid
    }).get({
      success: res => {
        var id = res.data[0]._id
        db.collection('invite').doc(id).remove({
          success: res => {
            // wx.showToast({
            //   title: '删除成功',
            // })
            console.log('[数据库] [删除记录] 成功：', res)
          },
          fail: err => {
            // wx.showToast({
            //   icon: 'none',
            //   title: '删除失败',
            // })
            console.error('[数据库] [删除记录] 失败：', err)
          }
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
  //移除预约
  removeReservation:function(id){
    const db = wx.cloud.database()
    db.collection('reservation').doc(id).remove({
      success: res => {
        // wx.showToast({
        //   title: '删除成功',
        // })
        console.log('[数据库] [删除记录] 成功：', res)
      },
      fail: err => {
        // wx.showToast({
        //   icon: 'none',
        //   title: '删除失败',
        // })
        console.error('[数据库] [删除记录] 失败：', err)
      }
    })
  },
  updateReservation:function(no){
      //实现预约表中成员删除
    const db = wx.cloud.database()
    db.collection('reservation').where({
      _id: this.data.reser_id,
    }).get({
      success: res => {
        // console.log('[数据库] [查询记录] 成功: ', res.data[0].msg)
        var data = res.data[0]
        var menbers = data.reservation_menber
        if (menbers !== menbers.replace(no+",","")){
          menbers = menbers.replace(no + ",", "")
        } else if (menbers !== menbers.replace(no, "")){
          menbers = menbers.replace(no, "")
        }
        //menbers为已经删除了某成员的表
        wx.cloud.callFunction({
          name: 'modifyDatabase',
          data: {
            name: 'reservation',
            id: this.data.reser_id,
            data: {
              reservation_menber: menbers,
            },
          },
          complete: res => {
            this.setmenbers(menbers)
          },
        })
        // db.collection('reservation').doc(this.data.reser_id).update({
        //   data: {
        //     reservation_menber: menbers,
        //   }
        // }).then(res => {
        //   this.setmenbers(menbers)
        // })
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
  updateMenberStatus:function(no){
      //实现用户状态改变
    const db = wx.cloud.database()
    console.log()
    db.collection('user').where({
      user_no:no,
    }).get({
      success: res => {
        var id = res.data[0]._id
        wx.cloud.callFunction({
          name: 'modifyDatabase',
          data: {
            name: 'user',
            id: id,
            data: {
              reservation_id: "",
              user_status: app.globalData.STATUS_USER_CR,
            },
          },
          complete: res => {
            
          },
        })
        // db.collection('user').doc(id).update({
          // data: {
          //   reservation_id: "",
          //   user_status: app.globalData.STATUS_USER_CR,
          // }
        // })
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
})
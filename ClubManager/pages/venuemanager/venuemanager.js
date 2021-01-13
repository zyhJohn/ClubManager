// pages/place/place.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    yyPlace:'',
    yyTime: '',
    yyDate: '',
    yyStatus:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  btn: function () {
    var myThis = this;
    var list = ['北校区尚雅楼', '南校区致远楼']
    wx.showActionSheet({
      itemList: ['北校区尚雅楼', '南校区致远楼'],
      success(res) {
        // console.log(res.tapIndex)
        myThis.setData({
          yyPlace: list[res.tapIndex]
        })
      },
      fail: function (res) {
        console.log(res.errMsg)
      },
    })
  },

  bindDateChange: function (e) {
    // console.log(e.detail.value)
    this.setData({
      yyDate: e.detail.value
    })
  },

  btn2: function () {
    var myThis = this;
    var list = ['10:00-14:00', '16:00-20:00']
    wx.showActionSheet({
      itemList: ['10:00-14:00', '16:00-20:00'],
      success: function (res) {
        // console.log(res.tapIndex)
        myThis.setData({
          yyTime: list[res.tapIndex]
        })
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },

  btn3: function () {
    var myThis = this;
    var list = ['启用', '禁用']
    wx.showActionSheet({
      itemList: ['启用', '禁用'],
      success: function (res) {
        if (res.tapIndex== 0){
          myThis.setData({
            yyStatus: app.globalData.STATUS_VENUE_CR
          })
        }
        else if (res.tapIndex== 1){
          myThis.setData({
            yyStatus: app.globalData.STATUS_VENUE_NO
          })
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },

  getVenueInfo: function () {
      const db = wx.cloud.database()
      db.collection('venue').where({
        venue_addr: this.data.yyPlace,
        venue_time: this.data.yyTime
      }).get({
        success: res => {
          var venueid = res.data[0]._id
          if (this.data.yyStatus === app.globalData.STATUS_VENUE_CR){
            this.getRemoveid(venueid)
          }
          else if (this.data.yyStatus === app.globalData.STATUS_VENUE_NO) {
            this.updateStatus(venueid)
          }
        },
        fail: err => {
          console.error('操作失败：', err)
        }
      })
  },

  updateStatus: function (vid) {
    wx.cloud.callFunction({
      name: 'addDatabase',
      data: {
        name: 'venuediffstatus',
        data: {
          venue_date: this.data.yyDate,
          venue_id: vid,
          venue_status: this.data.yyStatus,
        },
      },
      complete: res => {
      },
    })
  },

  getRemoveid:function (vid){
    const db = wx.cloud.database()
    db.collection('venuediffstatus').where({
      venue_id: vid,
      venue_date: this.data.yyDate,
    }).get({
      success: res => {
        var id = res.data[0]._id
        console.log(id)
        this.removeStatus(id)
      },
      fail: err => {
        console.error('操作失败：', err)
      }
    })
  },

  removeStatus: function (id) {
    wx.cloud.callFunction({
      name: 'removeDatabase',
      data: {
        name: 'venuediffstatus',
        id: id,
      },
      complete: res => {
        console.log(id)
        console.log("操作成功")
      },
    })
  },

  submit: function () {
    this.getVenueInfo()
    wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 2000
    }),
      wx.navigateBack({
        delta: 1,
      })
  }

})
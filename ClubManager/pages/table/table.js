// pages/table/table.js\

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [{
        name: true,
        value: '是'
      },
      {
        name: false,
        value: '否',
        checked: 'true'
      },
    ],
    venuemaxpernum:0,
    venueid: "",
    venuename: "",
    session: "",
    date: "",
    name: "",
    no: "",
    phone: "",
    appsector: "",
    pernumber: "",
    appreason: "",
    hastools: false,
    toolsmsg: "",
    list:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var date = new Date(JSON.parse(options.date))
    this.setData({
      venueid: options.venue_id,
      date: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
    })



    if (app.globalData.hasuser) {
      var msg = app.globalData.usermsg
      this.setData({
        name: msg.user_name,
        no: msg.user_no,
        phone: msg.user_phone,
      })
      this.setVenueMsg()
    } else {
      wx.navigateBack({
        delta: 1,
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /**
   * 获取input值
   */
  getPhoneInput: function(e) {
    this.setData({
      phone: e.detail.value,
    })
  },
  getAppSectorInput: function(e) {
    this.setData({
      appsector: e.detail.value,
    })
  },
  getNumInput: function(e) {
    this.setData({
      pernumber: e.detail.value,
    })
  },
  getReasonInput: function(e) {
    this.setData({
      appreason: e.detail.value,
    })
  },
  getToolsInput: function(e) {
    this.setData({
      toolsmsg: e.detail.value,
    })
  },
  radioChange: function(e) {
    //这个e.detail.value返回值是string！！！！！！！！！日狗
    // this.setData({
    //   sex: e.detail.value? "女" : "男",
    // })
    this.setData({
      hastools: e.detail.value === "true" ? true : false,
    })

  },



  formSubmit: function(e) {
    if (parseInt(this.data.pernumber) > this.data.venuemaxpernum){
      wx.showToast({
        title: '(。﹏。*)场地只能容纳' + this.data.venuemaxpernum +'人呢',
        icon: 'none',
        duration: 3000
      });
    } else if (parseInt(this.data.pernumber) < 4) {
      wx.showToast({
        title: '小伙伴还不够呢，最少要有4个人才能驾驭得了本厨房呢！',
        icon: 'none',
        duration: 3000
      });
    } else if (this.data.phone === "" || this.data.appsector === "" || this.data.pernumber === "" || this.data.appreason === "" || (this.data.toolsmsg === "" && this.data.hastools===true) ){
      wx.showToast({
        title: '请先完整填写信息哦~',
        icon: 'none',
        duration: 2000
      });
    }else{
      console.log('form发生了submit事件，携带数据为：', e.detail.value),
        wx.showModal({
          title: '提示',
          content: '提交前多确认下信息哦，乱填可是会被驳回哒，还可能会被关进小黑屋！',
          success: res => {
            if (res.confirm) {
              console.log('用户点击确定')
              wx.showToast({
                title: '保存成功',
                icon: 'success',
                duration: 2000
              });
              this.saveReserMsg();
              var pages = getCurrentPages();
              var prevPage = pages[pages.length - 2];
              prevPage.setData({
                iswrite: true,
                list: this.data.list
              });
              wx.navigateBack({
                delta: 1,
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

  saveReserMsg: function() {
    this.setData({
      list:{
        user_no: app.globalData.usermsg.user_no,
        reservation_phone: this.data.phone,
        reservation_date: this.data.date,
        reservation_menber: "",
        reservation_menbercount: this.data.pernumber,
        reservation_usetools: this.data.hastools,
        reservation_status: app.globalData.STATUS_RESER_WP,
        venue_id: this.data.venue_id,
        reservation_reason: this.data.appreason,
        reservation_tools: this.data.toolsmsg,
        reservation_from: this.data.appsector,
      },
    })
    console.log(this.data.list)
  },
  setVenueMsg: function() {
    const db = wx.cloud.database()
    // console.log(this.data.venueid)
    db.collection('venue').where({
      _id: this.data.venueid,
    }).get({
      success: res => {
        // console.log('[数据库] [查询记录] 成功: ', res)
        var data = res.data[0]
        this.setData({
          venuename: data.venue_name,
          session: data.venue_time,
          venuemaxpernum: data.venue_maxnum
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
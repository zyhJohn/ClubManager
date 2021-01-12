// pages/user/user.js


const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { name: true, value: '女' },
      { name: false, value: '男', checked: 'true' },
    ],
    inputhid: false,
    fixedhid: true,
    name: "",
    no: "",
    sex: "男",
    phone: "",
    addr: "",
    status: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.hasuser) {
      this.setUserMsg();
      this.setData({
        inputhid: true,
        fixedhid: false,
      })
    }

  },

  formSubmit: function (e) {
    wx.showModal({
      title: '提示',
      content: '提交后部分就不能再次修改！！！确认提交？',
      success: res=> {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000
          })
          this.putUserMsg();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    // wx.navigateBack({
    //   delta: 1,
    // })
  },

  formReset: function () {
    // console.log('form发生了reset事件')
    this.setData({
      phone: this.data.phone,
      addr: this.data.addr,
    })

    const db = wx.cloud.database();
    db.collection('user').doc(app.globalData.usermsg._id).update({
      data: {
        user_phone: this.data.phone,
        user_address: this.data.addr,
      }
    }).then(res => {
      app.globalData.usermsg.user_phone = this.data.phone
      app.globalData.usermsg.user_address = this.data.addr
    })
  },
  /*
  获取input值
  */
  getNameInput: function (e) {
    this.setData({
      name: e.detail.value,
    })
  },
  getNoInput: function (e) {
    this.setData({
      no: e.detail.value,
    })
  },
  getPhoneInput: function (e) {
    this.setData({
      phone: e.detail.value,
    })
  },
  getAddrInput: function (e) {
    this.setData({
      addr: e.detail.value,
    })
  },
  radioChange: function (e) {
    //这个e.detail.value返回值是string！！！！！！！！！日狗
    // this.setData({
    //   sex: e.detail.value? "女" : "男",
    // })
    this.setData({
      sex: e.detail.value === "true" ? "女" : "男",
    })

  },


  setUserMsg: function () {
    var data = app.globalData.usermsg;
    this.setData({
      name: data.user_name,
      no: data.user_no,
      sex: data.user_sex ? "女" : "男",
      phone: data.user_phone,
      addr: data.user_address,
      status: data.user_status,
    })
  },
  putUserMsg: function () {
    // collection('user') 获取到数据库中名为 user 的集合
    // add 插入操作
    const db = wx.cloud.database()
    db.collection('user').add({
      // 要插入的数据
      data: {
        user_name: this.data.name,
        user_no: this.data.no,
        user_phone: this.data.phone,
        user_sex: this.data.sex === "男" ? false : true,
        user_address: this.data.addr,
        user_status: app.globalData.STATUS_USER_NL,
        reservation_id:"",
      }
    }).then(res => {
      // 插入数据成功
      console.log(res)
      this.setData({
        status: app.globalData.STATUS_USER_NL,
        inputhid: true,
        fixedhid: false,
      })

    }).catch(err => {
      // 插入数据失败
      console.log(err)
    })
  }
})
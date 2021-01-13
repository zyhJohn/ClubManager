// pages/attention/attention.js
Page({



  /**
   * 页面的初始数据
   */
  data: {
    node1: [{
      name: 'div',
      attrs: {
        class: 'div_class',
        style: 'line-height: 30px; color: black;'
      },
      children: [{
        type: 'text',
        text: '1、毕至居面向全院教师、学生团体开放预约，参与人数需多于4人以上，暂不对个人开放。谢绝校外人员预约使用。'
      }]
    }],

    node2: [{
      name: 'div',
      attrs: {
        class: 'div_class',
        style: 'line-height: 30px; color: black;'
      },
      children: [{
        type: 'text',
        text: '2、毕至居实行网络预约制度，预约人需提前1周以上进行实名预约，每周同一预约人仅限预约一场。同时，预约人应与实际使用人一致，严禁预约人转让预约。'
      }]
    }],

    node3: [{
      name: 'div',
      attrs: {
        class: 'div_class',
        style: 'line-height: 30px; color: black;'
      },
      children: [{
        type: 'text',
        text: '3、电话审核通过后，预约人应于每周四下午1:30-4:00至致远楼公寓中心进行线下预约确认，并缴纳100元押金和20元清洁费。如未及时确认，将视为放弃预约。预约确认后，若中途取消预约，将退还押金，清洁费恕不退还。预约结果确认后，每周五将会于ZUCC城室之声微信公众号上公布下周预约结果，所有预约均以公布的预约结果为准。'
      }]
    }],

    node4: [{
      name: 'div',
      attrs: {
        class: 'div_class',
        style: 'line-height: 30px; color: black;'
      },
      children: [{
        type: 'text',
        text: '4、毕至居使用人员应服从公寓管理人员管理，严禁酗酒、吸烟、起哄闹事以及其他可能危害、妨碍公共安全和秩序的不文明行为。'
      }]
    }],

    node5: [{
      name: 'div',
      attrs: {
        class: 'div_class',
        style: 'line-height: 30px; color: black;'
      },
      children: [{
        type: 'text',
        text: '5、烹饪过程中不得采取烧烤等对周围环境有较大影响的烹饪方式。烹饪所需调味料（如油、盐、酱等）和餐具（碗、碟、筷等）均需自带。电器也可自带，自带电器使用完毕后应置于楼内储物间保存，使用时取出，不得放置于寝室中，否则视为违章电器处理。'
      }]
    }],

    node6: [{
      name: 'div',
      attrs: {
        class: 'div_class',
        style: 'line-height: 30px; color: black;'
      },
      children: [{
        type: 'text',
        text: '6、毕至居使用人员应保持室内清洁，使用完毕后请清理干净台面、水池、厨余垃圾、其他垃圾请分类投放至对应的垃圾桶内。'
      }]
    }],

    node7: [{
      name: 'div',
      attrs: {
        class: 'div_class',
        style: 'line-height: 30px; color: black;'
      },
      children: [{
        type: 'text',
        text: '7、冰箱只暂存当天活动需要的食物，活动结束后冰箱内残留物品视为丢弃。'
      }]
    }],

    node8: [{
      name: 'div',
      attrs: {
        class: 'div_class',
        style: 'line-height: 30px; color: black;'
      },
      children: [{
        type: 'text',
        text: '8、刀具借用，需到毕至居所在楼值班室实名登记后方可借用。'
      }]
    }],

    node9: [{
      name: 'div',
      attrs: {
        class: 'div_class',
        style: 'line-height: 30px; color: black;'
      },
      children: [{
        type: 'text',
        text: '9、室内的设施配件，应按操作规范使用，不得擅自拆除、搬移或带出，如有因不当使用造成损坏的，当参照价目表赔偿。'
      }]
    }],

    node10: [{
      name: 'div',
      attrs: {
        class: 'div_class',
        style: 'line-height: 30px; color: black;'
      },
      children: [{
        type: 'text',
        text: '10、毕至居每场使用结束后，请注意带走个人物品，并到毕至居所在楼楼长处归还钥匙，缴纳水电费用，其中水费3.2元/吨，电费0.55元/度。押金退还请于工作日到致远楼公寓中心办理。'
      }]
    }],

    node11: [{
      name: 'div',
      attrs: {
        class: 'div_class',
        style: 'line-height: 30px; color: red;'
      },
      children: [{
        type: 'text',
        text: '以上规定如有违反，将按学院相关管理规定予以处理并限制预约人再次预约。'
      }]
    }],

    node12: [{
      name: 'div',
      attrs: {
        class: 'div_class',
        style: 'line-height: 30px; color: green;'
      },
      children: [{
        type: 'text',
        text: '请点击下方按钮表示我已阅读并按上方规则执行。'
      }]
    }]
  },

  primary: function () {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]
    prevPage.setData({
      isread: true
    });
    wx.navigateBack({
      delta: 1,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  tap() {
    console.log('tap')
  }

})
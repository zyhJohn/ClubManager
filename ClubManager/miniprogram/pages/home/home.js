//Page Object
Page({
  data: {
    floorstatus: '',//回到顶部
    clubheight: 0,//社团部分高度计算结果
    activityheight: 0,//活动部分高度计算结果
    currentTab: 0,//当前选中的tab
    swiperList: [
     
    ],//轮播图
    cateList: [],
    cateList1: [ //分类第一行
      {
        name: '兴趣',
        open_type: 'switchTab',
        image_src: 'https://ae01.alicdn.com/kf/H4a75576ce3fe43ef8491f3af55274c68N.jpg',
        query: 'photo'
      },
      {
        name: '游戏',
        open_type: 'switchTab',
        image_src: 'https://ae01.alicdn.com/kf/H4ce19cabf3ae4b16886e10efa81dd4caO.jpg',
        query: 'game'
      },
      {
        name: '艺术',
        open_type: 'switchTab',
        image_src: 'https://ae01.alicdn.com/kf/Ha44e97419a554a17804bea754af82d37t.jpg',
        query: 'music'
      },
      {
        name: '组织',
        open_type: 'switchTab',
        image_src: 'https://ae01.alicdn.com/kf/H3d6fdba9f5a24ef7bb6f7ab4e47d8155w.jpg',
        query: 'organization'
      }
    ],
    cateList2: [ //分类第二行
      {
        name: '志愿',
        open_type: 'switchTab',
        image_src: 'https://ae01.alicdn.com/kf/Hcd3c9ff863ee4fb0af5a7b79e182615bV.jpg',
        query: 'volunteer'
      },
      {
        name: '动漫',
        open_type: 'switchTab',
        image_src: 'https://ae01.alicdn.com/kf/Hc5289561f252435b95a9c7b27c70d27aS.jpg',
        query: 'comic'
      },
      {
        name: '学术',
        open_type: 'switchTab',
        image_src: 'https://ae01.alicdn.com/kf/He4172403d8e44fc887c65c752ae9863aO.jpg',
        query: 'film'
      },
      {
        name: '运动',
        open_type: 'switchTab',
        image_src: 'https://ae01.alicdn.com/kf/H1ef7dd70722b49b5867dea0e8c0ad5edn.jpg',
        query: 'chess'
      }
    ],
    activityItem: [

    ],
    clubItem: [
      
      
    
    ]
  },
  sendmessage:function(e) {
    var app=getApp();     // 取得全局App
    app.globalData.clubtab = e.currentTarget.dataset.index
    // let index = e.currentTarget.dataset.index
    // wx.setStorageSync("clubtab",index);
  },

  goTop: function (e) {  // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },

  //options(Object)
  onLoad: function (options) {

    this.getSwiperList()
   

    this.getUserClubList()
    this.getUserActivityList()

  
  },

  onShow(){
    this.getUserClubList()
    this.getSwiperList()
   
    this.getUserActivityList()

    // this.setcHeight()
    // this.setaHeight()
  },


  setaHeight() {
    var that = this;
    this.setData({ activityheight: this.data.activityItem.length * 750 })
    // console.log(this.data.activityheight);
  },
  setcHeight() {
    var that = this;
    this.setData({ clubheight: this.data.clubItem.length * 560 })
    // console.log(this.data.clubItem); 
    // console.log(this.data.clubheight);
  },
  bindsearch(){
    wx.navigateTo({
      url: '/pages/search/search',
    });
  },

  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  // 点击切换选项卡
  clickTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },

  switchTab(event) {
    var cur = event.detail.current;
    this.setData({
      currentTab: cur,
    });
  },

  getSwiperList() {
    request({ 
      url: '/swiperlist'
    })
      .then(result => {
        this.setData({
          swiperList: result.data.data.pic
        })
      })
  },

  getUserActivityList(){
    request({ 
      url: '/useractivity',
    })
      .then(result => {
        this.setData({
          activityItem: result.data.data.activityItem
        })
        this.setaHeight()
      })
  },
    
  getUserClubList(){
    request({ 
      url: '/userclub',
    })
      .then(result => {
        this.setData({
          clubItem: result.data.data.clubItem
        })
        this.setcHeight()
      })
  },



  onPageScroll: function (e) {
    if (e.scrollTop > 100) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  }


});
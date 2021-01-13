// pages/detail/detail.

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isleader:false,

    //页面传参
    club_id:"21ded5cb5ffdcad804bf45676de73a0c",
    //社团信息
    clubintroduce:"",
    clubname:"",
    clubreason:"",
    clubtype:"",
    clubstatus: "",
    creattime:"",
    nummember:"",

    leaderno:"",
    leadername: "",
    leaderphone: "",

    ps:"",

    clubmember:"",
    menlist:[],
    menberslist: [{
      name:"无",
    }],

    hasIn:false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      club_id:options.club_id, 
      hasIn:options.hasIn === '1'? true : false
    })
    this.setData({
      isleader: this.isLeader(),
    })

    this.setclubmsg()
  },

  exit: function () {
    wx.showModal({
      title: '提示',
      content: '确认退出该社团吗？',
      success: res => {
        if (res.confirm) {
          console.log('用户点击确定')
          this.updateClub(app.globalData.usermsg.user_no)
          wx.navigateBack({
            delta: 1,
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  close:function(){
    wx.showModal({
      title: '提示',
      content: '确认解散社团需填写解散理由。',
      success: res => {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.redirectTo({
            url: '../clubclose/clubclose?club_id='+this.data.club_id,
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  addin:function(){
    wx.navigateTo({
      url: '../clubcheck/clubcheck?club_id='+this.data.club_id,
    })
  },

  check:function(){
    wx.navigateTo({
      url: '../clubin/clubin?club_id='+this.data.club_id,
    })
    this.setclubmsg()
  },

  isLeader:function(){
    const db = wx.cloud.database()
    db.collection('club').where({
      _id: this.data.club_id
    }).get({
      success: res => {
        // console.log('[数据库] [查询记录] 成功: ', res)
        this.setData({
          isleader: res.data[0].user_no == app.globalData.usermsg.user_no ? true : false,
          clubstatus: res.data[0].club_status
        })
        if (this.data.isleader) {
          this.setData({
            leaderno: app.globalData.usermsg.user_no,
            leadername: app.globalData.usermsg.user_name,
            leaderphone: app.globalData.usermsg.user_phone,
          })
        } else {
          db.collection('user').where({
            user_no: res.data[0].user_no
          }).get({
            success: res => {
              this.setData({
                leaderno: res.data[0].user_no,
                leadername: res.data[0].user_name,
                leaderphone: res.data[0].user_phone,
              })
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

  setclubmsg:function(){
    const db = wx.cloud.database()
    db.collection('club').where({
      _id: this.data.club_id
    }).get({
      success: res => {
        // console.log('[数据库] [查询记录] 成功: ', res)
        var data = res.data[0]
        this.setData({
          clubname: data.club_name,
          creattime: data.creat_time.substring(0,10),
          clubtype: data.club_type,
          clubintroduce: data.club_introduce,
          clubmember: data.club_member,
          clubreason: data.club_reason,
          clubstatus: data.club_status,
          nummember: data.num_member,
          ps: data.ps,
        })
        this.setmenbers(data.club_member)
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
    list.push(s)
    for(var i=0;i<s.length;i++){
      var temp=""
      for(var j=0;j<s.length;j++){
        if(list[0][j]>list[0][i]){
          temp = list[0][j]
          list[0][j] = list[0][i]
          list[0][i] = temp
        }
      }
    }
    this.setData({
      menlist: [],
      menberslist: [{
        name: "无"
      }]
    })

    const db = wx.cloud.database()
    const _ = db.command
    db.collection('user').where({
      user_no: _.in(list[0]),
    }).get({
      success: res => {
        //console.log('[数据库] [查询记录] 成功: ', res)
        var jstr = []
        for (var i = 0; i < s.length; i++){
          jstr.push(res.data[i].user_name)
          //console.log(res.data[i])
        }
        list.push(jstr)
        this.setData({
          menlist: list,
        })
        this.reshape()
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

  reshape:function(){
    var a = this.data.menlist[0].length
    var list = []
    for(var i = 0; i < a; i++){
      var jstr = {}
      jstr.no = this.data.menlist[0][i]
      jstr.name = this.data.menlist[1][i]
      list.push(jstr)
      this.setData({
        menberslist: list
      })
    }

  },

  changeMaster:function(){
    if (this.data.menberslist[0].no === undefined){
      wx.showToast({
        icon: 'none',
        title: '你好像还是光杆司令，无法转让社长呢……',
        duration:2000
      })
    }else{
      // console.log(this.data.menberslist)
      wx.showActionSheet({
        itemList: this.getMenbersListName(),
        success: res => {
          this.getNewLeaderMsg(this.data.menberslist[res.tapIndex].no)
          wx.showToast({
            icon:"none",
            title: '权力变更中……',
            mask:true,
            duration: 2000
          })
          this.setclubmsg()
        },
        fail: function (res) {
          console.log(res.errMsg)
        }
      })
    }
  },

  getIntroduceInput:function(e){
    this.setData({
      clubintroduce: e.detail.value,
    })
  },
  getPsInput: function(e) {
    this.setData({
      ps: e.detail.value,
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
          var num = parseInt(this.data.nummember)
          num = num - 1
          this.setData({
            nummember: ""+num
          })

          this.updateClub(this.data.menberslist[res.tapIndex].no)
          wx.showToast({
            icon:"none",
            title: '抛弃队友中……',
            mask:true,
            duration: 2000
          })
          this.setclubmsg()
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
    return list
  },
  getNewLeaderMsg:function(no){
    const db = wx.cloud.database()
    db.collection('user').where({
      user_no: no
    }).get({
      success : res =>{
        var data = res.data[0]
        this.setData({
          leaderno: no,
          leadername: data.user_name,
          leaderphone: data.user_phone
        })
        this.updateMaster(no)
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

  //解散社团功能
  closeClub:function(){
    const db = wx.cloud.database()
    db.collection('club').where({
      _id: this.data.club_id,
    }).get({
      success: res => {
      // console.log('[数据库] [查询记录] 成功: ', res.data[0])
        this.removeClub(this.data.club_id)
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
  },
  //移除社团
  removeClub:function(id){
    const db = wx.cloud.database()
    db.collection('club').doc(id).remove({
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
  updateClub:function(no){
      var data = this.data
      var menbers = data.clubmember
      if (menbers !== menbers.replace(no+",","")){
        menbers = menbers.replace(no + ",", "")
      } else if (menbers !== menbers.replace(no, "")){
        menbers = menbers.replace(","+no, "")
      }

      this.setData({
        clubmember: menbers
      })

      //menbers为已经删除了某成员的表
      const db = wx.cloud.database()
      db.collection('club').doc(this.data.club_id).update({
        data:{
          club_member: menbers,
          num_member: this.data.nummember,
        }
      }).then(res=>{
        this.setmenbers(menbers)
        console.log(res)
       })
  },
  updateMaster:function(no){
    var data = this.data
    var menbers = data.clubmember

    menbers = menbers + ',' + app.globalData.usermsg.user_no

    if (menbers !== menbers.replace(no+",","")){
      menbers = menbers.replace(no + ",", "")
    } else if (menbers !== menbers.replace(no, "")){
      menbers = menbers.replace(","+no, "")
    }

    this.setData({
      clubmember: menbers
    })

    const db = wx.cloud.database()
    db.collection('club').doc(data.club_id).update({
      data:{
        club_member: menbers,
        user_no: data.leaderno,
        user_name: data.leadername,
        user_phone: data.leaderphone,
      }
    }).then(res=>{
      console.log(data.leaderno)
      console.log(data.leadername)
      console.log(data.leaderphone)
      this.setmenbers(menbers)
     })
    this.setData({
      isleader: false
    })
},

  submit:function(){
    const db = wx.cloud.database()
    db.collection('club').doc(this.data.club_id).update({
      data:{
        club_introduce: this.data.clubintroduce,
        ps: this.data.ps,
      }
    }).then(res=>{
      console.log(res)
     })
  }
})
// pages/detail/detail.

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
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

    isok:false,
    isno:false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      club_id:options.club_id, 
      club_status:options.club_status,
      isno:options.club_status === app.globalData.STATUS_CLUB_NO ? true:false,
      isok:options.club_status === app.globalData.STATUS_CLUB_WA ? true:false,
    })
    this.getLeadermsg()
    this.setclubmsg()
  },
  
  close:function(){
    this.removeClub(this.data.club_id)
    wx.navigateBack({
      delta: 1,
    });
  },

  submit:function(){
    const db = wx.cloud.database()
    db.collection('club').doc(this.data.club_id).update({
      data:{
        club_status: app.globalData.STATUS_CLUB_OK,
      }
    }).then(res=>{
      console.log(res)
      wx.navigateBack({
        delta: 1,
      })
     })
  },

  getLeadermsg:function(){
    const db = wx.cloud.database()
    db.collection('club').where({
      _id: this.data.club_id
    }).get({
      success: res => {
        // console.log('[数据库] [查询记录] 成功: ', res)
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

  getMenbersListName:function(){
    var l = this.data.menberslist.length
    var list = []
    for (var i = 0; i < l; i++){
      list.push(this.data.menberslist[i].name)
    }
    return list
  },

  //解散社团
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
})
// pages/Setting/Setting.js
Page({

  data: {
    UserInfo:[],
    UserStatus:"Crazy",
    HadUserInfo:false,
    ToVibrate:true,
  },

  onLoad(options) {
    var UserInfo=wx.getStorageSync('UserInfo')||[];
    if(UserInfo.length==0){
      this.setData({
        HadUserInfo:false,
        UserInfo:UserInfo,
      })
      // console.log("No User Info!");
    }else{
      this.setData({
        HadUserInfo:true,
        UserInfo:UserInfo,
      })
      // console.log("Got it!");
      // console.log(UserInfo);
    }
  },

  onReady() {
    this.setData({
      ToVibrate:wx.getStorageSync('ToVibrate')
    })
    // console.log(this.data.ToVibrate)
  },

  onShow() {

  },

  onHide() {

  },

  onUnload() {

  },

  onPullDownRefresh() {

  },

  onReachBottom() {

  },

  onShareAppMessage() {
    wx.showModal({
      cancelColor: 'cancelColor',
      title: '感谢！',
      content: 'NC-Pomodoro将不服您的期望，我们将继续完善！'
    })
    return {
      title: '超简洁的微信番茄钟，快来试试！',
      path: '/pages/index/index'
    }
  },
  onShareAppMessage() {
    wx.showModal({
      cancelColor: 'cancelColor',
      title: '感谢！',
      content: 'NC-Pomodoro将不服您的期望，我们将继续完善！'
    })
    return {
      title: '超简洁的微信番茄钟，快来试试！',
      path: '/pages/index/index'
    }
  },
  IsVibrate:function(){
    if(this.data.ToVibrate){
      this.setData({
        ToVibrate:false,
        
      })
    }else{
      this.setData({
        ToVibrate:true
      })
    }
    wx.setStorageSync('ToVibrate',this.data.ToVibrate);
    // console.log(wx.getStorageSync('ToVibrate'));
  },
  LogIn:function(){
    wx.getUserProfile({
      desc: 'Only A Test Now',
      lang: 'zh_CN',
      success: (result) => {
        this.setData({
          UserInfo: result.userInfo,
          HadUserInfo: true
        })
        wx.setStorageSync('UserInfo',result.userInfo);
        //console.log(result)
        // console.log(result.userInfo)
      },
      fail: (res) => {},
      complete: (res) => {},
    }) 
  },
  GoToInfoPolicy:function(events){
    wx.navigateTo({
      url: '/pages/InfoPolicy/InfoPolicy',
      events: events,
      success: (result) => {},
      fail: (res) => {},
      complete: (res) => {},
    })
  },
  GoToSuggestions:function(events){
    wx.navigateTo({
      url: '/pages/Suggestions/Suggestions',
      events: events,
      success: (result) => {},
      fail: (res) => {},
      complete: (res) => {},
    })
  },
  LogOut: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '退出登录后将无法记录时长',
      success: function (res) {
        if (res.confirm) {
          that.setData({
            UserInfo: {},
            HadUserInfo: false,
          });
          wx.setStorageSync('UserInfo',[]);
          wx.showToast({
            title: '退出成功',
            icon: 'success',
            duration: 1500
          })
        } else if (res.cancel) {
          //console.log("Canceled.");
        }
      }
    })

  },
  ShowVersion:function(){
    wx.showModal({
      title: 'NC-Pomodoro Version',
      content: 'V3.3.0 Released',
      showCancel:false,
    })
  }
})
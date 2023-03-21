// pages/About/About.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    t: 0,
    Vme: true,
    showVersion: 'V3.1.1 Beta',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

    // wx.cloud.callFunction({
    //   name:"UpLoadAsset",
    //   action:"updateLocalStorage"
    // }).then(res=>{}).catch(err=>{

    // })
    wx.cloud.callFunction({
      name:"Nickname",
      action:"readnickname_totaltime"
    }).then(res=>{}).catch(err=>{

    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareTimeline: ()=> {
    return {
      title: '超简洁的微信番茄钟，快来试试！',
      content:'BUG还很多，我们还在路上'
    }
  },
  onShareAppMessage() {
    wx.showModal({
      cancelColor: 'cancelColor',
      title: '感谢！',
      content: 'NC-Pomodoro将不服您的期望，继续完善！'
    })
    return {
      title: '超简洁的微信番茄钟，快来试试！',
      path: '/pages/index/index'
    }
  },

  ContactUs: function () {
    wx.showModal({
      cancelColor: 'cancelColor',
      title: '联系方式',
      content: ' ------- QQ ：1729138395 ------- ------- 微信 ：Ad Astra -------'
    })
  },
  tapversion: function () {
    this.data.t = 1 + this.data.t;
    // if (this.data.t == 5) {
    //   wx.showModal({
    //       cancelColor: 'cancelColor',
    //       title: '进不了开发者模式的',
    //       content: '~呼呼~但是可以打赏~'
    //     }),
    //     this.setData({
    //       Vme: false,
    //       showVersion: '啊啊啊，被你玩坏了'
    //     })
    // }
    if (this.data.t == 1) {
      this.setData({
        showVersion: '别点我',
      })
    }
    if (this.data.t == 2) {
      this.setData({
        showVersion: '没有东西',
      })
    }
    if (this.data.t == 3) {
      this.setData({
        showVersion: '再多点一下就会爆炸',
      })
    }
    if (this.data.t == 4) {
      this.setData({
        showVersion: '再靠近一点快被融化',

      })
    }

    
  }
})
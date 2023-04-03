// pages/develop/getname.js
var nameid = ""; //全局变量名字
Page({

  /**
   * 页面的初始数据
   */
  data: {
    test_temp: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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
  // 俩个按钮一个注册一个修改 其中注册调用数据库看看有没有 暂时没用等会更新界面开发可以用
  updatenickname: function () {

  },
  savenickname: function (events) {
    var that = this;
    var isr = wx.getStorageSync('IsRank') || false;
    if (isr) {
      wx.navigateTo({
        url: 'pages/develop/developmaker',
        events: events,
        success: (result) => {},
        fail: (res) => {},
        complete: (res) => {},
      })
    }
    //查询是否重名
    that.setData({
      test_temp: 0
    })
    wx.cloud.callFunction({
      name: "Nickname",
      data: {
        act: "judge_ifexist"
      },
    }).then(res => {
      console.log("名字", res, res.result.length)
      for (var c = 0; c < res.result.length; c++) {
        console.log(c, res.result[c])
        if (res.result[c].toString() == nameid) {
          that.setData({
            test_temp: 1
          })
          console.log("中间变量", that.data.test_temp)
          wx.showToast({
            title: '重名了', //不能重名
            duration: 300
          })
          break;
        }
        if (that.data.test_temp == 0) //重名标志变量默认在昵称不重复时进入save工序
        {
          wx.cloud.callFunction({
            name: "getOpenId",
            success(res) {
              // 授权用户的openid
              //console.log("看看云函数GETOPENID",res);
              let openId = res.result.openid
              // 1判断openid是否存在于数据库
              //2不能重名方法获取所有Nickname循环判断是否与之相等

              wx.cloud.database().collection('PomodoroUsers').where({
                _openid: openId
              }).update({
                data: {
                  nickName: nameid,
                  IsRank: true //可以进入开发页面或者改名按钮不隐藏
                }
              }).then(ress => {
                wx.setStorageSync('IsRank', true) //设置缓存
                wx.setStorageSync('nickName', nameid) //设置缓存
                wx.navigateTo({
                  url: '/pages/develop/developmaker',
                  events: events,
                  success: (result) => {},
                  fail: (res) => {},
                  complete: (res) => {},
                })

              })
            },
            fail(res) {
              console.log("云函数GETOPENIDa调用失败")
            }
          })
        }

      }
    }).catch(err => {

    })

  },
  getname(e) {
    nameid = e.detail.value;
    console.log(nameid); //通过测试event对象打印出要的值
  },
  addnicknametodatabase() {
    if (nameid.length == 0) {
      wx.showToast({
        title: '昵称不能为空',
        icon: 'error'
      })
    } else {
      this.savenickname();
      // wx.navigateTo({
      //   url:"../develop/developmaker"
      // })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})
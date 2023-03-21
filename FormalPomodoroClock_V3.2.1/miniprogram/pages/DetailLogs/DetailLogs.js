// pages/DetailLogs/DetailLogs.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Logs: wx.getStorageSync('Logs'),
    // LogsDisplay: [],
    Color: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // this.LogsDisplayProcess();
    // console.log(this.data.LogsDisplay);
    
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
  onShareAppMessage() {

  },
  LogsDisplayProcess: function () {
    //弃用了
    var LogsDisplay = [];
    var LogsColor = "";
    var Logs = this.data.Logs;
    for (let i = 0; i < Logs.length; i++) {
      if(Logs[i].Cate=="学习"){
        LogsColor="#56aa68";
      }else if(Logs[i].Cate=="工作"){
        LogsColor="#cc6770";
      }else if(Logs[i].Cate=="锻炼"){
        LogsColor="#969696";
      }else if(Logs[i].Cate=="休息"){
        LogsColor="#9b8150";
      }else if(Logs[i].Cate=="未分类"){
        LogsColor="#b4b4b4";
      }
      LogsDisplay.unshift({
        Cate: Logs[i].Cate,
        Date: Logs[i].Date,
        Dist: Logs[i].Dist,
        Index: Logs[i].Index,
        Time: Logs[i].Time,
        Way: Logs[i].Way,
        Color:LogsColor
      })
      
    }
    
    this.setData({
      LogsDisplay: LogsDisplay
    })
  }
})
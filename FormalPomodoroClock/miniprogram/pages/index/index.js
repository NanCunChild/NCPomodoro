// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    progress: 0,
    SettedTime: 1500000,
    RemainedTime: 50000,
    TimeStr: '25:00',
    timer: null,
    ConvasWidth: 0,
    ConvasHeight: 0,

    IsCateOpen: false,
    IsStarted: false,
    IsPaused: false,
    IsSideNavOpen: false,
    IsSideMesOpen: false,
    UserInfo: {},
    HadUserInfo: false,
    TimeSettingTemp: 0,
    Bud_Position_x: 0,
    Bud_Position_y: 0,
    BudSelected: false,
  },

  onLoad(options) {
    this.TimeSetting();
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
  TimeSetting: function () {
    var that = this;
    wx.createSelectorQuery()
      .select('#Progress')
      .fields({
        node: true,
        size: true
      })
      .exec((res) => {
        //console.log(res);
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')
        const width = res[0].width;
        const height = res[0].height;
        const WindowInfo = wx.getWindowInfo();
        const dpr = WindowInfo.pixelRatio;
        that.setData({
          ConvasHeight: res[0].height,
          ConvasWidth: res[0].width
        })
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr)
        ctx.translate(width / 2, height / 2);
        console.log(dpr);

        ctx.beginPath();
        ctx.arc(0, 0, width / 2 - 18, 0, Math.PI * 2);
        ctx.lineWidth = 10;
        var Gradient_Grey = ctx.createLinearGradient(-width / 2, -height / 2, width / 2, height / 2);
        Gradient_Grey.addColorStop("0", "#f0f0f0");
        Gradient_Grey.addColorStop("1.0", "#f1f1f1");
        ctx.strokeStyle = Gradient_Grey;
        ctx.stroke();
        ctx.closePath();
        ctx.rotate(-Math.PI / 2);

        ////////////////////动态圆
        ctx.beginPath();
        ctx.arc(0, 0, width / 2 - 18, 0, (that.data.SettedTime / 1800000) * Math.PI);
        ctx.lineWidth = 10;
        var Gradient_Green = ctx.createLinearGradient(0, 0, 0, height / 2);
        Gradient_Green.addColorStop("0", "#a3da33");
        Gradient_Green.addColorStop("1.0", "#56B37F");
        ctx.strokeStyle = Gradient_Green;
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(width / 2 - 18, 0, 5, 0, Math.PI * 2);
        ctx.fillStyle = Gradient_Green;
        ctx.fill();
        ctx.closePath();
        ////////////////////动态圆

        //此时坐标轴正常，向右为x轴正方向，向上为y轴正方向
        ctx.beginPath();
        let Position_x = (Math.sin((that.data.SettedTime / 1800000) * Math.PI))*(width/2-18);
        let Position_y = (Math.cos((that.data.SettedTime / 1800000) * Math.PI))*(width/2-18);
        this.setData({
          Bud_Position_x: Position_x,
          Bud_Position_y: Position_y,
        })
        ctx.arc(Position_y, Position_x, 12, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowColor = 'rgba(86,179,127,0.5)';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(Position_y, Position_x, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#56B37F";
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowColor = 'rgba(86,179,127,0.5)';
        ctx.shadowBlur = 14;
        ctx.fill();
        ctx.closePath();
        /////////////////小纽扣
        ctx.rotate(Math.PI / 2);
        ctx.font = '52px 微软雅黑';
        ctx.fillStyle = '#000'
        ctx.fillText(this.data.TimeStr, -ctx.measureText(this.data.TimeStr).width * 0.5, 10);

        ctx.font = '14px 微软雅黑';
        ctx.fillStyle = '#808A87';
        ctx.fillText("设定时间", -ctx.measureText("设定时间").width * 0.5, 36);
      })
  },

  /**
   * 用户点击右上角分享
   */
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
  GetUser: function () {
    wx.getUserProfile({
      desc: 'Only A Test Now',
      lang: 'zh_CN',
      success: (result) => {
        this.setData({
          UserInfo: result.userInfo,
          HadUserInfo: true
        })
        //console.log(result)
      },
      fail: (res) => {},
      complete: (res) => {},
    })
  },


  Start: function () {
    var Setted = this.data.SettedTime;
    this.setData({
      RemainedTime: Setted,
      IsStarted: true,
    })
    this.Timer();
  },
  GiveUp: function () {
    this.setData({
      IsStarted: false,
      DrawingDegree: (5 / 6) * Math.PI,
      SettedTime: 1500000,
      RemainedTime: 10000,
      TimeStr: "25:00",
    })
    this.TimeSetting();
    clearInterval(this.data.timer);
  },
  /*
  Pause: function () {
    clearInterval(this.data.timer);
    this.setData({
      IsPaused: true,
    })
  },
  Continue: function () {
    this.Timer();
    this.setData({
      IsPaused: false,
    })
  },
*/


  Timer: function () {
    var that = this; //存储代码所在子函数的环境
    /*这里注意在setInterval这个回调函数里面的this指的是定时器的作用域，不是外面的函数或者页面的作用域 */
    var Setted = this.data.SettedTime;
    var timer = setInterval(function () {
      var Remained = that.data.RemainedTime - 50;
      that.setData({
        RemainedTime: Remained,
      });
      //console.log(Remained);
      if (Remained > 0) {
        if (Remained % 1000 == 0) {
          var I_SecendCha = Remained / 1000; // s
          var I_MinuteCha = parseInt(I_SecendCha / 60) // m
          var P_SecendCha = (I_SecendCha - I_MinuteCha * 60) >= 10 ? (I_SecendCha - I_MinuteCha * 60) : '0' + (I_SecendCha - I_MinuteCha * 60); //秒数是否超过10，没超过就要加0
          var P_MinuteCha = I_MinuteCha >= 10 ? I_MinuteCha : '0' + I_MinuteCha;
          that.setData({
            TimeStr: P_MinuteCha + ':' + P_SecendCha
          })
        }
      } else {
        clearInterval(timer);
        wx.vibrateLong(); // 使手机震动400ms
        that.setData({
          IsPaused: false,
          IsStarted: false,
          TimeStr: "00:00"
        })
      }
      //console.log("Reamined:"+Remained);
      that.ClockProcessing();
    }, 50);
    that.data.timer = timer
  },
  ClockProcessing: function () {
    var DrawingDegree = (this.data.RemainedTime / this.data.SettedTime) * 2 * Math.PI;
    var that = this;
    wx.createSelectorQuery()
      .select('#Progress')
      .fields({
        node: true,
        size: true
      })
      .exec((res) => {
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')
        const width = res[0].width
        const height = res[0].height
        const WindowInfo = wx.getWindowInfo()
        const dpr = WindowInfo.pixelRatio
        canvas.width = width * dpr
        canvas.height = height * dpr
        ctx.scale(dpr, dpr)


        ctx.translate(width / 2, height / 2); //重置原点坐标
        ctx.rotate(-Math.PI / 2); //重置笛卡尔坐标角度


        /////////////////// 灰色背景圆
        ctx.beginPath();
        ctx.arc(0, 0, width / 2 - 18, 0, Math.PI * 2);
        ctx.lineWidth = 10;
        var Gradient_Grey = ctx.createLinearGradient(0, 10, width / 2, height);
        Gradient_Grey.addColorStop("0", "#f0f0f0");
        Gradient_Grey.addColorStop("1.0", "#f1f1f1");
        ctx.strokeStyle = Gradient_Grey;
        ctx.stroke();
        ctx.closePath();
        ////////////////////灰色背景圆

        ////////////////////动态圆

        ctx.beginPath();
        ctx.arc(0, 0, width / 2 - 18, 0, DrawingDegree);
        ctx.lineWidth = 10;
        var Gradient_Green = ctx.createLinearGradient(0, 0, 0, height / 2);
        Gradient_Green.addColorStop("0", "#a3da33");
        Gradient_Green.addColorStop("1.0", "#56B37F");
        ctx.strokeStyle = Gradient_Green;
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(width / 2 - 18, 0, 5, 0, Math.PI * 2);
        ctx.fillStyle = Gradient_Green;
        ctx.fill();
        ctx.closePath();


        ////////////////////动态圆

        /////////////////小纽扣
        ctx.beginPath();
        let Position_x = Math.round(Math.sin(DrawingDegree) * (width / 2 - 18));
        let Position_y = Math.round(Math.cos(DrawingDegree) * (width / 2 - 18));
        this.setData({
          Bud_Position_x: Position_x,
          Bud_Position_y: Position_y,
        })
        //console.log("X:" + Position_x);
        //console.log("Y:" + Position_y);
        //console.log("DrawingDegree:"+DrawingDegree);
        ctx.arc(Position_y, Position_x, 12, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowColor = 'rgba(86,179,127,0.5)';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(Position_y, Position_x, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#56B37F";
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowColor = 'rgba(86,179,127,0.5)';
        ctx.shadowBlur = 14;
        ctx.fill();
        ctx.closePath();
        /////////////////小纽扣


        ////////////
        //ctx.save();
        ctx.rotate(Math.PI / 2);
        ctx.font = '58px 微软雅黑';
        ctx.fillStyle = '#000'
        ctx.fillText(this.data.TimeStr, -ctx.measureText(this.data.TimeStr).width * 0.5, 10);

        ctx.font = '14px 微软雅黑';
        ctx.fillStyle = '#808A87';
        ctx.fillText("剩余时间", -ctx.measureText("剩余时间").width * 0.5, 36);
        ////////////

      })
  },
  Rewarding: function () {

  },
  TouchConvas_Start(e) {
    var that = this;
    wx.createSelectorQuery().select('#Progress').boundingClientRect(function (rect) {
      var Pos_x = e.changedTouches[0].x - that.data.ConvasWidth / 2;
      var Pos_y = e.changedTouches[0].y - that.data.ConvasHeight / 2;
      var Distance = Math.sqrt((that.data.Bud_Position_x - Pos_x) * (that.data.Bud_Position_x - Pos_x) + (-that.data.Bud_Position_y - Pos_y) * (-that.data.Bud_Position_y - Pos_y))
      //console.log("Touch"+Pos_x, Pos_y);
      //console.log("Bud:"+that.data.Bud_Position_x, -that.data.Bud_Position_y);
      //console.log("Distance:"+Distance);
      if (Distance <= 9) {
        that.setData({
          BudSelected: true
        })
      } else {
        that.setData({
          BudSelected: false
        })
      }

    }).exec();
  },
  TouchConvas: function (e) {
    var that = this;
    wx.createSelectorQuery().select('#Progress').boundingClientRect(function (rect) {
      var Pos_x = e.changedTouches[0].x - that.data.ConvasWidth / 2;
      var Pos_y = e.changedTouches[0].y - that.data.ConvasHeight / 2;
      //console.log(Pos_x, Pos_y)
    }).exec();
  },
  ShowNav: function () {
    if (this.data.IsSideNavOpen) {
      this.setData({
        IsSideNavOpen: false,
      })
    } else {
      this.setData({
        IsSideMesOpen: false,
        IsSideNavOpen: true,
        IsCateOpen: false,
      })
    }
  },
  ShowMes: function () {
    if (this.data.IsSideMesOpen) {
      this.setData({
        IsSideMesOpen: false,
      })
    } else {
      this.setData({
        IsSideNavOpen: false,
        IsSideMesOpen: true,
        IsCateOpen: false,
      })
    }
  },
  TapOK: function () {
    var TST = this.data.TimeSettingTemp;
    if (!this.data.IsStarted) {
      this.setData({
        IsCateOpen: false,
        SettedTime: TST,
        RemainedTime: TST,
        TimeStr:TST/60000+":00",
      })
      this.TimeSetting();
      /*
            var I_MinCha = TST / 60000;
            if (I_MinCha >= 60) {
              var P_HourCha = I_MinCha / 60;
              var P_MinCha = I_MinCha % 60;
              if (P_MinCha < 10) {
                P_MinCha = '0' + P_MinCha;
              }
              this.setData({
                TimeStr:P_HourCha+':'+P_MinCha+':'+'00',
              })
            }else{
              this.setData({
                TimeStr:I_MinCha+':'+'00',
              })
            }
      */

    } else {
      wx.showToast({
        title: '正在运行！',
        icon: 'error',
        duration: 1000
      })
      this.setData({
        IsCateOpen: false
      })
    }

  },
  TapCancel: function () {
    this.setData({
      IsCateOpen: false,
    })
  },
  ShowCate: function () {
    if (this.data.IsCateOpen) {
      this.setData({
        IsCateOpen: false,
      })
    } else {
      this.setData({
        IsSideNavOpen: false,
        IsSideMesOpen: false,
        IsCateOpen: true,
      })
    }
  },
  SlideChangeTime: function (e) {
    this.setData({
      TimeSettingTemp: e.detail.value * 60000
    })
  },
  BackToMenu: function () {
    if (this.data.IsSideNavOpen || this.data.IsSideMesOpen || this.data.IsCateOpen) {
      this.setData({
        IsSideNavOpen: false,
        IsSideMesOpen: false,
        IsCateOpen: false,
      })
    }
  },
  GoToSetting: function (events) {
    wx.navigateTo({
      url: '/pages/Setting/Setting',
      events: events,
      success: (result) => {},
      fail: (res) => {},
      complete: (res) => {},
    })
  },
  GoToAbout: function (events) {
    wx.navigateTo({
      url: '/pages/About/About',
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

})
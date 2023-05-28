// pages/index/index.js
const { DownLoadMsgs } = require('../../utils/util.js');
const util = require('../../utils/util.js');
// var timebegin=0;
var lastMoveTime = 0; //全局变量
// var lasttime=0;
// var starttodraw=true;
Page({
  data: {
    SettedTime: 1500000,
    RemainedTime: 50000,
    TimeStr: '25:00',
    timer: null,
    ConvasWidth: 250,
    ConvasHeight: 250,

    IsCateOpen: false,
    IsStarted: false,
    IsPaused: false,
    IsSideNavOpen: false,
    IsSideMesOpen: false,
    IsCateEditOpen: false,
    IsMsgDetailOpen: false,
    MsgDetail_Title:"",
    MsgDetail_Content:"",
    CateEditInputValue: "未命名",
    UserInfo: {},
    HadUserInfo: false,
    TimeSettingTemp: 0,
    Bud_Position_x: 0,
    Bud_Position_y: 0,
    Bud_Degree: 0,
    BudSelected: false,
    Cates: "未分类",
    CateList: [{
        "Name": "学习",
        "Color": "#56aa68"
      },
      {
        "Name": "工作",
        "Color": "#cc6770"
      },
      {
        "Name": "锻炼",
        "Color": "#969696"
      },
      {
        "Name": "休息",
        "Color": "#9b8150"
      },
    ],
    // SettedCateList: [],
    CateCustom: wx.getStorageSync('CateCustom') || [],
    CustomName: "",
    Disturb: 0,
    TimingWay: "NegetiveTiming",
    ToVibrate: wx.getStorageSync('ToVibrate') || true,
    MsgList: [],
    // TimingMode:"Positive"
    // dpr:3,
  },

  onLoad(options) {
    util.Initializing();
    util.DownLoadMsgs();
    util.DownLoadLogs();
    wx.setStorageSync('init', 0);
    // console.log("MsgList缓存内容：");
    // console.log(this.data.CateList);
    // console.log(wx.getStorageSync('Logs'));
    // this.TimeSetting_Static();
    
    
    // this.Rewarding();
  },

  onReady() {
    var that =this
    console.log('convas宽度', that.data.ConvasWidth / 2 - 18)
    this.setData({
      Bud_Position_x: Math.sin((5 / 6) * Math.PI) * (that.data.ConvasWidth / 2 - 24),
      Bud_Position_y: Math.cos((5 / 6) * Math.PI) * (that.data.ConvasWidth / 2 - 24),
      Bud_Degree: (5 / 6) * Math.PI,
      MsgList: wx.getStorageSync('MsgList'),
      ToVibrate: wx.getStorageSync('ToVibrate'),
    })
    // console.log("ToVibrate: "+this.data.ToVibrate);
    //此处无法获取Convas的长度和宽度，不知道是什么原因？
     
     this.TimeSetting_Dynamic();
    var UserInfo = wx.getStorageSync('UserInfo') || [];
    if (UserInfo.length == 0) {
      this.setData({
        HadUserInfo: false,
        UserInfo: UserInfo,
      })
    } else {
      this.setData({
        HadUserInfo: true,
        UserInfo: UserInfo,
      })
      // console.log(UserInfo);
    }
  },
  onShow() {

  },
  onHide() {

  },

  onUnload() {
    this.setData({
      Disturb: this.data.Disturb + 1,
    })
    // console.log(this.data.Disturb)
  },
  onPullDownRefresh() {

  },
  onReachBottom() {

  },
  TimeSetting_Dynamic: function () {
    var that = this;

    // console.log("坐标",this.data.Bud_Position_x,this.data.Bud_Position_y)
    wx.createSelectorQuery()
      .select('#Progress')
      .fields({
        node: true,
        size: true
      })
      .exec((res) => {
        // console.log("res=",res);
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')
        const width = res[0].width;
        const height = res[0].height;
        const WindowInfo = wx.getWindowInfo();
        const dpr = WindowInfo.pixelRatio;

        //修改1
        var degree = (that.data.Bud_Degree);
        // console.log("res[0].height" + res[0].height)
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        ctx.translate(width / 2, height / 2);

        ctx.rotate(-Math.PI / 2);

        ////////////////////动态圆
        // ctx.beginPath();
        // ctx.arc(0, 0, width / 2 - 24, 0, degree);
        // ctx.lineWidth = 10;
        // /*
        // var Gradient_Green = ctx.createLinearGradient(0, 0, 0, height / 2); 
        // Gradient_Green.addColorStop("0", "#a3da33"); 
        // Gradient_Green.addColorStop("1.0", "#56B37F"); 
        // */
        // ctx.strokeStyle = "#a3da33";
        // ctx.stroke();//定时器实现stoke
        // ctx.closePath();

        // ctx.beginPath();
        // ctx.arc(width / 2 - 24, 0, 5, 0, Math.PI * 2);
        // ctx.fillStyle = "#a3da33";
        // ctx.fill();
        // ctx.closePath();
        ////////////////////动态圆

        //此时坐标轴正常，向右为x轴正方向，向上为y轴正方向
        //////////////////小纽扣
        // lasttime=timebegin;
        //   var time=setInterval(function(){

        //     timebegin=timebegin+25;
        //     if(timebegin-lasttime>=25)
        //     {
        //         starttodraw=1;
        //     }
        //     // that.TimeSetting_Dynamic();
        // },25)

        //每25ms刷新一次这个用定时器的方法失败了
        // if(starttodraw==true)
        // {

        /////////////////// 灰色背景圆
        ctx.beginPath();
        ctx.arc(0, 0, width / 2 - 24, 0, Math.PI * 2);
        ctx.lineWidth = 10;
        ctx.shadowBlur = 2;
        ctx.strokeStyle = "#f0f0f0";
        ctx.stroke();
        ctx.closePath();
        ////////////////////灰色背景圆 

        ctx.beginPath();
        ctx.arc(0, 0, width / 2 - 24, 0, degree);
        ctx.lineWidth = 10;
        /*
        var Gradient_Green = ctx.createLinearGradient(0, 0, 0, height / 2); 
        Gradient_Green.addColorStop("0", "#a3da33"); 
        Gradient_Green.addColorStop("1.0", "#56B37F"); 
        */
       //动态园
        ctx.strokeStyle = "#a3da33";
        ctx.stroke(); //定时器实现stoke
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(width / 2 - 24, 0, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#a3da33";
        ctx.fill();
        ctx.closePath();
        // starttodraw=0;
        // clearInterval(time);
        //动态园


        /////////////////小纽扣
        ctx.beginPath();
        let Position_x = Math.round(Math.sin(degree) * (width / 2 - 20));
        let Position_y = Math.round(Math.cos(degree) * (width / 2 - 20));
        this.setData({
          Bud_Position_x: Position_x,
          Bud_Position_y: Position_y,
        })
        ctx.arc(Position_y, Position_x, 12, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowColor = 'rgba(86,179,127,0.5)';
        ctx.shadowBlur = 8;
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

        ctx.font = '12px 微软雅黑';
        ctx.fillStyle = '#808A87';
        ctx.fillText("60", -ctx.measureText("60").width / 2, -(height / 2) + 10);

        ctx.font = '12px 微软雅黑';
        ctx.fillStyle = '#808A87';
        ctx.fillText("15", width / 2 - ctx.measureText("30").width, 0);

        ctx.font = '12px 微软雅黑';
        ctx.fillStyle = '#808A87';
        ctx.fillText("30", -ctx.measureText("30").width / 2, height / 2);

        ctx.font = '12px 微软雅黑';
        ctx.fillStyle = '#808A87';
        ctx.fillText("45", -width / 2, 0);
        // }

      })
  },
  TimeSetting_Static: function () {
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
        const width = res[0].width;
        const height = res[0].height;
        const WindowInfo = wx.getWindowInfo();
        const dpr = WindowInfo.pixelRatio;
        that.setData({
          dpr: dpr,
          ConvasHeight: res[0].height,
          ConvasWidth: res[0].width
        })
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        ctx.translate(width / 2, height / 2);
        ctx.beginPath();
        ctx.arc(0, 0, width / 2 - 18, 0, Math.PI * 2);
        ctx.lineWidth = 10;
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "#f0f0f0";
        ctx.stroke();
        ctx.closePath();
      })
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
  onShareTimeline() {
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
    // var that=this;
    wx.getUserProfile({
      desc: 'Only A Test Now',
      lang: 'zh_CN',
      success: (result) => {
        this.setData({
          UserInfo: result.userInfo,
          HadUserInfo: true
        })
        wx.setStorageSync('UserInfo', result.userInfo);
        //console.log(result)
        // console.log(result.userInfo)
      },
      fail: (res) => {},
      complete: (res) => {},
    })
  },
  Start: function () {
    var Setted = this.data.SettedTime;
    // console.log(this.data.TimingWay);

    if (this.data.TimingWay == "NegetiveTiming" || this.data.TimingWay == "") {
      this.setData({
        RemainedTime: Setted,
        IsStarted: true,
        IsCateOpen: false,
        IsSideNavOpen: false,
      })
      this.Timer();
    } else {
      console.log("正计时!");
      this.setData({
        IsStarted: true,
        IsCateOpen: false,
        IsSideNavOpen: false,
        RemainedTime: 0,
      })
      this.Timer();
    }

  },
  GiveUp: function () {
    this.setData({
      IsStarted: false,
      Bud_Degree: (5 / 6) * Math.PI,
      Bud_Position_x: Math.sin((5 / 6) * Math.PI) * (this.data.ConvasWidth / 2 - 18),
      Bud_Position_y: Math.cos((5 / 6) * Math.PI) * (this.data.ConvasWidth / 2 - 18),
      SettedTime: 1500000,
      RemainedTime: 10000,
      TimeStr: "25:00",
    })
    this.TimeSetting_Dynamic();
    clearInterval(this.data.timer);
  },
  Timer: function () {
    var that = this; //存储代码所在子函数的环境
    /*这里注意在setInterval这个回调函数里面的this指的是定时器的作用域，不是外面的函数或者页面的作用域 */
    // var Setted = this.data.SettedTime;
    if (this.data.TimingWay == "NegetiveTiming" || this.data.TimingWay == "") {
      var timer_n = setInterval(function () {
        var Remained = that.data.RemainedTime - 1000;
        that.setData({
          RemainedTime: Remained,
        });
        //console.log(Remained);
        if (Remained > 0) {
          if (Remained % 1000 == 0) {
            var I_SecendCha = Remained / 1000; // Initial Seconed Character 总秒数 未进位秒数
            var I_MinuteCha = parseInt(I_SecendCha / 60) // 总分钟数
            var P_SecendCha = (I_SecendCha - I_MinuteCha * 60) >= 10 ? (I_SecendCha - I_MinuteCha * 60) : '0' + (I_SecendCha - I_MinuteCha * 60); //秒数是否超过10，没超过就要加0 补上字符空缺
            var P_MinuteCha = I_MinuteCha >= 10 ? I_MinuteCha : '0' + I_MinuteCha;
            that.setData({
              TimeStr: P_MinuteCha + ':' + P_SecendCha
            })
          }
        } else {
          clearInterval(timer_n);
          if (that.data.ToVibrate) {
            wx.vibrateLong(); // 使手机震动400ms
          } else {
            wx.showModal({
              title: '计时完成',
              content: '已禁用了震动'
            })
          }
          that.Rewarding();
          that.setData({
            IsPaused: false,
            IsStarted: false,
            TimeStr: "00:00"
          })
        }
        //console.log("Reamined:"+Remained);
        that.ClockProcessing();
      }, 1000);
      that.data.timer = timer_n
    } else {
      var timer_p = setInterval(function () {
        var Remained = that.data.RemainedTime + 1000;
        that.setData({
          RemainedTime: Remained,
        });
        if (Remained > 0) {
          if (Remained % 1000 == 0) {
            var I_SecendCha = Remained / 1000; // Initial Seconed Character 总秒数 未进位秒数
            var I_MinuteCha = parseInt(I_SecendCha / 60) // 总分钟数
            var P_SecendCha = (I_SecendCha - I_MinuteCha * 60) >= 10 ? (I_SecendCha - I_MinuteCha * 60) : '0' + (I_SecendCha - I_MinuteCha * 60); //秒数是否超过10，没超过就要加0 补上字符空缺
            var P_MinuteCha = I_MinuteCha >= 10 ? I_MinuteCha : '0' + I_MinuteCha;
            that.setData({
              TimeStr: P_MinuteCha + ':' + P_SecendCha
            })
            if (I_MinuteCha > 60) {
              that.setData({
                IsStarted: false,
                TimeStr: "60:00",
              });
              console.log("已超过60分钟！");
              clearInterval(timer);
            }
          }
        } else {
          console.warn("Critical Error!");
        }
        that.ClockProcessing();
      }, 1000);
      that.data.timer = timer_p;
    }
  },

  //動態繪圖
  ClockProcessing: function () {
    if (this.data.TimingWay == "NegetiveTiming" || this.data.TimingWay == "") {
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
          /*
          var Gradient_Grey = ctx.createLinearGradient(0, 10, width / 2, height);
          Gradient_Grey.addColorStop("0", "#f0f0f0");
          Gradient_Grey.addColorStop("1.0", "#f1f1f1");
          */
          ctx.shadowBlur = 2;
          ctx.strokeStyle = "#f0f0f0";
          ctx.stroke();
          ctx.closePath();
          ////////////////////灰色背景圆 

          ////////////////////动态圆
          ctx.beginPath();
          ctx.arc(0, 0, width / 2 - 18, 0, DrawingDegree);
          ctx.lineWidth = 10;
          /*
          var Gradient_Green = ctx.createLinearGradient(0, 0, 0, height / 2);
          Gradient_Green.addColorStop("0", "#a3da33");
          Gradient_Green.addColorStop("1.0", "#56B37F");
          */
          ctx.strokeStyle = "#a3da33";
          ctx.stroke();
          ctx.closePath();

          ctx.beginPath();
          ctx.arc(width / 2 - 18, 0, 5, 0, Math.PI * 2);
          ctx.fillStyle = "#a3da33";
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
          ctx.rotate(Math.PI / 2);
          ctx.font = '58px 微软雅黑';
          ctx.fillStyle = '#000'
          ctx.fillText(this.data.TimeStr, -ctx.measureText(this.data.TimeStr).width * 0.5, 10);

          ctx.font = '14px 微软雅黑';
          ctx.fillStyle = '#808A87';
          ctx.fillText("剩余时间", -ctx.measureText("剩余时间").width * 0.5, 36);
          ////////////
        })
    } else {
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

          ////////////////////绿色圆
          ctx.beginPath();
          ctx.arc(0, 0, width / 2 - 18, 0, 2 * Math.PI);
          ctx.lineWidth = 10;
          /*
          var Gradient_Green = ctx.createLinearGradient(0, 0, 0, height / 2);
          Gradient_Green.addColorStop("0", "#a3da33");
          Gradient_Green.addColorStop("1.0", "#56B37F");
          */
          ctx.strokeStyle = "#a3da33";
          ctx.stroke();
          ctx.closePath();

          ctx.beginPath();
          ctx.arc(width / 2 - 18, 0, 5, 0, Math.PI * 2);
          ctx.fillStyle = "#a3da33";
          ctx.fill();
          ctx.closePath();
          ////////////////////绿色圆

          ////////////
          ctx.rotate(Math.PI / 2);
          ctx.font = '58px 微软雅黑';
          ctx.fillStyle = '#000'
          ctx.fillText(this.data.TimeStr, -ctx.measureText(this.data.TimeStr).width * 0.5, 10);

          ctx.font = '14px 微软雅黑';
          ctx.fillStyle = '#808A87';
          ctx.fillText("专注时长", -ctx.measureText("专注时长").width * 0.5, 36);
          ////////////
        })
    }

  },
  Rewarding: function () {
    var that = this;
    var log = wx.getStorageSync('Logs') || [];
    var LogsColor = "";
    if (this.data.Cates == "学习") {
      LogsColor = "#56aa68";
    } else if (this.data.Cates == "工作") {
      LogsColor = "#cc6770";
    } else if (this.data.Cates == "锻炼") {
      LogsColor = "#969696";
    } else if (this.data.Cates == "休息") {
      LogsColor = "#9b8150";
    } else if (this.data.Cates == "未分类") {
      LogsColor = "#b4b4b4";
    }
    if (this.data.TimingWay == "NegetiveTiming" || this.data.TimingWay == "") {
      log.unshift({
        Date: util.formatTime(new Date),
        Cate: that.data.Cates,
        Time: that.data.SettedTime / (1000 * 60),
        Dist: 0,
        Way: "Negetive",
        Index: log.length,
        DisplayColor: LogsColor,
      })
    } else if (this.data.TimingWay == "PositiveTiming") {
      log.unshift({
        Date: util.formatTime(new Date),
        Cate: that.data.Cates,
        Time: that.data.RemainedTime / (1000 * 60),
        Dist: 0,
        Way: "Positive",
        Index: log.length,
        DisplayColor: LogsColor,
      })
    }

    wx.setStorageSync('Logs', log);
    util.UpLoadLogs();
    // console.log(log);
  },
  TouchConvas_Start(e) {
    // console.log(e);
    if (!this.data.IsStarted) {
      var that = this;
      wx.createSelectorQuery().select('#Progress').boundingClientRect(function (rect) {
        // console.log("角度=",rect)
        var Pos_x = (e.changedTouches[0].x - that.data.ConvasWidth / 2).toFixed(1);
        var Pos_y = (e.changedTouches[0].y - that.data.ConvasHeight / 2).toFixed(1);
        var Distance = Math.sqrt((that.data.Bud_Position_x - Pos_x) * (that.data.Bud_Position_x - Pos_x) + (-that.data.Bud_Position_y - Pos_y) * (-that.data.Bud_Position_y - Pos_y))
        //好烦好烦，Y轴反了，强迫症犯了啊啊啊啊啊！
        //之后维护不看这里了！！！
        // console.log("Touch"+Pos_x, Pos_y);
        //console.log("Bud:"+that.data.Bud_Position_x, that.data.Bud_Position_y);
        //console.log("Distance:"+Distance);
        if (Distance < 30) {
          that.setData({
            BudSelected: true
          })
        } else {
          that.setData({
            BudSelected: false
          })
        }
      }).exec();
    }
  },
  TouchConvas: function (e) {
    //最耗性能touchmove及其浮点计算还有绘制过程
    // console.log(e);
    //---利用视觉暂留现象解决之---
    let nowtime = Date.now();
    // console.log(nowtime);//精确到毫秒
    let duration = nowtime - lastMoveTime; //全局
    if (duration < Math.floor(1000 / 60)) return; //向下取整每秒显示60次 核心步骤
    lastMoveTime = nowtime;
    if (this.data.BudSelected && !this.data.IsStarted) {
      var that = this;
      var Pos_x = e.changedTouches[0].x - that.data.ConvasWidth / 2;
      var Pos_y = e.changedTouches[0].y - that.data.ConvasHeight / 2;
      var Radius = Math.sqrt(Pos_x * Pos_x + Pos_y * Pos_y);
      var ratio = (that.data.ConvasWidth / 2 - 20) / Radius;
      var Bud_Pos_x = Pos_x * ratio;
      var Bud_Pos_y = Pos_y * ratio;
      var Degree = 0;

      if (Bud_Pos_x > 0 && -Bud_Pos_y > 0) {
        Degree = Math.atan(-Pos_x / Pos_y);

      } else if (Bud_Pos_x > 0 && -Bud_Pos_y < 0) {
        Degree = -Math.atan(Pos_x / Pos_y) + Math.PI;

      } else if (Bud_Pos_x < 0 && -Bud_Pos_y < 0) {
        Degree = Math.atan(-Pos_x / Pos_y) + Math.PI;

      } else if (Bud_Pos_x < 0 && -Bud_Pos_y > 0) {
        Degree = Math.atan(-Pos_x / Pos_y) + Math.PI * 2;

      }
      console.log(that.data.Bud_Degree)
      // var timeset=((that.data.Bud_Degree / Math.PI) * 30).toFixed(0) * 60 * 1000
      // if(timeset==0)
      // {
      //   timeset==
      // }
      // if (Math.abs(Math.PI / 60 - (Degree) % (Math.PI / 6)) <= 0.33) { //调大一点容错率高
        that.setData({
          Bud_Position_x: Bud_Pos_x,
          Bud_Position_y: -Bud_Pos_y,
          Bud_Degree: Degree.toFixed(2),
          SettedTime:  ((that.data.Bud_Degree / Math.PI) * 30).toFixed(0) * 60 * 1000, //本来是五分钟改成1分钟
          TimeStr: ((that.data.Bud_Degree / Math.PI) * 30).toFixed(0) * 1 + ":00" //本来是5分钟改成1分钟
        })
        that.TimeSetting_Dynamic();
      // }
    }
  },
  TouchConvas_End: function () {
    this.setData({
      BudSelected: false,
    })
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
        IsMsgDetailOpen: false,
        // IsCateEditOpen:false,
      })
    }
  },
  ShowMes: function () {
    if (this.data.IsSideMesOpen) {
      this.setData({
        IsSideMesOpen: false,
        IsMsgDetailOpen: false,
      })
    } else {
      this.setData({
        IsSideNavOpen: false,
        IsSideMesOpen: true,
        IsCateOpen: false,
        IsMsgDetailOpen: false,
      })
    }
    // DownLoadMsgs();
  },
  TapCateItems: function (e) {
    // console.log(e.target);
    if (this.data.Cates == e.target.id) {
      this.setData({
        Cates: "未分类"
      })
    } else {
      this.setData({
        Cates: e.target.id
      })
    }
    // console.log(this.data.Cates);

  },
  TapAddCates: function () {
    this.setData({
      IsCateEditOpen: true
    })
  },
  CateEditContents: function (e) {
    // console.log(e.detail.value);
    this.setData({
      CustomName: e.detail.value,
      CateEditInputValue:e.detail.value,
    })
    // console.log(this.data.CustomName);
  },
  SendEditContents: function () {
    var CustomList = this.data.CateCustom;
    var CustomName = this.data.CustomName;
    var RandomTemp = Math.floor(Math.random() * 1000000);
    var RandomColor = "#" + RandomTemp.toString();
    if (this.data.CustomName == "") {
      this.setData({
        CustomName: "新标签",
      })
    }
    // console.log(RandomTemp,RandomColor);
    for (let i = 0; i < CustomList.length; i++) {
      if (CustomName == CustomList[i].Name) {
        wx.showToast({
          title: '名称重复',
          duration: 1000,
          icon: 'error',
          mask: true,
          success: (res) => {},
          fail: (res) => {},
          complete: (res) => {},
        })
        return 0;
      }
    }
    CustomList.push({
      "Name": this.data.CustomName,
      "Color": RandomColor,
    })
    // console.log(CustomList);
    this.setData({
      CateCustom: CustomList,
      IsCateEditOpen: false,
      CateEditInputValue: "",
    })
    wx.setStorageSync('CateCustom', CustomList);
  },
  TimingWay: function (e) {
    // console.log(e.target.id);
    this.setData({
      TimingWay: e.target.id
    })
  },
  TapCancel: function () {
    this.setData({
      IsCateOpen: false,
    })
  },
  MsgDetails: function (e) {
    // console.log(e.target.id);
    var TapOrder = e.target.id;
    var TempMsg = wx.getStorageSync('MsgList');
    console.log(TempMsg[TapOrder].Contents);
    // wx.showModal({
    //   title: TempMsg[TapOrder].Title,
    //   content: TempMsg[TapOrder].Contents,
    //   showCancel: false,
    //   confirmText: "了解",
    // })
    this.setData({
      MsgDetail_Title:TempMsg[TapOrder].Title,
      MsgDetail_Content:TempMsg[TapOrder].Contents,
      IsMsgDetailOpen: true,
    })
  },
  ShowCate: function () {
    if (!this.data.IsStarted) {
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
    }

  },
  ////////////////////////////////////////////////////////////////
  // SlideChangeTime: function (e) {
  //   this.setData({
  //     TimeSettingTemp: e.detail.value * 60000
  //   })
  // },
  ///////////////////////////////////////////////////////////////
  ClickMsgCenterExit:function(){
    this.setData({
      IsMsgDetailOpen: false,
    })
  },
  BackToMenu: function () {
    if (this.data.IsSideNavOpen || this.data.IsSideMesOpen || this.data.IsCateOpen) {
      this.setData({
        IsSideNavOpen: false,
        IsSideMesOpen: false,
        IsCateOpen: false,
        IsCateEditOpen: false,
        IsMsgDetailOpen: false,
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
  GoToDetailLogs: function (events) {
    wx.navigateTo({
      url: '/pages/DetailLogs/DetailLogs',
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
  GoToTomato: function (events) {
    wx.navigateTo({
      url: '/pages/Tomatoes/Tomatoes',
      events: events,
      success: (result) => {},
      fail: (res) => {},
      complete: (res) => {},
    })
  },
  textnickname: function () {
    var init = wx.getStorageSync('init')
    console.log(init);
    if (init == 0) {
      util.UpLoadLogs();
      wx.setStorageSync('init', 1);
    }
    wx.cloud.callFunction({
      name: "getOpenId",
      success(res) {
        // 授权用户的openid
        //console.log("看看云函数GETOPENID",res);
        let openId = res.result.openid
        // 判断openid是否存在于数据库
        wx.cloud.database().collection('PomodoroUsers').where({
          _openid: openId
        }).get().then(ress => {
          // 判断返回的data长度是否为0，如果为0的话就证明数据库中没有该openid然后进行添加缓存操作
          console.log("indexNickname判断测试获取数据", ress); //where方法
          
          if (ress.data.length==0) { //如果没有注册且沒有使用//如果新用户数据库为空（没有rewarding存档）
            
            wx.navigateTo({
              url: '/pages/develop/getname',

              success: (result) => {},
              fail: (res) => {},
              complete: (res) => {},
            })
            // 用户已经存在
          } else if(ress.data[0].IsRank==false){//已使用但是沒有暱稱
            // console.log("调到")
              wx.navigateTo({
              url: '/pages/develop/getname',
              success: (result) => {},
              fail: (res) => {},
              complete: (res) => {},
            })
          }
          else{//已經註冊暱稱
              wx.navigateTo({
              url: '/pages/develop/developmaker',
              success: (result) => {},
              fail: (res) => {},
              complete: (res) => {},
            })

          }
        })
      },
      fail(res) {
        console.log("云函数GETOPENID调用失败")
      }
    })
  },
  developMaker: function (events) {
    //判断openid是否存在昵称 如果存在那么直接调到登录界面  不存在那么调到昵称界面
    this.textnickname()
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
          wx.setStorageSync('UserInfo', []);
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
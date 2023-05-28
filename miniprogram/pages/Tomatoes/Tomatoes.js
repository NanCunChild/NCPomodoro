import * as echarts from '../../ec-canvas/echarts.js';
const util = require('../../utils/util.js');

Page({
  data: {
    LogsDisplay: [],
    WeekAli_Block: [],
    WholeDayList: [],
    ToToDayList: [],
    RestDayList: [], 
 
    ToDay: 0,
    Now_Year: "",
    Now_Month: "",
    Now_Day: "",
    TotalDays: 0,
    CurrentDay: 1,

    DetailBoxX: 0,
    DetailBoxY: 0,
    DetailBoxStyle: "",
    ShowDetailBox: false,
    DateOffset: 1,

    ecComponent: null,
    chart: null,
    ec: {
      lazyLoad: true,
    },
    option: {
      title: {
        text: '本月情况',
        left: 'center'
      },
      legend: {
        data: ['学习', '工作', '锻炼', '休息'],
        top: 50,
        left: 'center',
        z: 100
      },
      grid: {
        containLabel: true
      },
      tooltip: {
        show: true,
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        show: false,
      },
      yAxis: {
        x: 'center',
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dashed' 
          }
        }
        // show: false
      },
      series: [{
          name: '学习',
          type: 'line',
          smooth: true,
          data: [],
        }, {
          name: '工作',
          type: 'line',
          smooth: true,
          data: [],
        },
        {
          name: '锻炼',
          type: 'line',
          smooth: true,
          data: [],
        },
        {
          name: '休息',
          type: 'line',
          smooth: true,
          data: [],
        }
      ]
    },

    Status: [
      "熬夜中",
      "学习中",
      "工作中",
      "繁忙。。。",
      "emo中",
      "摸鱼中",
      "嗨翻了",
      "睡觉中",
      "干饭中",
    ],
  },
  onLoad() {
    this.ecComponent = this.selectComponent('#LogsChart');
    this.DateProcess();
    // this.EChartDataReformer();
  }, 
  onReady: function () {

  },
  onShow: function () {

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
  onPullDownRefresh() {
    wx.showNavigationBarLoading();
    util.DownLoadLogs();
    // this.EChartDataReformer();
    this.onLoad();
    setTimeout(() => {
      wx.hideNavigationBarLoading();
    }, 1500)

  },
  DateProcess: function () {
    var that = this;
    var DateOffset = this.data.DateOffset;
    var WeekAli_Block = [];
    var WholeDayList = [];
    var ToToDayList = [];
    var ToDay = 0;
    var RestDayList = [];
    var WeekAli_BlockNum = 0;
    var I_FirstDay = new Date(new Date().getFullYear(), new Date().getMonth() + DateOffset, 1);
    var P_FirstDay = I_FirstDay.toString().substring(0, 3);
    var WI_Days = new Date(new Date().getFullYear(), new Date().getMonth() + DateOffset, 0); //本年本月总共天数（处理前）
    var WP_Days = WI_Days.toString().substring(8, 10); //处理后，只余下天数
    var TI_Days = new Date(); //今日
    var TP_Days = TI_Days.toString().substring(8, 10); //处理后，今天是几号
    var Now_Year = WI_Days.toString().substring(11, 15);
    var Now_Month = util.formatTime(WI_Days).toString().substring(5, 7); //使用util中的函数就可以显示数字而不是月份英文了

    if (P_FirstDay == "Mon") WeekAli_BlockNum = 0;
    else if (P_FirstDay == "Tue") WeekAli_BlockNum = 1;
    else if (P_FirstDay == "Wed") WeekAli_BlockNum = 2;
    else if (P_FirstDay == "Thu") WeekAli_BlockNum = 3;
    else if (P_FirstDay == "Fri") WeekAli_BlockNum = 4;
    else if (P_FirstDay == "Sat") WeekAli_BlockNum = 5;
    else if (P_FirstDay == "Sun") WeekAli_BlockNum = 6;

    // console.log(P_FirstDay);
    // console.log(WeekAli_BlockNum);
    // console.log(util.formatTime(WI_Days).toString());
    // console.log(Now_Month);
    // console.log(Now_Year,Now_Month);

    for (var i = 1; i <= parseInt(WP_Days); i++) {
      WholeDayList.push(i); //总天数
    }
    for (var i = 1; i < parseInt(TP_Days); i++) {
      ToToDayList.push(i); //从1号到今日
    }
    for (var i = parseInt(TP_Days) + 1; i <= WP_Days; i++) {
      RestDayList.push(i); //从今日到最后一日
    }
    for (var i = 0; i < WeekAli_BlockNum; i++) {
      WeekAli_Block.push(i);
    }
    ToDay = TP_Days; //今天
    // console.log(WeekAli_Block);
    that.setData({
      ToToDayList: ToToDayList,
      WholeDayList: WholeDayList,
      RestDayList: RestDayList,
      WeekAli_Block: WeekAli_Block,
      ToDay: ToDay,
      TotalDays: WP_Days,
      Now_Day: TP_Days,
      Now_Month: Now_Month,
      Now_Year: Now_Year,
    })
    // console.log(WP_Days); 
    // console.log(TP_Days); 
    // console.log(ToToDayList); 
    // console.log(WholeDayList); 
    // console.log(RestDayList); 
  },
  TapLeftArrow: function () {
    this.setData({
      DateOffset: this.data.DateOffset - 1,
    })
    this.DateProcess();
  },
  TapRightArrow: function () {
    this.setData({
      DateOffset: this.data.DateOffset + 1,
    })
    this.DateProcess();
  },
  CircleIt: function (e) {
    var CurrentDay = e.currentTarget.id;
    var ClickX = e.detail.x + 200;
    var ClickY = e.detail.y + 180;
    if (ClickX >= 380) ClickX = 380;
    // console.log(e.currentTarget.id);
    this.setData({
      CurrentDay: CurrentDay,
      ShowDetailBox: true,
      DetailBoxStyle: 'left:' + ClickX + 'rpx;' + ' top:' + ClickY + 'rpx;',
    })
    // console.log(this.data.DetailBoxStyle);
    this.ShowDetails();
    // this.EChartDataReformer();
  },
  CloseDetailBox: function () {
    this.setData({
      ShowDetailBox: false,
    })
  },
  EChartDataReformer: function () {
    var Logs = wx.getStorageSync('Logs') || [];
    var ToDay = parseInt(new Date().toString().substring(8, 10));
    var All_Logs_List = [];
    var Study_All = [];
    var Work_All = [];
    var Exercise_All = [];
    var Rest_All = [];
    var Other_All = [];
    var Study_Reformed = [];
    var Work_Reformed = [];
    var Exercise_Reformed = [];
    var Rest_Reformed = [];
    var Other_Reformed = [];
    // console.log(ToDay);
    for (let i = 0; i < Logs.length; i++) {
      if (Logs[i].Cate == "学习") {
        Study_All.push({
          Date_Year: parseInt(Logs[i].Date.toString().substring(0, 4)),
          Date_Month: parseInt(Logs[i].Date.toString().substring(5, 7)),
          Date_Day: parseInt(Logs[i].Date.toString().substring(8, 10)),
          Time: Logs[i].Time,
        })
      } else if (Logs[i].Cate == "工作") {
        Work_All.push({
          Date_Year: parseInt(Logs[i].Date.toString().substring(0, 4)),
          Date_Month: parseInt(Logs[i].Date.toString().substring(5, 7)),
          Date_Day: parseInt(Logs[i].Date.toString().substring(8, 10)),
          Time: Logs[i].Time,
        })
      } else if (Logs[i].Cate == "锻炼") {
        Exercise_All.push({
          Date_Year: parseInt(Logs[i].Date.toString().substring(0, 4)),
          Date_Month: parseInt(Logs[i].Date.toString().substring(5, 7)),
          Date_Day: parseInt(Logs[i].Date.toString().substring(8, 10)),
          Time: Logs[i].Time,
        })
      } else if (Logs[i].Cate == "休息") {
        Rest_All.push({
          Date_Year: parseInt(Logs[i].Date.toString().substring(0, 4)),
          Date_Month: parseInt(Logs[i].Date.toString().substring(5, 7)),
          Date_Day: parseInt(Logs[i].Date.toString().substring(8, 10)),
          Time: Logs[i].Time,
        })
      } else {
        Other_All.push({
          Date_Year: parseInt(Logs[i].Date.toString().substring(0, 4)),
          Date_Month: parseInt(Logs[i].Date.toString().substring(5, 7)),
          Date_Day: parseInt(Logs[i].Date.toString().substring(8, 10)),
          Time: Logs[i].Time,
        })
      }
    }
    Study_Reformed.push(0);
    Work_Reformed.push(0);
    Rest_Reformed.push(0);
    Exercise_Reformed.push(0);
    Other_Reformed.push(0);
    Study_Reformed[0]=null;
    Work_Reformed[0]=null;
    Rest_Reformed[0]=null;
    Exercise_Reformed[0]=null;
    Other_Reformed[0]=null;
    //第一个老是显示为0，只好用蠢办法
    var Front = ToDay < 7 ? 1 : ToDay - 6;
    // console.log(Front);
    for (let i = 1; i <= ToDay; i++) {
      let OneDayTime = 0;
      let OneDayTime_1 = 0;
      let OneDayTime_2 = 0;
      let OneDayTime_3 = 0;
      let OneDayTime_4 = 0;
      for (let j = 0; j < Study_All.length; j++) {
        if (Study_All[j].Date_Year == parseInt(this.data.Now_Year) && Study_All[j].Date_Month == parseInt(this.data.Now_Month) && Study_All[j].Date_Day == i) {
          OneDayTime += Study_All[j].Time;
        }
      }
      Study_Reformed.push(
        OneDayTime
      )

      for (let j = 0; j < Work_All.length; j++) {
        if (Work_All[j].Date_Year == parseInt(this.data.Now_Year) && Work_All[j].Date_Month == parseInt(this.data.Now_Month) && Work_All[j].Date_Day == i) {
          OneDayTime_1 += Work_All[j].Time;
        }
      }
      Work_Reformed.push(
        OneDayTime_1
      )

      for (let j = 0; j < Exercise_All.length; j++) {
        if (Exercise_All[j].Date_Year == parseInt(this.data.Now_Year) && Exercise_All[j].Date_Month == parseInt(this.data.Now_Month) && Exercise_All[j].Date_Day == i) {
          OneDayTime_2 += Exercise_All[j].Time;
        }
      }
      Exercise_Reformed.push(
        OneDayTime_2
      ) 

      for (let j = 0; j < Rest_All.length; j++) {
        if (Rest_All[j].Date_Year == parseInt(this.data.Now_Year) && Rest_All[j].Date_Month == parseInt(this.data.Now_Month) && Rest_All[j].Date_Day == i) {
          OneDayTime_3 += Rest_All[j].Time;
        }
      }
      Rest_Reformed.push(
        OneDayTime_3
      )

      for (let j = 0; j < Other_All.length; j++) {
        if (Other_All[j].Date_Year == parseInt(this.data.Now_Year) && Other_All[j].Date_Month == parseInt(this.data.Now_Month) && Other_All[j].Date_Day == i) {
          OneDayTime_4 += Other_All[j].Time;
        }
      }
      Other_Reformed.push(
        OneDayTime_4
      )
    }
    All_Logs_List.push({
      Study_Reformed,
      Work_Reformed,
      Exercise_Reformed,
      Rest_Reformed,
      Other_Reformed,
    })

    // console.log(All_Logs_List);
    this.chartInit(All_Logs_List);
    // console.log(Logs);
    // console.log(Study_All);
    // console.log(Work_All);
    // console.log(Rest_All);
    // console.log(Study_Reformed);
    // console.log(Work_Reformed);
    // console.log(Rest_Reformed);

    // this.setData({
    //   Logs_StudyList: Study_Reformed,
    //   Logs_WorkList: Work_Reformed,
    //   Logs_RestList: Rest_Reformed,
    // })

    // console.log(typeof(this.data.Now_Month));
  },

  // chartInit(LogsList) {
  //   const that = this;
  //   if (!that.ecComponent) return wx.showToast({
  //     icon: "error",
  //     title: '初始化错误',
  //   });
  //   // console.log(LogsList);

  //   that.ecComponent.init((canvas, width, height, dpr) => {
  //     // 获取组件的 canvas、width、height 后的回调函数
  //     // 在这里初始化图表
  //     const chart = echarts.init(canvas, null, {
  //       width: width,
  //       height: height,
  //       devicePixelRatio: dpr // new
  //     });

  //     // 模拟请求接口
  //     setTimeout(() => {
  //       that.data.option.series[0].data = LogsList[0].Study_Reformed;
  //       that.data.option.series[1].data = LogsList[0].Work_Reformed;
  //       that.data.option.series[2].data = LogsList[0].Exercise_Reformed;
  //       that.data.option.series[3].data = LogsList[0].Rest_Reformed;
  //       // that.data.option.series[4].data = LogsList[0].Other_Reformed;
  //       let option = JSON.parse(JSON.stringify(that.data.option));
  //       chart.setOption(option);
  //     }, 200)

  //     // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
  //     that.chart = chart;
  //     // console.log(chart);

  //     // 注意这里一定要返回 chart 实例，否则会影响事件处理等
  //     return chart;
  //   });
  // },

  ShowDetails: function (CD) {
    var Logs = wx.getStorageSync('Logs') || [];
    var LogsDisplay = [];
    // console.log(Logs);
    for (var i = 0; i < Logs.length; i++) {
      // console.log(Logs[i].Date);
      var TargetMonth = Logs[i].Date.toString().substring(5, 7); //Log中的日期，月份
      var TargetDay = Logs[i].Date.toString().substring(8, 10); //Log中的日期，天
      // console.log(TargetMonth,TargetDay)
      // console.log(parseInt(this.data.CurrentDay),parseInt(TargetDay),parseInt(this.data.Now_Month),parseInt(TargetMonth))
      // console.log(typeof(this.data.CurrentDay))
      if (parseInt(TargetDay) == parseInt(this.data.CurrentDay) && TargetMonth == this.data.Now_Month || parseInt(this.data.CurrentDay) == 32 && parseInt(TargetDay) == this.data.Now_Day && TargetMonth == this.data.Now_Month) {
        //CurrentDay是目前选中日，即Log数据的日期和当前选中日期重合即满足
        //但是CurrentDay选中当前日期时会为32，因此特殊考虑
        //之前忘记了，判断相等要改为数字类型
        LogsDisplay.push({
          Date: Logs[i].Date.toString().substring(11, 16),
          Cate: Logs[i].Cate,
          Time: Logs[i].Time,
          Dist: Logs[i].Dist,
        })
      }
    }
    this.setData({
      LogsDisplay: LogsDisplay
    })
  },
});
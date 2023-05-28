import * as echarts from '../../ec-canvas/echarts.js';
const util = require('../../utils/util.js');
Page({
  data: {
    Logs: wx.getStorageSync('Logs'),
    Now_Year: "",
    Now_Month: "",
    Date_Day: "",
    ecComponent_Cate: null,
    ecComponent_Time: null,
    chart_Cate: null, // 用来保存 echarts 实例的引用
    chart_Time: null,
    CatePie: {
      // onInit: initChart, 
      // 使用或不使用 onInit: initChart 都是可以的，因为这里使用的是懒加载模式，即图表组件只有在被显示时才会被初始化。所以如果不使用 onInit，则需要在显示图表之前手动调用 initChart 方法进行初始化。这个页面使用了CateData之后就会调用initChart，所以可以不调用。
      lazyLoad: true, // 懒加载，可以推迟 echarts 组件的加载，当 ec-canvas 组件真正被渲染到页面上时再进行 echarts 的初始化和渲染，从而提高页面的加载速度和流畅度。
    },
    TimeGraph: {
      lazyLoad: true,
    },
    option_Cate: { //写死的格式，不能动格式框架
      backgroundColor: "#f5f5f5",
      title: {
        text: '本月情况分类图',
        left: 'center'
      },
      legend: {
        data: ['学习', '工作', '锻炼', '休息', '其它'],
        top: 50,
        left: 'center',
      },
      grid: {
        containLabel: true
      },
      series: [{
        label: {
          formatter: '{b}:{c}: ({d}%)',
          normal: {
            fontWeight: 'normal',
            fontSize: 14
          }
        },
        labelLine: {
          smooth: true //视觉导引线
        },
        type: 'pie',
        clockwise: false, // 逆时针显示数据，要改成顺时针就改成 true
        center: ['50%', '55%'],
        radius: ['34%', '55%'],
        data: [{
          value: 55,
          name: '学习'
        }, {
          value: 20,
          name: '工作'
        }, {
          value: 10,
          name: '休息'
        }, {
          value: 20,
          name: '锻炼'
        }, {
          value: 38,
          name: '其它'
        }]
      }]
    },
    option_Time: {
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
  },

  onLoad() {
    this.ecComponent_Time = this.selectComponent('#LogsChart');
    this.ecComponent_Cate = this.selectComponent('#CatePie');
    this.CateData();
    this.EChartDataReformer();
  },

  onShareAppMessage() {

  },

  CateData() { //主要就是遍历Logs，再进行分类和时间求和
    let Logs = this.data.Logs;
    let StudyTime = {
      name: "学习",
      value: 0
    };
    let WorkOutTime = {
      name: "锻炼",
      value: 0
    };
    let WorkTime = {
      name: "工作",
      value: 0
    };
    let RestTime = {
      name: "休息",
      value: 0
    };
    let OtherTime = {
      name: "其它",
      value: 0
    };
    for (let i = 0; i < Logs.length; i++) {
      if (Logs[i].Cate == "学习") {
        StudyTime.value += Logs[i].Time;
      } else if (Logs[i].Cate == "工作") {
        WorkTime.value += Logs[i].Time;
      } else if (Logs[i].Cate == "锻炼") {
        WorkOutTime.value += Logs[i].Time;
      } else if (Logs[i].Cate == "休息") {
        RestTime.value += Logs[i].Time;
      } else {
        OtherTime.value += Logs[i].Time;
      }
    }
    const AllTime = [{
      name: '学习',
      value: StudyTime.value
    }, {
      name: '工作',
      value: WorkTime.value
    }, {
      name: '锻炼',
      value: WorkOutTime.value
    }, {
      name: '休息',
      value: RestTime.value
    }, {
      name: '其它',
      value: OtherTime.value
    }];
    // console.log(AllTime);
    this.initChart_Cate(AllTime);
  },
  EChartDataReformer: function () {
    var Logs = wx.getStorageSync('Logs') || [];
    var ToDay = parseInt(new Date().toString().substring(8, 10));
    var Date_Year=parseInt(new Date().toString().substring(11, 15));
    var Date_Month=util.formatTime(new Date(new Date().getFullYear(), new Date().getMonth()+1, 0)).toString().substring(5, 7);
    this.setData({
      Now_Year:Date_Year,
      Now_Month:Date_Month
    })
    // console.log(Date_Month);
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
    // console.log(Logs);
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
    Study_Reformed[0] = null;
    Work_Reformed[0] = null;
    Rest_Reformed[0] = null;
    Exercise_Reformed[0] = null;
    Other_Reformed[0] = null;
    // console.log(Work_All);
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
      // console.log(Work_Reformed);
      // console.log(OneDayTime_1);
      // console.log(this.data.Now_Year,this.data.Now_Month,this.data.Date_Day);

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
    this.initChart_Time(All_Logs_List);
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

  initChart_Cate(AllTime) { //图表传参函数，将数据更新到图表上
    const that = this;
    if (!that.ecComponent_Cate) return wx.showToast({ //获取不到组件？一般不会出这种情况，你得看看是不是改了图表名字
      icon: "error",
      title: '初始化错误',
    });
    // console.log(that.ecComponent);
    that.ecComponent_Cate.init((canvas, width, height, dpr) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr
      });
      setTimeout(() => { //其实参数传入的问题很久才解决，解决的日子是2023/4/11，版本V3.2.2Beta。
        // 需要注意几点：
        // AllTime 必须与参数一致化，使用 name:"学习",value:10 的形式
        // 数据分级搞清楚，是 that.data.option.series[0].data，这个数组 0 号不要忘记！
        // ChatGPT有点笨，没分析出来，又让我改AllTime的构成代码，原来用的push，现在改成了这样让我有点不爽
        that.data.option_Cate.series[0].data = AllTime;
        // console.log(that.data.option.series[0].data); 
        let option = JSON.parse(JSON.stringify(that.data.option_Cate));
        // console.log(option);
        chart.setOption(option);
      }, 200)
      that.chart_Cate = chart;
      return chart;
    });
  },
  initChart_Time(LogsList) {
    const that = this;
    if (!that.ecComponent_Time) return wx.showToast({
      icon: "error",
      title: '初始化错误',
    });
    // console.log(LogsList);

    that.ecComponent_Time.init((canvas, width, height, dpr) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });

      // 模拟请求接口
      setTimeout(() => {
        that.data.option_Time.series[0].data = LogsList[0].Study_Reformed;
        that.data.option_Time.series[1].data = LogsList[0].Work_Reformed;
        that.data.option_Time.series[2].data = LogsList[0].Exercise_Reformed;
        that.data.option_Time.series[3].data = LogsList[0].Rest_Reformed;
        // that.data.option.series[4].data = LogsList[0].Other_Reformed;
        let option = JSON.parse(JSON.stringify(that.data.option_Time));
        chart.setOption(option);
      }, 200)

      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      that.chart_Time = chart;
      // console.log(chart);

      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
  },

})
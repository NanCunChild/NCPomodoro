import * as echarts from '../../ec-canvas/echarts.js';



Page({
  data: {
    Logs: wx.getStorageSync('Logs'),
    Color: "",
    ecComponent: null,
    chart: null,
    CatePie: {
      // onInit: initChart, 
      lazyLoad: true,
    },
    option: {
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
      labelLine: {
        smooth: true
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
          smooth: true
        },  
        type: 'pie',
        clockwise: false,
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
    }
  },

  onLoad(options) {
    this.ecComponent = this.selectComponent('#CatePie');
    this.CateData();
  },

  onShareAppMessage() {

  },

  CateData() {
    var Logs = this.data.Logs;
    var StudyTime = {
      name: "学习",
      value: 0
    };
    var WorkOutTime = {
      name: "锻炼",
      value: 0
    };
    var WorkTime = {
      name: "工作",
      value: 0
    };
    var RestTime = {
      name: "休息",
      value: 0
    };
    var AllTime = [];
    for (let i = 0; i < Logs.length; i++) {
      if (Logs[i].Cate == "学习") {
        StudyTime.value += Logs[i].Time;
      } else if (Logs[i].Cate == "工作") {
        WorkTime.value += Logs[i].Time;
      } else if (Logs[i].Cate == "锻炼") {
        WorkOutTime.value += Logs[i].Time;
      } else if (Logs[i].Cate == "休息") {
        RestTime.value += Logs[i].Time;
      }
    }
    AllTime.push({
      StudyTime,
      WorkOutTime,
      WorkTime,
      RestTime,
    })
    console.log(AllTime);
    this.initChart(AllTime);
  },

  initChart(AllTime) {
    const that = this;
    if (!that.ecComponent) return wx.showToast({
      icon: "error",
      title: '初始化错误',
    });
    console.log(that.ecComponent);
    that.ecComponent.init((canvas, width, height, dpr) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr
      });
      setTimeout(() => { //终于！终于！！！终于成功了！！！！ 2023 03 24 21：17
        that.data.option.series.data = AllTime[0];
        let option = JSON.parse(JSON.stringify(that.data.option));
        console.log(option);
        chart.setOption(option);
      }, 200)
      that.chart = chart;
      return chart;
    });
  },

})
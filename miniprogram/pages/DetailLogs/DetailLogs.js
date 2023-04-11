import * as echarts from '../../ec-canvas/echarts.js';
Page({
  data: {
    Logs: wx.getStorageSync('Logs'),
    ecComponent: null,
    chart: null, // 用来保存 echarts 实例的引用
    CatePie: {
      // onInit: initChart, 
      // 使用或不使用 onInit: initChart 都是可以的，因为这里使用的是懒加载模式，即图表组件只有在被显示时才会被初始化。所以如果不使用 onInit，则需要在显示图表之前手动调用 initChart 方法进行初始化。这个页面使用了CateData之后就会调用initChart，所以可以不调用。
      lazyLoad: true,// 懒加载，可以推迟 echarts 组件的加载，当 ec-canvas 组件真正被渲染到页面上时再进行 echarts 的初始化和渲染，从而提高页面的加载速度和流畅度。
    },
    option: {//写死的格式，不能动格式框架
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
    }
  },

  onLoad() {
    this.ecComponent = this.selectComponent('#CatePie');
    this.CateData();
  },

  onShareAppMessage() {

  },

  CateData() {//主要就是遍历Logs，再进行分类和时间求和
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
      } else{
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
    } 
  ];
    // console.log(AllTime);
    this.initChart(AllTime);
  },

  initChart(AllTime) {//图表传参函数，将数据更新到图表上
    const that = this;
    if (!that.ecComponent) return wx.showToast({//获取不到组件？一般不会出这种情况，你得看看是不是改了图表名字
      icon: "error",
      title: '初始化错误',
    });
    // console.log(that.ecComponent);
    that.ecComponent.init((canvas, width, height, dpr) => {
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
        that.data.option.series[0].data = AllTime;
        // console.log(that.data.option.series[0].data); 
        let option = JSON.parse(JSON.stringify(that.data.option));
        // console.log(option);
        chart.setOption(option);
      }, 200)
      that.chart = chart;
      return chart;
    });
  },

})
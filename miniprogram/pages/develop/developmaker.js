// pages/develop/developmaker.js
// pages/develop/developmaker.js
// pages/develop/developmaker.js
Page({
  data: {
      nickname_totaltime_ranklist: [],
      my_nickname:'', 
      my_total_time:0,
      my_rank:0,
  },

  onLoad: function () {
     
      
  },
  onShow: function () {
      this.shownickname();
      
},
  onPullDownRefresh: function () { //下拉刷新
    
     
  },

  //查询openid查询nickname然后显示出来
  //云函数act1负责计算totaltime 云函数act2负责计算rank
  
 shownickname:function(){
  var that=this;
   wx.cloud.callFunction({
    name: "getOpenId",
    success(res){
    // 授权用户的openid

    let openId= res.result.openid
    var nicname="";
    // 判断openid是否存在于数据库一般一个openid一条数据   开发者除外
    wx.cloud.database().collection('PomodoroUsers').where({
      _openid:openId
    }).get().then(ress => {
      // 判断返回的data长度是否为0，如果为0的话就证明数据库中没有该openid然后进行添加缓存操作
      if(ress.data.length==0){
    // 获取nickname
      }else{
      console.log("我的数据Nick",ress.data);
      
       var nicknamearr=(ress.data).map(x=>{return x.nickName})
       nicname=nicknamearr
       that.setData({
        my_nickname:nicname,
        my_rank:ress.data[0].rank,
        my_total_time:ress.data[0].totaltime
       })
      }
    })
    },fail(res){
      console.log("云函数GETOPENID调用失败")
    }
  })
  //以上获取自己昵称

  //获取昵称 和总时间 onshow展示

//获取别人的昵称 countrank
wx.cloud.callFunction({
  name:"Nickname",
  data:{
    act:"readnickname_totaltime"
  },
  success:resss=>{
    console.log("按totaltime排名",resss)
     var darr=[]
    for(var ed=0;ed<resss.result.data.length;ed++)
   
    darr.push({
      nickname:resss.result.data[ed].nickName,
      rank:ed+1,
      totaltime:resss.result.data[ed].totaltime
    })
    that.setData({
      nickname_totaltime_ranklist:darr
    })
    
    
  },
  fail:errrr=>{

  }
})



    
},
 
  
  
})
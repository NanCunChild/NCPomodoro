const formatTime = date => {
  const Year = date.getFullYear()
  const Month = date.getMonth() + 1
  const Day = date.getDate()
  const Hour = date.getHours()
  const Minute = date.getMinutes()
  const Second = date.getSeconds()

  return [Year, Month, Day].map(formatNumber).join('-') + ' ' + [Hour, Minute, Second].map(formatNumber).join(':') //日期格式化 2022-10-24 10:28:58
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n //若只有一位就加0
}

const Initializing = n => {
  if (!wx.getStorageSync('Logs')) wx.setStorageSync('Logs', []);
  if (!wx.getStorageSync('UserInfo')) wx.setStorageSync('UserInfo', []);
  if (!wx.getStorageSync('nickName')) wx.setStorageSync('nickName', "nickName");
  if (!wx.getStorageSync('CateCustom')) wx.setStorageSync('CateCustom', []);
  if (!wx.getStorageSync('IsDebugger')) wx.setStorageSync('IsDebugger', false);
  if (!wx.getStorageSync('IsRank')) wx.setStorageSync('IsRank', false);
  if (!wx.getStorageSync('ToVibrate')) wx.setStorageSync('ToVibrate', true);
}

const UpLoadLogs = n => {
  //改动方法1
  //测试
  //const局部变量
  const Logs = wx.getStorageSync('Logs') || [] //判断是否为空 如果空的化就=[]
  const UserInfo = wx.getStorageSync('UserInfo') || [];
  const CateCustom = wx.getStorageSync('CateCustom') || []
  const ToVibrate = wx.getStorageSync('ToVibrate') || false
  const IsDebugger = wx.getStorageSync('IsDebugger') || false
  const IsRank = wx.getStorageSync('IsRank') || false
  const nickName = wx.getStorageSync('nickName') || ""
  console.log(Logs, UserInfo, CateCustom, ToVibrate, IsDebugger, IsRank, nickName) //获取本地缓存很成功


  wx.cloud.callFunction({
    name: "GETOPENID",
    success(res) {
      // 授权用户的openid
      console.log("云函数GETOPENID: ", res.result.openid);
      let openId = res.result.openid
      // 判断openid是否存在于数据库
      wx.cloud.database().collection('PomodoroUsers').where({
        _openid: openId
      }).get().then(ress => {
        // 判断返回的data长度是否为0，如果为0的话就证明数据库中没有该openid然后进行添加缓存操作
        // console.log("存档测试获取数据",ress);//事实证明。where方法只能查询具体的某个数据
        if (ress.data.length == 0) { //如果没有查询到
          // 云函数添加
          wx.cloud.callFunction({
            name: "UpLoadAsset", //调用增加云函数
            data: {
              action: 'saveLocalStorage', //传入事件参数
              Logs: Logs,
              UserInfo: UserInfo,
              CateCustom:CateCustom,
              ToVibrate: ToVibrate,
              IsDebugger: IsDebugger,
              IsRank: IsRank,
              nickName: nickName
            },
            success: res => {
              // console.log('云函数Add缓存成功！', res)
              wx.showToast({
                icon: 'success',
                title: '存档完成',
                mask: true,
                duration: 1000,
              })
            },
            fail: err => {
              console.error('缓存添加失败', err)
            }
          })
          // 用户已经存在数据库中更新数据
        } else {
          console.log("用户已经存在，将更新数据")
          wx.cloud.callFunction({
            name: "UpLoadAsset", //调用更新函数
            data: {
              action: 'updateLocalStorage',
              Logs: Logs,
              UserInfo: UserInfo,
              ToVibrate: ToVibrate,
              CateCustom:CateCustom,
              IsDebugger: IsDebugger,
              IsRank: IsRank,
              nickName: nickName
            },
            success: res => {
              // console.log('云函数update信息成功！', res)
              wx.showToast({
                icon: 'success',
                title: '存档完成',
                mask: true,
                duration: 1000,
              })
            },
            fail: err => {
              console.error('更新update失败', err)
            }
          })
        }
      })
    },
    fail(res) {
      console.log("云函数SAVEdata调用失败")
    }
  })

}
const DownLoadLogs = n => {
  // let Storage_tvlv = []
  wx.cloud.callFunction({
    name: 'UpLoadAsset',
    data: {
      action: 'recoverLocalStorage',
    },
    success: res => {
      // console.log("recover start", res)
      //资料卡片：wx.setStorage（key）和wx.setStorageSync（key）将数据存储在本地缓存中指定的 key 中。会--覆盖--掉原来该 key 对应的内容。

      //如果用户没登录过就不会有openid不执行覆盖
      //目前更新7个参数可增删改UserInfo:UserInfo,Logs,ToVibrate ,IsDebugger,IsRank,nickName,totaltime

      if (typeof (res.result) != 'undefined' && typeof (res.result.data) != 'undefined' && res.result.data.length == 1) {
        // console.log(res.result.data[0].ToVibrate);
        console.log("Data gathered successfully.")
        try {
          wx.setStorageSync('Logs', res.result.data[0].Logs)
        } catch (err) {
          console.log("缓存Logs更新失败", err)
        }
        try {
          wx.setStorageSync('CateCustom', res.result.data[0].CateCustom)
        } catch (err) {
          console.log("缓存CateCustom更新失败", err)
        }
        try {
          wx.setStorageSync('ToVibrate', res.result.data[0].ToVibrate)
        } catch (err) {
          console.log("缓存ToVibrate更新失败", err)
        }
        try {
          wx.setStorageSync('IsDebugger', res.result.data[0].IsDebugger) //默认false
        } catch (err) {
          console.log("缓存IsDebugger更新失败", err)
        }
        try {
          wx.setStorageSync('IsRank', res.result.data[0].IsRank)
        } catch (err) {
          console.log("缓存IsRank更新失败", err)
        }
        try {
          wx.setStorageSync('UserInfo', res.result.data[0].UserInfo)
        } catch (err) {
          console.log("缓存UserInfo更新失败", err)
        }
        try {
          wx.setStorageSync('nickName', res.result.data[0].nickName)
        } catch (err) {
          console.log("缓存nickName更新失败", err)
        }
        try {
          wx.setStorageSync('totaltime', res.result.data[0].totaltime)
        } catch (err) {
          console.log("缓存totaltime更新失败", err)
        }


        //名字''其实获取用户信息就可以获得微信名 但是本小程序可以提供自己取一个独立昵称 不一定要微信名的时候方便update修改

      } else {
        console.log("新用户不更新覆盖缓存")
      }
    }, //云函数调用响应
    fail: err => {
      // handle error
      console.log('fail', err)
    },
    complete: () => {
      // ...
      console.log('complete')
    }
  })
  // this.onPullDownRefresh()//一读档就刷新
  console.log("读档完结，刷新成功")
}

const DownLoadMsgs = n => {
  let TempMsg = [];
  wx.cloud.callFunction({
    name: 'UpLoadAsset',
    data: {
      action: 'DownLoadMsgs',
    },
    success: res => {
      // console.log(res)
      if (typeof (res.result) != 'undefined' && typeof (res.result.data) != 'undefined') {
        for (let i = 0; i < res.result.data.length; i++) {
          if (res.result.data[i].Promotion) {
            TempMsg.push({
              Title: res.result.data[i].Msg,
              Contents: res.result.data[i].Contents,
              Order: i,
            })
          }
        }
        wx.setStorageSync('MsgList', TempMsg);
        // console.log(wx.getStorageSync('MsgList'));
      } else {
        console.log('数据库Msgsdb中无数据');
      }
    },
    fail: err => {
      // handle error
      console.log('调用云函数出错！', err)
    },
    complete: () => {
      // console.log('调用云函数完成！')
    }
  })
}
module.exports = {
  formatTime: formatTime,
  UpLoadLogs: UpLoadLogs,
  DownLoadLogs: DownLoadLogs,
  DownLoadMsgs: DownLoadMsgs,
  Initializing: Initializing,
}
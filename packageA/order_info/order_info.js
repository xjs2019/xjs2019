
const app = getApp()
// 倒计时
// function countdown(that) {
//   var EndTime = new Date(that.data.collage.collage_end).getTime() || [];
//   // console.log(EndTime);
//   var NowTime = new Date().getTime();
//   var total_micro_second = EndTime - NowTime || [];   //单位毫秒
//   if (total_micro_second < 0) {
//     // console.log('时间初始化小于0，活动已结束状态');
//     total_micro_second = 1;     //单位毫秒 ------  WHY？
//   }
  // console.log('剩余时间：' + total_micro_second);
  // 渲染倒计时时钟
//   that.setData({
//     clock: dateformat(total_micro_second)   //若已结束，此处输出'0天0小时0分钟0秒'
//   });
//   if (total_micro_second <= 0) {
//     that.setData({
//       clock: "已经截止"
//     });
//     return;
//   }
//   setTimeout(function () {
//     total_micro_second -= 1000;
//     countdown(that);
//   }
//     , 1000)
// }

// 时间格式化输出，如11天03小时25分钟19秒  每1s都会调用一次
// function dateformat(micro_second) {
//   // 总秒数
//   var second = Math.floor(micro_second / 1000);
//   // 天数
//   var day = Math.floor(second / 3600 / 24);
//   // 小时
//   var hr = Math.floor(second / 3600 % 24);
//   // 分钟
//   var min = Math.floor(second / 60 % 60);
//   // 秒
//   var sec = Math.floor(second % 60);
//   return day + "天" + hr + "小时" + min + "分钟" + sec + "秒";
// }
Page({
   data: {
     timer: '',//定时器名字
     countDownNum: '10'//倒计时初始值
   },
  onLoad: function (options) {
    this.orderInfo()
    // wx.request({
    //   success: function (request) {
    //     // 倒计时(获取结束时间后再进行倒计时方法调用)
    //     countdown(that);
    //   }
    // })
  },  

    // onLoad() {
    //     this.orderInfo()
      
      
    // },

    orderInfo() {
        app.api.apiA.orderInfo({user_id: app.data.user_id, order_id: app.data.order_id}).then(res => {
            if (res.response === 'data') {
                const data = res.data
                data.create_time = app.dateformat(data.create_time * 1000)
                for (let i = 0; i < data.log.length; i++) {
                    data.log[i].create_time = app.dateformat(data.log[i].create_time * 1000)
                }
              console.log(data)
                this.setData({
                    orderInfo: data,
                })
            }
        })
    },

  //2019-1-20-add
  // 支付
  pay(e) {

    const order_sn = e.currentTarget.dataset.order_sn
    wx.login({
      success: res => {
        const code = res.code
        app.api.pay({ code, order_sn }).then(res => {

          wx.requestPayment({
            timeStamp: res.data.timeStamp,
            nonceStr: res.data.nonceStr,
            package: res.data.package,
            signType: 'MD5',
            paySign: res.data.paySign,
            success: () => {
              this.orderList(this.data.tabIndex)
            },
          })
        })
      },
    })
  },


  init() {


    this.setData({
      pay_type: app.data.payWay ? app.data.payWay : '微信',
      sendWay: app.data.sendWay || '上门自提',
      payWay_id: app.data.payWay_id || 2,
      shipping_type: app.data.sendWay_id || 4,
      buy_now: app.data.buy_now,
      checkDay: app.data.checkDay || 0,
    })
    app.data.payWay_id = this.data.payWay_id
  },
  
  // 提交订单
  addOrder() {
    const payWay_id = this.data.payWay_id
    if (!this.data.image && (payWay_id === 4 || payWay_id === 5)) {
      return wx.showToast({ title: '请上传凭证', icon: 'none' })
    }


    const { address_id, invoice_id, pay_type, shipping_type, orderList } = this.data
    app.data.total_price = this.data.total_price


    app.api.api_new.buy_now({
      user_id: app.data.user_id,
      id: app.data.buy_now.id,
      total: this.data.total,
      address_id,
      invoice_id,
      pay_type,
      shipping_type,
      image: this.data.image,
      day: this.data.checkDay,
    }).then(res => {
      if (res.response === 'data' && res.data) {
        app.data.order = res.data
        wx.reLaunch({ url: '/packageA/settlement_pay/settlement_pay' })
      } else {
        wx.showToast({ title: res.error.message, icon: 'none' })
      }
    })
  },


  // 费用
  shipping() {
    return app.api.api_new.statistics({
      user_id: app.data.user_id,
      total: this.data.total,
      id: app.data.buy_now.id,
      area_id: this.data.area_id,
      pay_type: this.data.pay_type,
      shipping_type: this.data.shipping_type,
      invoice_id: this.data.invoice === 0 ? 0 : this.data.invoice_id,
      day: this.data.checkDay,
    }).then(res => {
      if (res.response === 'data') {
        this.setData({
          shippingPrice: res.data.shipping,
          price: res.data.price,
          total_price: res.data.total_price,
          cheque: res.data.cheque,
          pay_type_price: res.data.pay_type_price,
        })
      } else if (res.response === 'error') {
        this.setData({ total: res.error.error_code.kucun })
        this.shipping()
        wx.showToast({ title: `库存不足,剩余${res.error.error_code.kucun}`, icon: 'none' })
      }
    })
  },


  // setTimeout(() => {
  //   this.isLogin(Number(res.data.type))
  // }, 1000)

//   timer = require('../../plug/wxTimer.js')
// var wxTimer = new timer({
//     beginTime: "00:30:10"
//   })
// wxTimer.start(this);
//   wxTimer.stop();

  onShow: function () {
    //什么时候触发倒计时，就在什么地方调用这个函数
    this.countDown();
  },
  countDown: function () {
    let that = this;
    let countDownNum = that.data.countDownNum;//获取倒计时初始值
    //如果将定时器设置在外面，那么用户就看不到countDownNum的数值动态变化，所以要把定时器存进data里面
    that.setData({
      timer: setInterval(function () {//这里把setInterval赋值给变量名为timer的变量
        //每隔一秒countDownNum就减一，实现同步
        countDownNum--;
        //然后把countDownNum存进data，好让用户知道时间在倒计着
        that.setData({
          countDownNum: countDownNum
        })
        //在倒计时还未到0时，这中间可以做其他的事情，按项目需求来
        if (countDownNum == 0) {
          //这里特别要注意，计时器是始终一直在走的，如果你的时间为0，那么就要关掉定时器！不然相当耗性能
          //因为timer是存在data里面的，所以在关掉时，也要在data里取出后再关闭
          clearInterval(that.data.timer);
          //关闭定时器之后，可作其他处理codes go here
        }
      }, 1000)
    })
  }


})




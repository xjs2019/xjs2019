const app = getApp()

Page({

    onLoad() {
        this.orderInfo()
    },

    orderInfo() {
        app.api.apiA.orderInfo({user_id: app.data.user_id, order_id: app.data.order_id}).then(res => {
            if (res.response === 'data') {
                const data = res.data
                data.create_time = app.dateformat(data.create_time * 1000)
                for (let i = 0; i < data.log.length; i++) {
                    data.log[i].create_time = app.dateformat(data.log[i].create_time * 1000)
                }
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

})

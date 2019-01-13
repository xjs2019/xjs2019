const app = getApp()

Page({

    data: {
        img: app.api.imgUrl,
        //默认微信支付
        //默认上门自提
        //sendWay_id: 4,
        // 默认不开发票
        invoice: 0,
        invoice2: 0,
        total: 1,
        loads: Promise.resolve(),
    },

    onLoad(e) {
        app.data.sendWay = '上门自提'
        app.data.sendWay_id = 4


    },

    onShow() {
        this.data.loads = new Promise(resolve => {
            app.api.apiA.addressList({user_id: app.data.user_id}).then(res => {
                if (res.data.length > 0) {
                    this.setData({
                        check: app.data.check,
                    })
                    resolve()
                } else {

                    this.setData({
                        defaultAddress: null,
                    })
                    wx.showModal({
                        title: '提示',
                        content: '您还没有添加收获地址,是否添加?',
                        success(res) {
                            if (res.confirm) {
                                app.data.goinfo = ''
                                wx.navigateTo({url: '/packageA/address_add/address_add'})
                            } else if (res.cancel) {
                                wx.navigateBack()
                            }
                        },
                    })
                }
            })
        }).then(res => {
            this.init()
            return Promise.all([
                this.getDefaultBilling(),
                this.getDefaultAddr(),
            ]).then(() => {
                if (this.data.invoice === 1) {

                    if (this.data.defaultBilling.id) {
                        this.setData({
                            invoice_id: this.data.defaultBilling.id,
                            invoice: 1,
                        })

                    } else {
                        this.setData({
                            invoice_id: 0,
                            invoice: 0,
                        })
                    }

                }

                return this.shipping()
            })
        }).then(res => {

        })
    },

    init() {


        this.setData({
            pay_type: app.data.payWay ? app.data.payWay : '微信',
            sendWay: app.data.sendWay || '上门自提',
            sendWay_id: app.data.sendWay_id || 4,
            payWay_id: app.data.payWay_id || 2,
            shipping_type: app.data.sendWay_id || 4,
            buy_now: app.data.buy_now,
            checkDay: app.data.checkDay || 0,
        })
        app.data.payWay_id = this.data.payWay_id
    },

    /********************event********************/

    address() {
        wx.navigateTo({url: '/packageA/address_list/address_list'})
    },
  // 开不开发票
  sendWay2(e) {
    const index = Number(e.detail.value)
    //this.setData({ total: this.data.total })
    console.log(e.detail.value)
    this.setData({
      invoice2: index
    })
    // if (index == 1){
      
    //   this.setData({
    //     invoice: index,
    //   })
    // }else{
      
    //   this.setData({
    //     invoice: index,
    //   })

    // }
    
  },

    // 开不开发票
    invoice(e) {
        const index = Number(e.detail.value)
        this.setData({
            invoice_id: index === 0 ? 0 : this.data.defaultBilling.id,
            invoice: index,
        })

        if (index !== 0) {
            app.api.apiA.getDefaultBilling({user_id: app.data.user_id}).then(res => {
                if (res.response === 'data') {

                    if (res.data) {
                        // 切换发票时查运费
                        this.shipping()
                    } else {

                        wx.showModal({
                            title: '提示',
                            content: '您还没有添加发票信息,是否添加?',
                            success: (res) => {
                                if (res.confirm) {
                                    wx.navigateTo({url: '/packageA/invoice_add/invoice_add'})
                                } else if (res.cancel) {
                                    this.setData({invoice: 0})
                                }
                            },
                        })

                    }
                }
            })

        } else {
            // 切换发票时查运费
            this.shipping()
        }
    },

    // 提交订单
    addOrder() {
        const payWay_id = this.data.payWay_id
        if (!this.data.image && (payWay_id === 4 || payWay_id === 5)) {
            return wx.showToast({title: '请上传凭证', icon: 'none'})
        }


        const {address_id, invoice_id, pay_type, shipping_type, orderList} = this.data
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
                wx.reLaunch({url: '/packageA/settlement_pay/settlement_pay'})
            } else {
                wx.showToast({title: res.error.message, icon: 'none'})
            }
        })
    },

    /********************api********************/

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
                this.setData({total: res.error.error_code.kucun})
                this.shipping()
                wx.showToast({title: `库存不足,剩余${res.error.error_code.kucun}`, icon: 'none'})
            }
        })
    },


    // 获取默认地址
    getDefaultAddr() {
        return app.api.apiA.getDefaultAddr({user_id: app.data.user_id}).then(res => {
            if (res.response === 'data' && res.data) {
                this.setData({
                    area_id: res.data.area_id,
                    address_id: res.data.id,
                    defaultAddress: res.data,
                })
            } else {
                this.setData({
                    defaultAddress: [],
                })
            }
        })
    },

    // 获取默认开票
    getDefaultBilling() {
        return app.api.apiA.getDefaultBilling({user_id: app.data.user_id}).then(res => {
            if (res.response === 'data' && res.data) {
                this.setData({
                    invoice_id: res.data.id,
                    defaultBilling: res.data,
                })
            } else {
                this.setData({
                    defaultBilling: [],
                })
            }
        })
    },

    inputNumber(e) {
        let number = Number(e.detail.value)

        if (app.data.sendWay_id === 3 && number < 300) {
            this.setData({total: this.data.total})
            return wx.showToast({title: '新捷仕物流商品数量不能少于300', icon: 'none', duration: 2000})
        }

        if (number < 1) {
            wx.showToast({title: '商品数量不能低于1', icon: 'none'})
            number = 1
        }

        this.setData({total: number})
        this.shipping()
    },

    // 添加图片
    addImage() {
        wx.chooseImage({
            count: 1,
            success: (res) => {
                app.common.uploadImg(app.uploadImg, res.tempFilePaths[0]).then(res => {
                    res = JSON.parse(res.data)
                    if (res.response === 'data') {
                        this.setData({image: res.data})
                    }
                })
            },
        })
    },

    // 计算订单商品总数量,并且跳转
    settlement_way_go() {
        app.data.order_number = this.data.total
        wx.navigateTo({url: '/packageA/settlement_way/settlement_way'})
    },


})

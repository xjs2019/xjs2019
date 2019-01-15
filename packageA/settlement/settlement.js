const app = getApp()

Page({

    data: {
        img: app.api.imgUrl,
        // 默认不开发票
        invoice: 0,
        loads: Promise.resolve(),
      invoice2: 0,
      sendWay_id: app.data.sendWay_id || 4,
    },

    onLoad(e) {

        this.data.e = e
      //console.log(this.data)
      // app.data.sendWay = '上门自提'
      //   app.data.sendWay_id = 4
        this.setData(wx.getStorageSync('settlement-data'))
    },

    onShow() {
        const e = this.data.e

        this.data.loads = new Promise(resolve => {
            app.api.apiA.addressList({user_id: app.data.user_id}).then(res => {
                if (res.data.length > 0) {
                    this.setData({
                        check: app.data.check,
                        // 议价ID
                        bargainId: e.bargainId || '',
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
            wx.setStorage({key: 'settlement-data', data: this.data})

        })
    },

    init() {

        //  订单商品总数量
        const number = this.order_number()
        //  订单商品总数量小于300则切换成上门自提
        // if (number < 300) {
        //   app.data.sendWay_id = 4
        //   app.data.sendWay = '上门自提'
        // }

        this.setData({
          pay_type: app.data.payWay ? app.data.payWay : '微信',
            sendWay: app.data.sendWay ? app.data.sendWay : '上门自提',
            payWay_id: app.data.payWay_id || 2,
            shipping_type: app.data.sendWay_id || 4,
            orderPrice: app.data.orderPrice,
            orderList: app.data.orderList,
            checkDay: app.data.checkDay || 0,
        })
        app.data.payWay_id = this.data.payWay_id
    },

    /********************event********************/

    address() {
        wx.navigateTo({url: '/packageA/address_list/address_list'})
    },
  // 配送方式
  sendWay2(e) {
    const index = Number(e.detail.value)
    //this.setData({ total: this.data.total })
    console.log(e.detail.value)
    this.setData({
      invoice2: index
    })

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
        // 提交议价商品
        if (this.data.bargainId) {
            app.api.apiA.confirmOrder({
                user_id: app.data.user_id,
                bargaining_id: this.data.bargainId,
                address_id,
                invoice_id,
                pay_type,
                shipping_type,
                image: this.data.image,
                day: this.data.checkDay,
            }).then(res => {
                if (res.response === 'data' && res.data) {
                    if (res.data.code === 0) {
                        return wx.showToast({title: res.data.msg, icon: 'none'})
                    }
                    app.data.order = res.data
                    wx.reLaunch({url: '/packageA/settlement_pay/settlement_pay'})
                } else {
                    wx.showToast({title: res.error.message, icon: 'none'})
                }
            })
            return
        }

        // 下面处理不是议价的商品
        const cart_id = []
        for (let i = 0; i < orderList.length; i++) {
            cart_id.push(orderList[i].cart_id)
        }

        app.api.apiA.addOrder({
            user_id: app.data.user_id,
            address_id,
            invoice_id,
            pay_type,
            shipping_type,
            cart_id,
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

    // 运费
    shipping() {
        const arr = []
        if (!this.data.bargainId) {
            const list = app.data.orderList
            for (let i = 0; i < list.length; i++) {
                arr.push(list[i].cart_id)
            }
        }

        return app.api.apiA.shipping({
            user_id: app.data.user_id,
            bargaining: this.data.bargainId,
            area_id: this.data.area_id,
            pay_type: this.data.pay_type,
            shipping_type: this.data.shipping_type,
            invoice_id: this.data.invoice === 0 ? 0 : this.data.invoice_id,
            cart_id: arr,
            day: this.data.checkDay,
        }).then(res => {
            this.setData({
                shippingPrice: res.data.shipping,
                total_price: res.data.total_price,
                cheque: res.data.cheque,
                pay_type_price: res.data.pay_type_price,
            })

        })
    },

    // 获取选中商品总价
    totalPrice() {
        // const list = app.data.orderList
        // const goods_list = []
        // for (let i = 0; i < list.length; i++) {
        //   const item = {
        //     goods_id: list[i].goods_id,
        //     total: list[i].total
        //   }
        //   goods_list.push(item)
        // }
        // app.api.apiA.totalPrice({user_id: app.data.user_id, goods_list}).then(res => {
        //   console.log(res)
        // })
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

    // 判断订单商品总数量
    order_number() {
        let num = 0
        const orderList = app.data.orderList
        for (let i = 0; i < orderList.length; i++) {
            num += orderList[i].total
        }
        app.data.order_number = num
        return num
    },


    // 计算订单商品总数量,并且跳转
    settlement_way_go() {
        this.order_number()
        wx.navigateTo({url: '/packageA/settlement_way/settlement_way'})
    },

})

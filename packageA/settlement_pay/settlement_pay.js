const app = getApp()

Page({

    onLoad() {

        const {order} = app.data
        const order_sn = order.order_sn
        const total_price = app.data.total_price
        this.setData({order, total_price})

        // 只要不是微信支付都不走微信支付
        const payWay_id = app.data.payWay_id
        if (payWay_id !== 2) {
            return
        }

        wx.login({
            success: res => {
                const code = res.code
                app.api.pay({code, order_sn}).then(res => {
                    wx.requestPayment({
                        timeStamp: res.data.timeStamp,
                        nonceStr: res.data.nonceStr,
                        package: res.data.package,
                        signType: 'MD5',
                        paySign: res.data.paySign,
                        success: () => {

                            wx.reLaunch({url: '/packageA/order/order'})
                        },
                        complete: () => {
                           wx.reLaunch({ url: '/packageA/order/order' })
                        },
                      'fail': () => { 
                        //wx.reLaunch({ url: '/packageA/order/order?tabIndex=0' })
                        var a =1
                        
                          wx.setStorage({ key: 'tabIndex', data: 0})
                        wx.navigateTo({
                          url: '../order/order'
                        })
                       
                      },

                    })
                })
            },
        })
    },

    pay() {
        wx.reLaunch({url: '/packageA/my/my'})
    },
})

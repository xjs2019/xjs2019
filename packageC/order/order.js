const app = getApp()

Page({

    data: {
        tabIndex: -1,
    },

    onLoad() {
        this.init()
    },

    init() {
        this.orderList()
    },

    /********************event********************/

    // 确认收货
    closed(e) {
        const {order_id} = e.currentTarget.dataset
        wx.showModal({
            title: '确认收货?',
            success: res => {
                if (res.cancel) return
                app.api.apiA.closed({user_id: app.data.user_id, order_id}).then(res => {
                    console.log(res)
                    if (res.response === 'data') {
                        this.orderList(this.data.tabIndex)
                        wx.showToast({title: '收货成功!'})
                    } else {
                        wx.showToast({title: res.error.message})
                    }
                })
            },
        })

    },

    // 选项卡切换
    tab(e) {
        const {index} = e.currentTarget.dataset
        if (index === this.data.tabIndex) return
        // 获取tab下标,查询相应数据
        this.orderList(index)
        this.setData({
            tabIndex: index,
        })
    },

    // 订单信息
    orderInfo(e) {
        const {id} = e.currentTarget.dataset
        app.data.order_id = id
        wx.navigateTo({url: '/packageA/order_info/order_info'})
    },

    // 删除订单
    delOrder(e) {
        const order_id = e.currentTarget.dataset.id
        wx.showModal({
            title: '是否删除订单!',
            success: res => {
                if (res.cancel) return
                app.api.apiA.delOrder({user_id: app.data.user_id, order_id}).then(res => {
                    if (res.response === 'data') {
                        this.orderList(this.data.tabIndex)
                        wx.showToast({title: '订单删除成功!'})
                    } else {
                        wx.showToast({title: res.error.message})
                    }
                })
            },
        })
    },

    // 申请售后
    afterSale(e) {
        const order_id = e.target.dataset.order_id
        wx.navigateTo({url: `/packageA/order_after/order_after?id=${order_id}`})
    },

    // 支付
    pay(e) {
        const order_sn = e.currentTarget.dataset.order_sn
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
                            this.orderList(this.data.tabIndex)
                        },
                    })
                })
            },
        })
    },

    /********************api********************/

    orderList(status, page) {
        if (status === -1) status = undefined
        app.api.apiC.getUserOrder({user_id: app.data.user_id, id: app.data.client_id, status, page}).then(res => {
            if (res.response === 'data') {
                const list = res.data.list
                // 格式化时间戳
                for (let i = 0; i < list.length; i++) {
                    list[i].create_time = app.dateformat(list[i].create_time * 1000)
                }
                this.setData({
                    orderList: list,
                })
            }
        })
    },

})

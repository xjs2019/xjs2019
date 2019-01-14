const app = getApp()

Page({

    data: {
        payWay_id: 2,
        sendWay_id: 1,
        chequeIndex: 0,
    },

    onLoad() {
        // 订单数量小于300则自动切换成上门自提
        // if (app.data.order_number < 300) {
        //   app.data.sendWay_id = 4
        // }

        this.setData({
            order_number: app.data.order_number,
            payWay_id: app.data.payWay_id || 2,
            sendWay_id: app.data.sendWay_id || 4,
        })

        app.api.apiA.cheque({user_id: app.data.user_id}).then(res => {
            if (res.response === 'data') {
                this.setData({cheque: res.data})
            }
        })

        this.setData({
            chequeIndex: app.data.chequeIndex || 0,
        })

    },

    // 支付方式
    payWay(e) {
        const {index, name} = e.target.dataset
        if (index) {
            app.data.payWay_id = index
            app.data.payWay = name
            this.setData({
                payWay_id: index,
            })

            if (index === 4 || index === 5) {
                app.data.checkDay = this.data.cheque[this.data.chequeIndex].money
            } else {
                app.data.checkDay = undefined
            }
        }
    },

    // 配送方式
    sendWay(e) {
        const {index, name} = e.target.dataset
        if (index) {
            app.data.sendWay_id = index
            app.data.sendWay = name
            this.setData({
                sendWay_id: index,
            })
        }
    },

    // 选择天数
    checkDay() {
        const arr = []
        for (let i = 0; i < this.data.cheque.length; i++) {
            arr.push(this.data.cheque[i].day)
        }
        wx.showActionSheet({
            itemList: arr,
            success: res => {
                const index = res.tapIndex
                app.data.checkDay = this.data.cheque[index].money
                app.data.chequeIndex = index
                this.setData({chequeIndex: index})
            },
        })
    },

    define() {
        wx.navigateBack()
    },

})

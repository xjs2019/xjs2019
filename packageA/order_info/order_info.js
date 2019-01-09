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

})

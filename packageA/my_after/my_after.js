const app = getApp()

Page({

    onLoad() {
        this.init()
    },

    init() {
        this.myQuestion()
    },

    myQuestion() {
        app.api.apiA.myQuestion({user_id: app.data.user_id}).then(res => {
            if (res.response === 'data') {
                const list = res.data
                // 格式化时间戳
                for (let i = 0; i < list.length; i++) {
                    list[i].create_time = app.dateformat(list[i].create_time * 1000)
                    for (let j = 0; j < list[i].log.length; j++) {
                        list[i].log[j].create_time = app.dateformat(list[i].log[j].create_time * 1000)
                    }
                }
                this.setData({
                    afterSale: list,
                })
            }
        })
    },
})

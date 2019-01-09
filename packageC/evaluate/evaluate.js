const app = getApp()

Page({

    data: {
        list: [],
        questions: '',
    },

    onLoad(e) {
        this.getInfo(e.id)
    },

    getInfo(id) {
        app.api.apiC.bargainingInfo({user_id: app.data.user_id, id}).then(res => {
            if (res.response === 'data') {
                const data = res.data
                const list = res.data.goods_list
                for (let i = 0; i < list.length; i++) {
                    list[i].price = list[i].old_price
                }
                // 格式化时间戳
                data.create_time = app.dateformat(data.create_time * 1000)
                this.setData({data, list})
            }
        })
    },

    // 修改价格
    getPrice(e) {
        const list = this.data.list
        const index = e.currentTarget.dataset.index
        const price = Number(e.detail.value)
        if (isNaN(price)) {
            return list[index].price
        }
        list[index].price = price
    },

    submit() {
        const questions = this.data.questions // 议价意见
        if (!questions) {
            return wx.showToast({title: '请填写意见', icon: 'none'})
        }
        wx.showModal({
            title: '确定议价?',
            success: res => {
                if (res.cancel) return


                const list = this.data.list
                const array = []
                for (let i = 0; i < list.length; i++) {
                    if (Number(list[i].price) > Number(list[i].old_price)) {
                        return wx.showToast(({title: '议价金额超出范围', icon: 'none'}))
                    }
                    if (Number(list[i].cha) < 0) {
                        return wx.showToast(({title: '请填写差价', icon: 'none'}))
                    }
                    const item = {
                        goods_list_id: list[i].goods_list_id,
                        price: Number(list[i].price),
                        cha: Number(list[i].cha),
                    }
                    array.push(item)
                }


                const pay_type = this.data.pay_type
                const qian = this.data.qian
                const why = this.data.why

                if (!pay_type) return wx.showToast(({title: '请输入支付方式', icon: 'none'}))
                if (!qian) return wx.showToast(({title: '请输入欠款金额', icon: 'none'}))
                if (!why) return wx.showToast(({title: '请输入申请原因', icon: 'none'}))

                app.api.apiC.submitBargaining({
                    user_id: app.data.user_id,
                    array,
                    pay_type,
                    qian,
                    why,
                    opinion: questions,
                }).then(res => {
                    if (res.response === 'data') {
                        wx.navigateBack()
                        wx.showToast({title: '议价成功', icon: 'none'})
                    } else {
                        wx.showToast({title: res.error.message, icon: 'none'})
                    }
                })

            },
        })

    },

    // 差价
    spread(e) {
        const list = this.data.list
        const index = e.currentTarget.dataset.index
        const price = Number(e.detail.value)
        list[index].cha = price
    },

    getInput(e) {
        app.common.getInput(this, e)
    },

})

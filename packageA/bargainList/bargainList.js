const app = getApp()

Page({

    data: {
        start_time: '',
        end_time: '',
        list: [],
    },

    onLoad() {
        this.setData({
            start_time: app.time.start_time_bargain || app.dateformat(Date.now() - 15 * 24 * 60 * 60 * 1000, 'YYYY-MM-DD'),
            end_time: app.time.end_time_bargain || app.dateformat('YYYY-MM-DD'),
        })
        this.getList()
    },

    getList(start_time = this.data.start_time, end_time = this.data.end_time, page) {
        this.setData({list: wx.getStorageSync('bargain-list')})
        app.api.apiA.userBbargaining({
            user_id: app.data.user_id,
            start_time: new Date(start_time).getTime() / 1000,
            end_time: new Date(end_time).getTime() / 1000,
            page,
        }).then(res => {
            if (res.response === 'data') {
                let list = res.list
                let showNull = true
                for (let i = 0; i < list.length; i++) {
                    list[i].create_time = app.dateformat(list[i].create_time * 1000)
                    if (showNull) {
                        showNull = false
                    }
                }
                this.setData({list, showNull})
                wx.setStorage({key: 'bargain-list', data: list})
            } else {
                wx.showToast({title: res.error.message, icon: 'none'})
            }
        })
    },

    // 立即下单
    orderNow(e) {
        const {item} = e.currentTarget.dataset
        app.data.orderList = item.goods_list

        let countPrice = 0
        for (let i = 0; i < item.goods_list.length; i++) {
            countPrice += item.goods_list[i].price * item.goods_list[i].total
        }
        app.data.orderPrice = countPrice.toFixed(2)
        wx.navigateTo({url: `/packageA/settlement/settlement?bargainId=${item.id}`})
    },

    start(e) {
        const start_time = e.detail.value
        app.time.start_time_bargain = app.dateformat(start_time, 'YYYY-MM-DD')
        this.setData({start_time})
        this.getList(start_time)
    },

    end(e) {
        const end_time = e.detail.value
        app.time.end_time_bargain = app.dateformat(end_time, 'YYYY-MM-DD')
        this.setData({end_time})
        this.getList(this.data.start_time, end_time)
    },

    more(e) {
        const {item, index} = e.currentTarget.dataset
        item.on = !item.on
        this.data.list[index] = item

        this.setData({
            list: this.data.list,
        })
    },

})

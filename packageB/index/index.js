const app = getApp()

Page({

    data: {
        start_time: '',
        end_time: '',
        setTab: {
            color: '#8a8a8a',
          selectedColor: '#f64a48',
            list: [
                {
                    pagePath: '/packageB/index/index',
                    text: '出库',
                    iconPath: '/image/money.png',
                    selectedIconPath: '/image/money1.png',
                }, {
                    pagePath: '/packageB/my_account/my_account',
                    text: '个人中心',
                    iconPath: '/image/my.png',
                    selectedIconPath: '/image/my1.png',
                }],
        },
    },

    onLoad() {
        this.init()
    },

    init() {
        app.data.tabBar = 0
        this.setData({
            start_time: app.time.start_time_a || app.dateformat(Date.now() - 15 * 24 * 60 * 60 * 1000, 'YYYY-MM-DD'),
            end_time: app.time.end_time_a || app.dateformat('YYYY-MM-DD'),
        })
        this.goodsOutList()
    },

    /********************event********************/

    // 订单信息
    orderInfo(e) {
        const {id} = e.currentTarget.dataset
        app.data.order_id = id
        wx.navigateTo({url: '/packageA/order_info/order_info'})
    },

    // 出库
    outLibrary(e) {
        const order_id = e.target.dataset.id
        if (!order_id) return
        wx.showModal({
            title: '确定出库?',
            success: res => {
                if (res.cancel) return

                app.api.apiB.outTotal({user_id: app.data.user_id, order_id}).then(res => {
                    if (res.response === 'data') {
                        wx.showToast({title: '出库成功'})
                        this.goodsOutList()
                    }
                })
            },
        })
    },

    more(e) {
        const {item, index} = e.currentTarget.dataset
        item.on = !item.on
        this.data.list[index] = item

        this.setData({
            list: this.data.list,
        })
    },

    start(e) {
        const start_time = e.detail.value
        app.time.start_time_a = app.dateformat(start_time, 'YYYY-MM-DD')
        this.setData({
            start_time,
        })
        this.goodsOutList(start_time)
    },

    end(e) {
        const end_time = e.detail.value
        app.time.end_time_a = app.dateformat(end_time, 'YYYY-MM-DD')
        this.setData({
            end_time,
        })
        this.goodsOutList(this.data.start_time, end_time)
    },

    /********************api********************/

    goodsOutList(start_time = this.data.start_time, end_time = this.data.end_time, page) {
        app.api.apiB.goodsOutList({
            user_id: app.data.user_id,
            start_time: new Date(start_time).getTime() / 1000,
            end_time: new Date(end_time).getTime() / 1000,
            page,
        }).then(res => {
            if (res.response === 'data') {
                const list = res.list
                for (let i = 0; i < list.length; i++) {
                    list[i].create_time = app.dateformat(list[i].create_time * 1000)
                    list[i].out_time = app.dateformat(list[i].out_time * 1000)
                }
                this.setData({
                    list,
                })
            }
        })
    },

})


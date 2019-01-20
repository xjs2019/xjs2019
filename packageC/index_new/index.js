const app = getApp()

Page({

    data: {
        start_time: '',
        end_time: '',
        list: [],
        setIndex: 0,
        setTab: {
            color: '#8a8a8a',
            selectedColor: '#f64a48',
            list: [{
                pagePath: '/packageC/index_new/index',
                text: '议价单',
                iconPath: '/image/money.png',
                selectedIconPath: '/image/money1.png',
            }, {
                pagePath: '/packageC/myOrderList/myOrderList',
                text: '我的客户',
                iconPath: '/image/D2.png',
                selectedIconPath: '/image/D21.png',
            }, {
                pagePath: '/packageC/my_account/my_account',
                text: '个人中心',
                iconPath: '/image/my.png',
                selectedIconPath: '/image/my1.png',
            }],
        },
    },

    onShow() {
        app.data.tabBar = 0
        this.setData({
            start_time: app.time.start_time_c_i || app.dateformat(Date.now() - 15 * 24 * 60 * 60 * 1000, 'YYYY-MM-DD'),
            end_time: app.time.end_time_c_i || app.dateformat('YYYY-MM-DD'),
        })
        this.getList()
    },

    // 订单信息
    orderInfo(e) {
        const {id} = e.currentTarget.dataset
        if (!id) return wx.showToast({title: '对方还没有下单哦~', icon: 'none'})
        app.data.order_id = id
        wx.navigateTo({url: '/packageA/order_info/order_info'})
    },

    // 获取议价单
    getList(start_time = this.data.start_time, end_time = this.data.end_time, page) {
        app.api.apiC.bargaining({
            user_id: app.data.user_id,
            start_time: new Date(start_time).getTime() / 1000,
            end_time: new Date(end_time).getTime() / 1000,
            page,
        }).then(res => {
            if (res.response === 'data') {
                let list = res.list
                let showNull = true
                for (let i = 0; i < list.length; i++) {
                    if (showNull) {
                        showNull = false
                    }
                    list[i].create_time = app.dateformat(list[i].create_time * 1000)
                }
                this.setData({
                    list,
                    showNull,
                })
            }
        })
    },

    start(e) {
        const start_time = e.detail.value
        app.time.start_time_c_i = app.dateformat(start_time, 'YYYY-MM-DD')
        this.setData({start_time})
        this.getList(start_time)
    },

    end(e) {
        const end_time = e.detail.value
        app.time.end_time_c_i = app.dateformat(end_time, 'YYYY-MM-DD')
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

    call(e) {
        wx.makePhoneCall({phoneNumber: e.currentTarget.dataset.call})
    },

})

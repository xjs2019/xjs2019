const app = getApp()

Page({

    data: {
        start_time: '',
        end_time: '',
        setIndex: 2,
        list: [],
        setTab: {
            color: '#8a8a8a',
            selectedColor: '#173d71',
            list: [
                {
                    pagePath: '/packageD/index/index',
                    text: '销售收益',
                    iconPath: '/image/money2.png',
                    selectedIconPath: '/image/money1.png',
                },
                {
                    pagePath: '/packageD/audit/audit',
                    text: '审核',
                    iconPath: '/image/D2.png',
                    selectedIconPath: '/image/D21.png',
                },
                {
                    pagePath: '/packageD/complaint_box/complaint_box',
                    text: '意见箱',
                    iconPath: '/image/D3.png',
                    selectedIconPath: '/image/D31.png',
                },
                {
                    pagePath: '/packageD/my_account/my_account',
                    text: '个人中心',
                    iconPath: '/image/my.png',
                    selectedIconPath: '/image/my1.png',
                },
            ],
        },
    },

    onLoad() {
        app.data.tabBar = 2
        this.setData({
            start_time: app.time.start_time_c || app.dateformat(Date.now() - 15 * 24 * 60 * 60 * 1000, 'YYYY-MM-DD'),
            end_time: app.time.end_time_c || app.dateformat('YYYY-MM-DD'),
        })
    },

    onShow() {
        this.getList()
    },

    getList(start_time = this.data.start_time, end_time = this.data.end_time, page) {
        app.api.apiD.opinion({
            user_id: app.data.user_id,
            start_time: new Date(start_time).getTime() / 1000,
            end_time: new Date(end_time).getTime() / 1000,
            page,
        }).then(res => {
            if (res.response === 'data') {
                let list = res.list
                for (let i = 0; i < list.length; i++) {
                    list[i].create_time = app.dateformat(list[i].create_time * 1000)
                }
                this.setData({list})
            } else {
                wx.showToast({title: res.error.message, icon: 'none'})
            }
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
        app.time.start_time_c = app.dateformat(start_time, 'YYYY-MM-DD')
        this.setData({
            start_time,
        })
        this.getList(start_time)
    },

    end(e) {
        const end_time = e.detail.value
        app.time.end_time_c = app.dateformat(end_time, 'YYYY-MM-DD')
        this.setData({
            end_time,
        })
        this.getList(this.data.start_time, end_time)
    },

})

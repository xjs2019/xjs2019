const app = getApp()

Page({

    data: {
        start_time: '',
        end_time: '',
        setIndex: 1,
        list: [],
        setTab: {
            color: '#8a8a8a',
          selectedColor: '#f64a48',
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
        app.data.tabBar = 1
        this.setData({
            start_time: app.time.start_time_b || app.dateformat(Date.now() - 15 * 24 * 60 * 60 * 1000, 'YYYY-MM-DD'),
            end_time: app.time.end_time_b || app.dateformat('YYYY-MM-DD'),
        })
    },
    onShow() {
        this.getList()
    },

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
                    list[i].create_time = app.dateformat(list[i].create_time * 1000)
                    if (showNull && list[i].status === 1) {
                        showNull = false
                    }
                }
                this.setData({list, showNull})
            } else {
                wx.showToast({title: res.error.message, icon: 'none'})
            }
        })
    },

    // boss审核
    audit(e) {

        let opinion = this.data.questions
        if (!opinion) {
            return wx.showToast({title: '请填写意见', icon: 'none'})
        }
        const {id, status} = e.currentTarget.dataset
        let title = '通过'
        if (status === 0) title = '驳回'
        wx.showModal({
            title: `确认${title}`,
            success: res => {
                if (res.cancel) return

                app.api.apiD.ckeckBargaining({user_id: app.data.user_id, id, status, opinion}).then(res => {
                    if (res.response === 'data') {
                        this.getList()
                        this.setData({questions: ''})
                        wx.showToast({title: '审核成功'})
                    } else {
                        wx.showToast({title: res.error.message, icon: 'none'})
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
        app.time.start_time_b = app.dateformat(start_time, 'YYYY-MM-DD')
        this.setData({
            start_time,
        })
        this.getList(start_time)
    },

    end(e) {
        const end_time = e.detail.value
        app.time.end_time_b = app.dateformat(end_time, 'YYYY-MM-DD')
        this.setData({
            end_time,
        })
        this.getList(this.data.start_time, end_time)
    },

    getInput(e) {
        app.common.getInput(this, e)
    },
})

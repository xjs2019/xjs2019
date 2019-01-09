const app = getApp()

Page({

    data: {
        setIndex: 1,
        setTab: {
            color: '#8a8a8a',
            selectedColor: '#173d71',
            list: [{
                pagePath: '/packageB/index/index',
                text: '议价单',
                iconPath: '/image/money.png',
                selectedIconPath: '/image/money1.png',
            }, {
                pagePath: '/packageB/personCenter/personCenter',
                text: '个人中心',
                iconPath: '/image/my.png',
                selectedIconPath: '/image/my1.png',
            }],
        },
        userInfo: '',
        messageList: [],
    },

    onLoad() {
        this.getUser()
        this.getMessageList()
    },

    linkTo(e) {
        wx.navigateTo({
            url: e.currentTarget.dataset.url,
        })
    },

    getUser() {
        app.api.apiC.info({
            user_id: app.data.user_id,
        }).then(res => {
            if (res.response === 'data') {
                this.setData({
                    userInfo: res.data,
                })
            } else {
                wx.showToast({title: res.error.message, icon: 'success'})
            }
        })
    },

    getMessageList() {
        app.api.apiC.message({
            user_id: app.data.user_id,
        }).then(res => {
            if (res.response === 'data') {
                let messageList = res.list
                for (let i in messageList) {
                    messageList[i].create_time = app.dateformat(messageList[i].create_time * 1000)
                }
                this.setData({
                    messageList: messageList,
                })
            } else {
                wx.showToast({title: res.error.message, icon: 'success'})
            }
        })
    },

})

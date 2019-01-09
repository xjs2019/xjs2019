// packageC/personCenter/personCenter.js
let app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        setIndex: 3,
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
                    pagePath: '/packageD/personCenter/personCenter',
                    text: '个人中心',
                    iconPath: '/image/D4.png',
                    selectedIconPath: '/image/D41.png',
                },
            ],
        },
        userInfo: '',
        messageList: [],
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
                wx.showToast({title: res.error.message, icon: 'none'})
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
                wx.showToast({title: res.error.message, icon: 'none'})
            }
        })
    },

    onLoad() {
        this.getUser()
        this.getMessageList()
    },

})

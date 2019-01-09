const app = getApp()

Page({

    data: {
        name: '',
        setIndex: 3,
        setTab: {
            color: '#8a8a8a',
            selectedColor: '#173d71',
            list: [{
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
                }],
        },
    },

    onLoad() {
        app.data.tabBar = 3
        this.setData({
            name: wx.getStorageSync('name'),
        })
    },

    logOut() {
        wx.showModal({
            title: '退出登录?',
            success: res => {
                if (res.cancel) return
                wx.reLaunch({url: '/pages/login/login'})
                wx.clearStorageSync()
            },
        })
    },
})

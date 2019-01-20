const app = getApp()

Page({

    data: {
        name: '',
        setIndex: 1,
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
        app.data.tabBar = 1
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

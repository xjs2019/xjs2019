const app = getApp()

Page({

    data: {
        name: '',
        setIndex: 2,
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

    onLoad() {
        app.data.tabBar = 2
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

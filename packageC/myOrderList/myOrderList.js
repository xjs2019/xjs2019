const app = getApp()

Page({

    data: {
        setIndex: 1,
        list: [],
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
        this.getUser()
    },

    // 获取客户
    getUser() {
        app.api.apiC.getUser({user_id: app.data.user_id}).then(res => {
            if (res.response === 'data') {
                this.setData({list: res.data})
            }
        })
    },

    // 查看客户订单
    getUserOrder(e) {
        const {id} = e.currentTarget.dataset
        app.data.client_id = id
        wx.navigateTo({url: '/packageC/order/order'})
    },

})

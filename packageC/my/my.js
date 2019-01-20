const app = getApp()

Page({

    data: {
        bgImg: '',
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
                pagePath: '/packageC/my/my',
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
        app.data.tabBar = 2

        Promise.all([
            this.info(),
            this.goodsType(),
            this.background(),
        ]).then(() => {
            this.setData({load: true})

        })
    },

    /********************event********************/

    getUserInfo(e) {
        const head_img = JSON.parse(e.detail['rawData'])['avatarUrl']
        app.api.apiA.editHeadImg({user_id: app.data.user_id, head_img}).then(res => {
            if (res.response === 'data') {
                wx.showToast({title: '更新成功'})
            }
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

    /********************api********************/

    info() {
        app.api.apiA.info({user_id: app.data.user_id}).then(res => {
            if (res.data) {
                this.setData({
                    info: res.data,
                })
            }
        })
    },

    // 获取商品类型
    goodsType() {
        app.api.apiA.goodsType().then(res => {
            this.setData({
                goodsType: res.data,
            })
        })
    },

    // my背景图
    background() {
        app.api.background({user_id: app.data.user_id}).then(res => {
            if (res.response === 'data') {
                this.setData({
                    bgImg: app.api.imgUrl + res.data,
                })
            }
        })
    },

})

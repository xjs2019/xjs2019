const app = getApp()

Page({

    data: {
        bgImg: '',
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
        this.init()
    },

    init() {
        app.data.tabBar = 3

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

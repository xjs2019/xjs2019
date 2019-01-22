const app = getApp()

Page({

    data: {
        bgImg: '',
        tabBar: 3,
        tabIndex: 1,
    },

    onLoad() {
        app.status()
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

    call() {
        wx.makePhoneCall({phoneNumber: '0755-29808333'})
    },

})

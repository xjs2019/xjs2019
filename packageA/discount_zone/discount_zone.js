const app = getApp()

Page({

    data: {
        tabBar: 1,
        tabIndex: 1,
    },

    onLoad() {
        this.init()
    },

    init() {
        app.data.tabBar = 1

        Promise.all([
            this.goodsType(),
            this.specialGoods(),
        ]).then(() => {
            this.setData({
                load: true,
                check: app.data.check,
            })

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

    // 今日主推
    tab(e) {
        const {index} = e.target.dataset
        if (!index) return
        this.specialGoods(index)
        this.setData({
            tabIndex: index,
        })
    },

    // 今日主推
    specialGoods(type_id = 1) {
        app.api.apiA.specialGoods({type_id}).then(res => {
            this.setData({
                specialGoods: res.data,
            })
        })
    },

    // 立即下单
    orderNow(e) {
        if (!app.data.check) {
            return wx.showToast({title: '您还没有通过审核哦~', icon: 'none'})
        }

        const goods_id = e.target.dataset.goods_id
        app.api.apiA.addCart({user_id: app.data.user_id, goods_id}).then(res => {
            if (res.response === 'data') {
                wx.showToast({title: '加入购物车成功~'})
            }
        })
    },

})

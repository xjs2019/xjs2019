const app = getApp()

Page({

    data: {
        imgUrl: app.imgUrl,
        tabBar: 1,
        tabIndex: 1,
    },

    onLoad() {
        app.status()
        this.init()
    },

    init() {
        app.data.tabBar = 1

        Promise.all([
            // this.goodsType(),
            // this.specialGoods(),
            this.special_price(),
        ]).then(() => {
            this.setData({
                load: true,
                check: app.data.check,
            })

        })
    },

    onShow() {
        app.data.tabBar = 1
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
        this.setData({specialGoods: wx.getStorageSync('discount-specialGoods')})
        app.api.apiA.specialGoods({type_id}).then(res => {
            wx.setStorage({key: 'discount-specialGoods', data: res.data})
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

    special_price() {
        app.api.api_new.special_price({user_id: app.data.user_id}).then(res => {
            const list = res.data
            list.forEach(res => {
                res.timeDown = timeDown(res.special_time_end * 1000)
            })
            this.setData({special_price: list})

            setInterval(() => {
                list.forEach(res => {
                    res.timeDown = timeDown(res.special_time_end * 1000)
                })
                this.setData({special_price: list})
            }, 1000)

        })
    },

    go(e) {
        app.data.discount_item = e.currentTarget.dataset.item
        wx.navigateTo({url: '/packageA/discount_info/discount_info'})
    },

})

// 倒计时
function timeDown(timestamp) {
    //结束时间
    let endDate = new Date(timestamp)
    //当前时间
    let nowDate = new Date()
    //相差的总秒数
    let totalSeconds = parseInt((endDate - nowDate) / 1000)
    if (totalSeconds < 0) return '活动已结束'
    //天
    let days = Math.floor(totalSeconds / (60 * 60 * 24))
    //取模（余数）
    let modulo = totalSeconds % (60 * 60 * 24)
    //时
    let hours = Math.floor(modulo / (60 * 60))
    modulo = modulo % (60 * 60)
    //分
    let minutes = Math.floor(modulo / 60)
    //秒
    let seconds = modulo % 60

    return `结束时间:${days}天${hours}小时${minutes}分${seconds}秒`
}

const app = getApp()

Page({
    data: {
        imgUrl: app.api.imgUrl,
        /**event**/
        tabIndex: 1,
        /**api**/
        banner: [],
        goodsType: [],
        goodsSpec: [],
    },

    onLoad() {
        this.init()
    },

    //初始化api
    init() {

        Promise.all([
            this.banner(),
            this.goodsType(),
            this.goodsSpec(),
        ]).then(() => {
            this.setData({load: true})

        })
    },

    /********************event********************/

    // 商品类型切换
    tab(e) {
        const {index} = e.target.dataset
        if (!index) return
        this.goodsSpec(index)
        this.setData({
            tabIndex: index,
        })
    },

    // 商品规格改变
    pickerChange(e) {
        // 所有规格id
        const itemIndex = e.target.dataset.index
        // 选中规格数组下标
        const selectedIndex = e.detail.value
        //修改下标
        this.data.goodsSpec[itemIndex].index = selectedIndex
        this.setData({
            goodsSpec: this.data.goodsSpec,
        })
    },

    // 获取选择的类别id
    getSelectedType() {
        const arr = []
        const list = this.data.goodsSpec
        //遍历所有商品规格,将有index商品的item_id添加到数组返回出去
        for (let i = 0, len = list.length; i < len; i++) {
            const index = list[i].index
            if (index !== undefined) {
                arr.push(list[i].item[index]['item_id'])
            }
        }
        return arr
    },

    // 加入购物车
    addCart(e) {
        if (!app.data.check) {
            return wx.showToast({title: '您还没有通过审核哦~', icon: 'none'})
        }

        // 规格数组
        const arr = this.getSelectedType()
        if (arr.length > 0) {
            app.api.apiA.getGoodsID({item_id: arr}).then(res => {
                if (res.data) {
                    return app.api.apiA.addCart({user_id: app.data.user_id, goods_id: res.data.goods_id})
                } else {

                    wx.showToast({title: res.error.message, icon: 'none'})
                }
            }).then(res => {

                if (res && res.response === 'data') {
                    wx.showToast({title: '添加购物车成功', icon: 'none'})
                }
            })
        } else {
            wx.showToast({title: '请选择类别', icon: 'none'})
        }
    },

    /********************api********************/

    // 轮播
    banner() {
        app.api.apiA.banner().then(res => {
            this.setData({
                banner: res.data,
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
    // 获取商品规格
    goodsSpec(type_id = 1) {
        app.api.apiA.goodsSpec({type_id}).then(res => {
            this.setData({
                goodsSpec: res.data,
            })
        })
    },
})


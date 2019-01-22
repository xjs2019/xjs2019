const app = getApp()

Page({
    data: {
        imgUrl: app.api.imgUrl,
        tabBar: 0,
        /**event**/
        tabIndex: 0,
        /**api**/
        banner: [],
        goodsType: [],
        goodsSpec: [],
        swiperIndex: 0,
    },

    onLoad() {
        app.status()
        this.init()
    },

    //初始化api
    init() {
        Promise.all([
            this.banner(),
            // this.goodsType(),
            this.goodsSpec(),
            this.home_list(),
            this.new_list(),
            this.new_tab(),
        ]).then(() => {
            this.setData({load: true, check: app.data.check})
        })
    },
    onShow() {
        app.data.tabBar = 0
    },
    /********************event********************/

    // 轮播下标改变事件
    swiperChange(e) {
        console.log()
        this.setData({swiperIndex: e.detail.current})
    },

    // 商品类型切换
    tab(e) {
        const {index} = e.target.dataset
        if (index === undefined) return
         
        this.setData({tabIndex: index})
        app.data.tabIndex = index
        this.home_list()
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
        this.setData({banner: wx.getStorageSync('index-banner')})
        app.api.apiA.banner().then(res => {
            wx.setStorage({key: 'index-banner', data: res.data})
            this.setData({
                banner: res.data,
            })
        })
    },

    // 获取商品类型
    goodsType() {
        this.setData({goodsType: wx.getStorageSync('index-goodsType')})
        app.api.apiA.goodsType().then(res => {
            wx.setStorage({key: 'index-goodsType', data: res.data})
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

    new_list() {
        this.setData({new_list: wx.getStorageSync('index-new_list')})
        app.api.api_new.new_list({user_id: app.data.user_id}).then(res => {
            app.data.new_list = res.data
            wx.setStorage({key: 'index-new_list', data: res.data})
            this.setData({new_list: res.data})
        })
    },

    new_tab() {
        app.api.api_new.tab().then(res => {

            this.setData({
                new_tab: res.data,
            })
        })
    },

    home_list() {
        this.setData({home_list: wx.getStorageSync('index-home_list')})
        app.api.api_new.home_list({user_id: app.data.user_id, type: 1 + this.data.tabIndex}).then(res => {
            wx.setStorage({key: 'index-home_list', data: res.data})
            this.setData({
                home_list: res.data,
            })
        })
    },

    go(e) {
        app.data.index_item = e.currentTarget.dataset.item
        wx.navigateTo({url: '/packageA/commodity_info/commodity_info'})
    },

    news_go(e) {
        app.data.new_info = e.currentTarget.dataset.item
        app.data.new_list_index = e.currentTarget.dataset.index
        wx.navigateTo({url: '/packageA/new_info/new_info'})
    },

})


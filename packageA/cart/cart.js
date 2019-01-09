const app = getApp()

Page({

    data: {
        tabBar: 2,
        /**event**/
        tabIndex: 1,
        // 是否全选
        isSelectAll: false,
        // 总价格
        countPrice: 0,
        /**api**/
        goodsType: [],
        cartList: [],
        specialGoods: [],
    },
    onLoad() {
        app.status()
        this.init()
    },

    init() {
        app.data.tabBar = 2


        this.cartList().then(() => {

            this.setData({
                load: true,
                check: app.data.check,
            })

        })
    },

    /****模态框****/

    // 删除
    del() {
        if (!this.data.lock) return wx.showToast({title: '议价中', icon: 'none'})
        app.api.apiA.delCart({user_id: app.data.user_id, cart_id: [this.data.cart_id]}).then(res => {
            if (res.response === 'data') {
                this.cartList()
            }
        })
    },

    // 长按
    press(e) {
        const {cart_id, lock} = e.currentTarget.dataset
        this.data.cart_id = cart_id
        this.data.lock = lock
        this.setData({
            modal: true,
        })
    },

    // 关闭模态框
    modalClose() {
        this.setData({modal: false})
    },

    /********************event********************/

    // 加减数量
    quantity(e) {
        const name = e.target.dataset.name
        let {index, item, cart_id, number} = e.currentTarget.dataset

        // 通过name判断增减
        switch (name) {
            case 'less':
                if (number > 1) --number
                else return
                break
            case 'add':
                ++number
                break
            default:
                return
        }

        // 修改数据库商品数量
        this.updateCart(cart_id, number).then(res => {
            // 接收受当前项,并修改数量
            item.total = number
            if (res >= 0) item.total = res
            // 通过当前项下标找到并覆盖数组
            this.data.cartList[index] = item
            // 刷新页面数量
            this.setData({
                cartList: this.data.cartList,
            })
            this.countPrice()
        })
    },

    // 输入数量
    inputQuantity(e) {
        let number = Number(e.detail.value)
        if (isNaN(number)) return
        const {index, item, cart_id} = e.currentTarget.dataset
        if (number <= 0) number = 0
        this.updateCart(cart_id, number).then(res => {
            // 接收受当前项,并修改数量
            item.total = number
            if (res >= 0) item.total = res
            // 通过当前项下标找到并覆盖数组
            this.data.cartList[index] = item
            // 刷新页面数量
            this.setData({
                cartList: this.data.cartList,
            })
            this.countPrice()
        })
    },

    // 勾选商品
    selectItem(e) {
        const {index, cart_id, check, total} = e.target.dataset
        if (total <= 0) return wx.showToast({title: '不能选数量为0的商品~', icon: 'none'})
        // 修改单个商品状态
        this.selectedItem([{cart_id, check}]).then(res => {
            // 修改完毕则刷新视图
            this.data.cartList[index].check = check
            this.setData({
                cartList: this.data.cartList,
            })
            // 判断是否全部选中
            this.isSelectAll()
            // 计算价格
            this.countPrice()
        })
    },

    //全选商品
    selectAll(e) {
        let selectall = e.target.dataset.selectall
        const arr = []
        const cartList = this.data.cartList
        // 遍历购物车每个商品 修改选中状态
        for (let i = 0; i < cartList.length; i++) {
            // 生成参数
            arr.push({
                cart_id: cartList[i].cart_id,
                check: selectall,
            })
            // 修改状态
            cartList[i].check = selectall
        }
        // 刷新视图
        this.setData({
            selectCount: selectall ? cartList.length : 0,
            // 修改全选状态
            isSelectAll: selectall,
            cartList,
        })
        //请求接口
        this.selectedItem(arr)
        this.countPrice()
    },

    // 判断是不是全选,以及勾选数量
    isSelectAll() {
        // 判断购物车选中的数量是否与总数相等
        const cartList = this.data.cartList
        const len = cartList.length
        let number = 0
        let nullNumber = 0
        let nullArr = []
        for (let i = 0; i < len; i++) {
            if (cartList[i].check && cartList[i].total === 0) {
                nullArr.push({cart_id: cartList[i].cart_id, check: false})
                cartList[i].check = false
                ++nullNumber
            } else if (cartList[i].check) {
                ++number
            }
        }

        if (nullNumber > 0) {
            wx.showToast({title: '不能选数量为0的商品~', icon: 'none'})
            setTimeout(() => {
                this.selectedItem(nullArr)
            }, 1111)
            return
        }

        // 相等数量则为true
        this.setData({
            cartList: this.data.cartList,
            selectCount: number,
            isSelectAll: len === number,
        })


    },

    // 计算总价格
    countPrice() {
        const cartList = this.data.cartList
        let countPrice = 0
        for (let i = 0; i < cartList.length; i++) {
            if (cartList[i].check) {
                countPrice += cartList[i].price * cartList[i].total
            }
        }
        this.setData({
            countPrice: countPrice.toFixed(2),
        })
    },
    /****结算****/

    // 议价
    bargain() {
        app.status()
        // 获取选中的商品
        const arrItem = this.getSelectedItem()
        const arr = []

        if (!arrItem.length) {
            return wx.showToast({title: '你还没有选择商品哦', icon: 'none'})
        }
        // 判断有没有正在议价的商品并选中
        for (let i = 0; i < arrItem.length; i++) {
            if (!arrItem[i].lock) return wx.showToast({title: '有商品正在议价中哦~', icon: 'none'})
            arr.push(arrItem[i].cart_id)
        }

        wx.showModal({
            title: '特价商品不能议价!',
            content: '将为您勾选可议价商品!',
            success: (e) => {
                if (e.cancel) return

                this.bargaining(arr)
            },
        })
    },

    // 结算
    settlement() {
        const arr = this.getSelectedItem()

        // 判断有没有正在议价的商品
        for (let i = 0; i < arr.length; i++) {
            if (!arr[i].lock) return wx.showToast({title: '有商品正在议价中哦~', icon: 'none'})
        }

        if (!arr.length) {
            return wx.showToast({title: '你还没有选择商品哦', icon: 'none'})
        }
        app.data.orderPrice = this.data.countPrice

        app.data.orderList = arr
        wx.navigateTo({url: '/packageA/settlement/settlement'})
    },

    // 获取选中的商品
    getSelectedItem() {
        const cartList = this.data.cartList
        const len = cartList.length

        const arr = []
        for (let i = 0; i < len; i++) {
            if (cartList[i].check) {
                arr.push(cartList[i])
            }
        }
        return arr
    },

    /********************api********************/

    // 议价
    bargaining(cart_id) {
        app.api.apiA.bargaining({user_id: app.data.user_id, cart_id}).then(res => {
            if (res.response === 'data') {
                wx.showToast({title: '已提交议价单', icon: 'none'})
                this.cartList()
            } else {

                const cart_id_arr = res.error.message.cart_id

                const arr = []
                for (let i = 0; i < cart_id_arr.length; i++) {
                    arr.push({cart_id: cart_id_arr[i], check: false})
                }

                this.selectedItem(arr)

                wx.showToast({title: res.error.message.msg, icon: 'none', duration: 3000})
            }
        })
    },

    // 选中商品保存到数据库
    selectedItem(check) {
        return app.api.apiA.updateCheck({user_id: app.data.user_id, check}).then(res => {
            if (res.response === 'data') {
                this.cartList()
            }
        })
    },

    // 购物车列表
    cartList() {
        return app.api.apiA.cartList({user_id: app.data.user_id}).then(res => {

            const list = res.data.list

            this.setData({
                cartList: list,
                priceAll: res.data.priceAll,
            })
            this.isSelectAll()
            // this.countPrice()
        })
    },

    // 修改商品数量
    updateCart(cart_id, total) {
        return app.api.apiA.updateCart({user_id: app.data.user_id, cart_id, total}).then(res => {
            if (res.response === 'data') {
                this.cartList()
            } else {
                this.cartList()
                wx.showToast({title: `${res.error.message}剩余${res.error.error_code.kucun}`, icon: 'none'})
                return res.error.error_code.kucun
            }
        })
    },

})

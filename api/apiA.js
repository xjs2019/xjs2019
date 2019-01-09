import {Ajax} from './ajax.js'

const ajax = new Ajax()

export default {
    /**common**/

    specialGoods(param) {
        return ajax.post('index/specialGoods', param)
    },
    // 运费
    shipping(param) {
        return ajax.post('order/shipping', param)
    },

    /**index**/

    // 议价单列表
    banner(param) {
        return ajax.post('index/indexBanner', param)
    },
    // 获取商品类型
    goodsType(param) {
        return ajax.post('index/goodsType', param)
    },
    // 获取商品规格
    goodsSpec(param) {
        return ajax.post('index/goodsSpec', param)
    },
    // 根据商品规格获取商品ID
    getGoodsID(param) {
        return ajax.post('index/getGoodsID', param)
    },

    /**cart**/

    // 添加购物车
    addCart(param) {
        return ajax.post('cart/add', param)
    },
    // 购物车列表
    cartList(param) {
        return ajax.post('cart/cartList', param)
    },
    // 删除购物车
    delCart(param) {
        return ajax.post('cart/delete', param)
    },
    // 修改商品数量
    updateCart(param) {
        return ajax.post('cart/update', param)
    },
    // 获取选中商品总价
    totalPrice(param) {
        return ajax.post('order/price', param)
    },
    // 修改购物车选中
    updateCheck(param) {
        return ajax.post('cart/updateCheck', param)
    },
    // 修改购物车选中
    bargaining(param) {
        return ajax.post('cart/bargaining', param)
    },

    /**my**/

    // 个人信息
    info(param) {
        return ajax.post('user/info', param)
    },
    // 修改头像
    editHeadImg(param) {
        return ajax.post('user/editHeadImg', param)
    },

    /**order**/

    // 订单列表
    orderList(param) {
        return ajax.post('order/orderList', param)
    },
    // 提交订单
    addOrder(param) {
        return ajax.post('order/add', param)
    },
    // 订单详情
    orderInfo(param) {
        return ajax.post('order/info', param)
    },
    // 删除订单
    delOrder(param) {
        return ajax.post('order/delete', param)
    },
    // 确认收货
    closed(param) {
        return ajax.post('order/closed', param)
    },
    // 查支付费用
    cheque(param) {
        return ajax.post('order/cheque', param)
    },


    /**address**/

    // 收货地址列表
    addressList(param) {
        return ajax.post('user/addressList', param)
    },

    // 获取省/市/区
    getAddress(param) {
        return ajax.post('user/getaddr', param)
    },

    // 新增收货信息
    addAddress(param) {
        return ajax.post('user/addAddress', param)
    },

    // 新增收货信息
    edieAddr(param) {
        return ajax.post('user/edieAddr', param)
    },


    // 删除收货地址
    delAddress(param) {
        return ajax.post('user/deladdr', param)
    },

    // 修改默认地址
    editDefaultAddr(param) {
        return ajax.post('user/editmorenaddr', param)
    },

    // 获取默认地址
    getDefaultAddr(param) {
        return ajax.post('user/morenaddr', param)
    },

    /**开票信息**/

    // 新增开票信息
    addInvoice(param) {
        return ajax.post('user/addInvoice', param)
    },

    // 修改开票信息
    editInvoice(param) {
        return ajax.post('user/editInvoice', param)
    },
    // 开票信息列表
    invoiceList(param) {
        return ajax.post('user/invoiceList', param)
    },
    // 开票信息列表
    delBilling(param) {
        return ajax.post('user/delkaipiao', param)
    },
    // 开票信息列表
    editDefaultBilling(param) {
        return ajax.post('user/editmorenkaipiao', param)
    },
    // 开票信息列表
    getDefaultBilling(param) {
        return ajax.post('user/morenkaipiao', param)
    },

    /**售后**/

    // 我的售后
    myQuestion(param) {
        return ajax.post('order/myQuestion', param)
    },
    // 申请售后
    question(param) {
        return ajax.post('order/question', param)
    },
    // 我的业务员
    mySalesman(param) {
        return ajax.post('User/getAdmin', param)
    },


    /**~**/

    // 修改密码
    editPassword(param) {
        return ajax.post('user/editPassword', param)
    },
    // 管理员改密码
    adminPassword(param) {
        return ajax.post('user/adminPassword', param)
    },

    /**~**/

    // 我的议价单
    userBbargaining(param) {
        return ajax.post('user/userBbargaining', param)
    },
    // 议价商品下单
    confirmOrder(param) {
        return ajax.post('order/confirmOrder', param)
    },

}

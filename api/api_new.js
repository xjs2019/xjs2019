import {Ajax} from './ajax'

const ajax = new Ajax()

export default {

    // 新闻列表
    new_list(param) {
        return ajax.post('news/index', param)
    },

    // 首页tab
    tab(param) {
        return ajax.post('index/goodClass', param)
    },

    // 首页商品
    home_list(param) {
        return ajax.post('index/goodList', param)
    },
    // 特价商品
    special_price(param) {
        return ajax.post('index/bargain', param)
    },

    // 特价详情
    special_info(param) {
        return ajax.post('index/bargainInfo', param)
    },

    // 新闻详情
    news_info(param) {
        return ajax.post('news/info', param)
    },

    // 查询详情
    goods_info(param) {
        return ajax.post('goods/info', param)
    },

    // 查询详情
    go_info(param) {
        return ajax.post('goods/goodInfo', param)
    },

    // 获取用户信息
    user_info(param) {
        return ajax.post('user/info', param)
    },

    // 获取用户信息
    edit_info(param) {
        return ajax.post('user/editInfo', param)
    },

    buy_now(param) {
        return ajax.post('order/naoAdd', param)
    },

    goodInfo(param) {
        return ajax.post('goods/goodInfo', param)
    },

    statistics(param) {
        return ajax.post('goods/tongji', param)
    },

    // 意见反馈
    feedback(param) {
        return ajax.post('user/feedback', param)
    },

    // 查看状态
    checkStatus(param) {
        return ajax.post('login/checkStatus', param)
    },

    // 生成二维码
    getqrcode(param) {
        return ajax.post('login/getqrcode', param)
    },

    // yuedu
    reading(param) {
        return ajax.post('news/reading', param)
    },

    // delimage
    delimage(param) {
        return ajax.post('login/delimage', param)
    },

}

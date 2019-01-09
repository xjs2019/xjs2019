import {Ajax} from './ajax'

const ajax = new Ajax()

export default {
    // 议价单列表
    bargaining(param) {
        return ajax.post('user/bargaining', param)
    },
    // 议价单列表
    submitBargaining(param) {
        return ajax.post('user/submitBargaining', param)
    },
    // 议价单详情
    bargainingInfo(param) {
        return ajax.post('user/bargainingInfo', param)
    },
    // 个人信息
    info(param) {
        return ajax.post('user/info', param)
    },
    // 我的消息
    message(param) {
        return ajax.post('user/message', param)
    },
    // 我的客户
    getUser(param) {
        return ajax.post('user/getUser', param)
    },
    // 客户的订单信息
    getUserOrder(param) {
        return ajax.post('order/getUserOrder', param)
    },
}

import {Ajax, imgUrl} from './ajax.js'
import apiA from './apiA.js'
import apiB from './apiB.js'
import apiC from './apiC.js'
import apiD from './apiD.js'
import api_new from './api_new.js'

const ajax = new Ajax()

export default {
    host: ajax.host,
    imgUrl,
    apiA,
    apiB,
    apiC,
    apiD,
    api_new,
    // 支付
    pay(param) {
        return ajax.post('Pay/wxPay', param)
    },
    // 登录
    login(param) {
        return ajax.post('login/login', param)
    },
    // 注册
    register(param) {
        return ajax.post('login/register', param)
    },
    // 获取验证码
    sms_code(param) {
        return ajax.post('login/sms_code', param)
    },
    // 找回密码
    retrievePassword(param) {
        return ajax.post('login/retrievePassword', param)
    },
    // 重置密码
    resetPassword(param) {
        return ajax.post('login/resetPassword', param)
    },
    // 个人中心背景图
    background(param) {
        return ajax.post('user/background', param)
    },
}

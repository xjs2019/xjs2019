import {Ajax} from './ajax'

const ajax = new Ajax()

export default {
    // 我的消息
    sale(param) {
        return ajax.post('user/sale', param)
    },
    // 我的消息
    opinion(param) {
        return ajax.post('user/opinion', param)
    },
    // BOSS审核议价单
    ckeckBargaining(param) {
        return ajax.post('user/ckeckBargaining', param)
    },
}


import {Ajax} from './ajax'

const ajax = new Ajax()

export default {
    // 商品出库列表
    goodsOutList(param) {
        return ajax.post('order/goodsOutList', param)
    },
    // 已出库列表
    onOutList(param) {
        return ajax.post('order/onOutList', param)
    },
    // 出库
    outTotal(param) {
        return ajax.post('order/outTotal', param)
    },
}

import {BMapWX} from './utils/bmap-wx'
import utils from './utils/index'

App({
    map: new BMapWX({ak: 'PY2E35X2HibdExMWuYxtzpXcKMT0AOxo'}),

    ...utils,

    imgUrl: 'https://www.szxjs.com.cn/upload/',

    uploadImg: `${utils.api.host}Login/uploadImg`,

    file_upload: `${utils.api.host}user/upImg`,

    data: {
        tabBar: 0,
    },

    time: {},

    onLaunch() {
        this.data.user_id = wx.getStorageSync('user_id')
        this.data.type = wx.getStorageSync('type')
        this.data.check = wx.getStorageSync('check')
    },

    status() {
        if (this.data.check !== 1) {
            return this.api.api_new.checkStatus({user_id: this.data.user_id}).then(res => {
                if (res.response === 'data') {
                    if (res.data.check === 1) {
                        this.data.check = res.data.check
                        wx.setStorageSync('check', res.data.check)
                    }
                }
            })
        }
    },

})

// globalData: {
//   userInfo: null,
//     timer: require('/plug/wxTimer.js')
// }
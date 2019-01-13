export const imgUrl = 'https://www.szxjs.com.cn/upload/'

export class Ajax {
    host = 'https://www.szxjs.com.cn/app/'

    get(url, data) {
        return this.request(url, data, 'GET')
    }

    post(url, data) {
        return this.request(url, data, 'POST')
    }

    request(url, data, method) {
        wx.showLoading({title: '请稍后', mask: true})
        return new Promise((resolve, reject) => {
            wx.request({
                url: this.host + url,
                data,
                method,
                header: {
                    token: wx.getStorageSync('token'),
                },
                success: (res) => {
                    wx.hideLoading()
                  //console.log(res.data + '/' + res.data.error + '/' + res.data.error['error_code'])
                    if (res.data && res.data.error && res.data.error['error_code'] === 88888) {
                        wx.clearStorageSync()

                        // wx.showToast({title: '登录过期', icon: 'none'})
                        wx.showToast({ title: '请登录', icon: 'none' })
                        setTimeout(() => {
                            wx.reLaunch({url: '/pages/login/login'})
                        }, 1500)
                    }
                    resolve(res.data)
                },
                fail: (res) => {
                    reject(res)
                },
            })
        })
    }

}

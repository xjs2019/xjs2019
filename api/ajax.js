export const imgUrl = 'https://www.szxjs.com.cn/upload/'
//export const imgUrl = '127.0.0.1/upload/'

export class Ajax {
    host = 'https://www.szxjs.com.cn/app/'
  //host = '127.0.0.1/app/'

    get(url, data) {
        return this.request(url, data, 'GET')
    }

    post(url, data) {
        return this.request(url, data, 'POST')
    }

    request(url, data, method) {
        wx.showLoading({title: '加载中', mask: true})
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
                  
                    if (res.data && res.data.error && res.data.error['error_code'] === 88888) {
                        wx.clearStorageSync()

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

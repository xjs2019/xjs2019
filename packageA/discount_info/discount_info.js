const app = getApp()

Page({

    data: {
        imgUrl: app.imgUrl,
        poster: false,
        actionSheetHidden: true,
    },

    onLoad(e) {

        this.setData({goodsSpec: wx.getStorageSync('info-discount_item')})
        app.api.api_new.goods_info({type: 1, id: e.scene || e.id || app.data.discount_item.id}).then(res => {
            if (res.response === 'data') {

                let goodsSpec = res.data.item

                goodsSpec.forEach(items => {
                    for (let i = 0; i < items.item.length; i++) {
                        if (items.item[i].check) {
                            items.index = i
                        }
                    }
                })

                for (let i = 0; i < goodsSpec.length; i++) {
                    if (goodsSpec[i].index === undefined) goodsSpec[i] = null
                }

                wx.setStorage({key: 'info-discount_item', data: goodsSpec})

                if (e.name) {
                    res.data.info.name = e.name
                    res.data.info.small_image = e.small_image
                }

                this.setData({
                    discount_item: res.data.info,
                    goodsSpec,
                    timeDown: timeDown(res.data.info.special_time_end * 1000),
                })

                setInterval(() => {
                    this.setData({timeDown: timeDown(res.data.info.special_time_end * 1000)})
                }, 1000)

                app.api.api_new.getqrcode({
                    id: e.id || app.data.discount_item.id,
                    path: '/packageA/discount_info/discount_info',
                }).then(res => {
                    console.log(res)
                })

            }
        })

    },

    // 商品规格改变
    pickerChange(e) {
        // 所有规格id
        const itemIndex = e.target.dataset.index
        // 选中规格数组下标
        const selectedIndex = e.detail.value
        //修改下标
        this.data.goodsSpec[itemIndex].index = selectedIndex
        this.setData({
            goodsSpec: this.data.goodsSpec,
        })
    },

    // 获取选择的类别id
    getSelectedType() {
        const arr = []
        const list = this.data.goodsSpec
        //遍历所有商品规格,将有index商品的item_id添加到数组返回出去
        for (let i = 0, len = list.length; i < len; i++) {
            if (list[i] === null) continue
            const index = list[i].index
            if (index !== undefined) {
                arr.push(list[i].item[index]['item_id'])
            }
        }
        return arr
    },

    // 加入购物车
    addCart(e) {

        if (this.data.discount_item.special_total <= 0) {
            return wx.showToast({title: '已抢光', icon: 'none'})
        }
        app.status()
        return new Promise(resolve => {
            if (!app.data.check) {
                wx.navigateTo({url: '/packageA/my_info_add/my_info'})
                return wx.showToast({title: '您还没有通过审核哦~', icon: 'none'})
            }

            // 规格数组
            const arr = this.getSelectedType()

            if (arr.length > 0) {
                app.api.apiA.getGoodsID({item_id: arr}).then(res => {
                    if (res.data) {
                        return app.api.apiA.addCart({user_id: app.data.user_id, goods_id: res.data.goods_id})
                    } else {

                        wx.showToast({title: res.error.message, icon: 'none'})
                    }
                }).then(res => {

                    if (res && res.response === 'data') {
                        wx.showToast({title: '添加购物车成功', icon: 'none'})
                        resolve()
                    } else {
                        wx.showToast({title: res.error.message, icon: 'none'})
                    }
                })
            } else {
                wx.showToast({title: '请选择类别', icon: 'none'})
            }
        })
    },

    buy_now() {
        if (this.data.discount_item.special_total <= 0) {
            return wx.showToast({title: '已抢光', icon: 'none'})
        }
        app.status()
        return new Promise(resolve => {
            if (!app.data.check) {
                wx.navigateTo({url: '/packageA/my_info_add/my_info'})
                return wx.showToast({title: '您还没有通过审核哦~', icon: 'none'})
            }

            // 规格数组
            const arr = this.getSelectedType()
            if (arr.length > 0) {

                app.api.api_new.goodInfo({user_id: app.data.user_id, item_id: arr}).then(res => {
                    if (res.response === 'data') {
                        app.data.buy_now = res.data.info
                        wx.navigateTo({url: '/packageA/settlement_buy/settlement'})
                    } else {
                        wx.showToast({title: res.error.message, icon: 'none'})
                    }
                })

            } else {
                wx.showToast({title: '请选择类别', icon: 'none'})
            }
        })
    },

    listenerActionSheet() {
        this.setData({actionSheetHidden: !this.data.actionSheetHidden})
    },

    onShareAppMessage() {
        return {
            title: `限时秒杀-￥${this.data.discount_item.special_price}-${this.data.discount_item.name}`,
            path: `packageA/discount_info/discount_info?id=${this.data.discount_item.id}&name=${this.data.discount_item.name}&small_image=${this.data.discount_item.small_image}`,
            imageUrl: `${this.data.imgUrl}${this.data.discount_item.small_image}`,
        }
    },

    // 海报
    poster() {
        this.setData({actionSheetHidden: !this.data.actionSheetHidden})

        wx.showLoading({title: '海报生成中...'})

        wx.getImageInfo({   //  小程序获取图片信息API
            src: `${this.data.imgUrl + this.data.discount_item.small_image}`,
            success: (res) => {
                this.setData({banner: res.path})
            },
        })

        new Promise(resolve => {
            app.api.api_new.getqrcode({
                id: this.data.discount_item.id,
                path: 'packageA/discount_info/discount_info',
            }).then(res => {
                resolve(res.image)
            })
        }).then(res => {
            const image = res
            wx.getImageInfo({   //  小程序获取图片信息API
                src: `${this.data.imgUrl + image}`,
                success: (res) => {
                    this.setData({qr_code: res.path})

                    this.cs()

                    app.api.api_new.delimage({image}).then(res => {

                    })
                },
            })

        })

    },


    cs() {

        const ctx = wx.createCanvasContext('canvas_poster')
        ctx.clearRect(0, 0, 280, 290)
        ctx.draw()
        // 阴影
        ctx.setShadow(0, 0, 5, '#ccc')
        ctx.setFillStyle('#FFFFFF')
        ctx.fillRect(5, 5, 270, 280)
        ctx.draw(true)

        ctx.setShadow(0, 0, 0, '#FFF')

        // 绘制顶部banner
        ctx.drawImage(this.data.banner, 5, 5, 270, 155)
        ctx.draw(true)

        // 绘制视频名称
        ctx.setTextAlign('left')
        ctx.setFillStyle('#000')
        ctx.setFontSize(14)
        ctx.fillText(this.data.discount_item.name, 10, 180)
        ctx.draw(true)

        // 绘制小程序码
        ctx.drawImage(this.data.qr_code, 18, 200, 71, 71)
        ctx.draw(true)

        // 绘制二维码右边说明
        ctx.setFillStyle('#666')
        ctx.setTextAlign('left')
        ctx.setFontSize(14)
        ctx.fillText('长按识别小程序码访问', 100, 240)
        ctx.draw(true)

        this.setData({poster: true})

        wx.hideLoading()
    },

    //保存图片至相册
    savePoster() {

        wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: 280,
            height: 290,
            destWidth: 750,
            destHeight: 780,
            quality: 1,
            canvasId: 'canvas_poster',
            fileType: 'jpg',
            success: (res) => {
                wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success: (res) => {
                        wx.hideLoading()
                        this.setData({poster: false})
                        wx.showToast({title: '保存成功'})
                    },
                    fail: () => {
                        this.setData({poster: false})
                        wx.hideLoading()
                    },
                })
            },
        })

    },

})

// 倒计时
function timeDown(timestamp) {
    //结束时间
    let endDate = new Date(timestamp)
    //当前时间
    let nowDate = new Date()
    //相差的总秒数
    let totalSeconds = parseInt((endDate - nowDate) / 1000)
    if (totalSeconds < 0) return '活动已结束'
    //天
    let days = Math.floor(totalSeconds / (60 * 60 * 24))
    //取模（余数）
    let modulo = totalSeconds % (60 * 60 * 24)
    //时
    let hours = Math.floor(modulo / (60 * 60))
    modulo = modulo % (60 * 60)
    //分
    let minutes = Math.floor(modulo / 60)
    //秒
    let seconds = modulo % 60

    return `结束时间:${days}天${hours}小时${minutes}分${seconds}秒`
}

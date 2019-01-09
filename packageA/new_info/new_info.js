const app = getApp()

Page({

    data: {
        imgUrl: app.imgUrl,
        poster: false,
        actionSheetHidden: true,
    },

    onLoad(e) {
        this.data.id = e.scene || e.id || app.data.new_info.id

        app.api.api_new.news_info({
            user_id: app.data.user_id || 0,
            id: e.scene || e.id || app.data.new_info.id,
        }).then(res => {
            if (res.response === 'data') {
                this.setData({
                    item: res.data,
                })
            }
        })

        if (!app.data.new_list) {
            app.api.api_new.new_list({user_id: app.data.user_id}).then(res => {
                app.data.new_list = res.data

                for (let i = 0; i < res.data.length; i++) {

                    if (res.data[i].id === Number(this.data.id)) {
                        app.data.new_list_index = i
                        break
                    }
                }

                this.setData({new_list: res.data})
            })
        }

        this.reading(this.data.id)

    },

    reading(id) {
        app.api.api_new.reading({id}).then(res => {
            console.log(res)
        })
    },

    listenerActionSheet() {
        this.setData({actionSheetHidden: !this.data.actionSheetHidden})
    },

    onShareAppMessage() {
        return {
            title: this.data.item.title,
            path: `/packageA/new_info/new_info?id=${this.data.item.id}`,
            imageUrl: `${this.data.imgUrl}${this.data.item.image}`,
        }
    },

    previous() {
        const new_list = app.data.new_list
        let index = app.data.new_list_index

        if (index === 0) {
            return wx.showToast({title: '没有上一篇了~', icon: 'none'})
        }

        app.data.new_list_index = --index
        this.setData({item: new_list[index]})

        this.reading(this.data.item.id)
    },

    next() {

        const new_list = app.data.new_list
        let index = app.data.new_list_index

        if (index === new_list.length - 1) {
            return wx.showToast({title: '没有下一篇了~', icon: 'none'})
        }

        app.data.new_list_index = ++index
        this.setData({item: new_list[index]})

        this.reading(this.data.item.id)
    },

    // 海报
    poster() {
        this.setData({actionSheetHidden: !this.data.actionSheetHidden})

        wx.showLoading({title: '海报生成中...'})

        wx.getImageInfo({   //  小程序获取图片信息API
            src: `${this.data.imgUrl + this.data.item.image}`,
            success: (res) => {
                this.setData({banner: res.path})
            },
        })

        new Promise(resolve => {
            app.api.api_new.getqrcode({
                id: this.data.item.id,
                path: 'packageA/new_info/new_info',
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
        ctx.fillText(this.data.item.title, 10, 180, 260)

        const metrics = ctx.measureText(this.data.item.title)
        console.log(metrics.width)

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

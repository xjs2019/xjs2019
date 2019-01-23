const app = getApp()

Page({

    data: {
        imgUrl: app.imgUrl,
        tabIndex: 1,
        poster: false,
        actionSheetHidden: true,
    },

    onLoad(e) {
        this.setData({goodsSpec: wx.getStorageSync('info-goodsSpec')})

        app.api.api_new.goods_info({type: 2, id: e.scene || e.id || app.data.index_item.id}).then(res => {
            if (res.response === 'data') {

                let goodsSpec = res.data.item

                goodsSpec.forEach(items => {
                    items.item.unshift({item: '不限'})
                    for (let i = 0; i < items.item.length; i++) {
                        if (items.item[i].check) {
                            items.index = i
                        }
                    }
                })

                wx.setStorage({key: 'info-goodsSpec', data: goodsSpec})

                if (e.name) {
                    res.data.info.name = e.name
                    res.data.info.small_image = e.small_image
                }

                app.data.index_item = res.data.info
              //console.log(Number(res.data.type))

                if (res.data.check !==  app.data.check) {
                    wx.setStorageSync('check', res.data.check)
                }
                //this.init()
                this.setData({check: app.data.check, index_item: res.data.info, goodsSpec})

            }

        })
    },

    // 商品规格改变
    pickerChange(e) {
        var data2 = {}
        // 所有规格数组下标
        const itemIndex = e.target.dataset.index
      
        // 选中规格数组下标
        const selectedIndex = e.detail.value
        
        //修改下标
        this.data.goodsSpec[itemIndex].index = selectedIndex
        //console.log(this.data.goodsSpec[itemIndex].item[selectedIndex])
        console.log(this.data.goodsSpec)
        var k=0;
        var check_n = '';
        this.data.goodsSpec.forEach(items => {
          //屏蔽点击项的后面
          if (k>itemIndex){
            this.data.goodsSpec[k].index = 0
            this.data.goodsSpec[k].option = 0
            //var mm ={ item: '不限' }
            this.data.goodsSpec[k].item[0].item = '不限'
          }
          //获取点击项的前面参数,itemIndex规格下标，规格参数下标
          if (k <= itemIndex){
            if (k == 0) {
              check_n += items.item[items.index].item
            }else{
              if (items.index >0){
                check_n += '-' + items.item[items.index].item
              }         
            }
          }
          k++;
        })
      console.log(check_n)
      //console.log(this.data.goodsSpec)
      
      data2.attr_id = itemIndex
      data2.checked_id = selectedIndex
      data2.total_num = this.data.goodsSpec.length
      data2.checked_name = check_n
      data2.first_name = this.data.goodsSpec[0].item[1]['item']
      
      console.log(data2)

      if (data2.attr_id+1 <data2.total_num){  
      
      
        
      var that = this; 
        
      app.api.apiA.goodsFilter({ 'data': data2 }).then(res => {
        var res2 =[]
        res2 = res['data']
        console.log(res2)

        if (res2 !== undefined){
          var next = []
          next = that.data.goodsSpec
            var next2 = []
            var next3 = []
            
            next2 = wx.getStorageSync('info-goodsSpec')
            //console.log(next4)
            
              console.log(next)
              console.log(next2)
              for (var i = 0; i < next2[itemIndex + 1].item.length; i++) {
                for (let j in res2) {
                  if (next2[itemIndex + 1].item[i].item == res2[j]) {
                    next3.push(next2[itemIndex + 1].item[i])
                    
                    
                  }
                }
              }
              console.log(next3)
              
              if (res2 == '401' && res2 == '402') {     
                next3.unshift({ item: '不限' })
              } else if(res2 == '400'){
                
                next3.unshift({ item: '不限' })
              }else{
                next[itemIndex + 1].option = 1
                next3.unshift({ item: '请选择' })
              }

              next[itemIndex + 1].item = next3
              that.setData({ goodsSpec: next })
          }
        })
      }else{
        this.setData({ goodsSpec: this.data.goodsSpec })
      }
      
    },

    // 获取选择的类别id
    getSelectedType() {
        const arr = []
        const list = this.data.goodsSpec
        //遍历所有商品规格,将有index商品的item_id添加到数组返回出去
        for (let i = 0, len = list.length; i < len; i++) {
            const index = list[i].index
            if (index !== undefined && index > 0) {
                arr.push(list[i].item[index]['item_id'])
            }
        }
        return arr
    },

    // 加入购物车
    addCart() {
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

    // // 商品类型切换
    // tab(e) {
    //   const {index} = e.target.dataset
    //   if (!index) return
    //   this.goodsSpec(index)
    //   this.setData({
    //     tabIndex: index,
    //   })
    // },

    // 获取商品类型
    goodsType() {
        app.api.apiA.goodsType().then(res => {
            this.setData({
                goodsType: res.data,
            })
        })
    },

    listenerActionSheet() {
        this.setData({actionSheetHidden: !this.data.actionSheetHidden})
    },

    onShareAppMessage() {
        return {
            title: `限时秒杀-￥${this.data.index_item.price || ''}-${this.data.index_item.name || ''}`,
            path: `packageA/commodity_info/commodity_info?id=${this.data.index_item.id}&name=${this.data.index_item.name}&small_image=${this.data.index_item.small_image}`,
            imageUrl: `${this.data.imgUrl}${this.data.index_item.small_image}`,
        }
    },


    buy_now() {
        app.status()

        return new Promise(resolve => {
          console.log(app.data.type)
          //Number(res.data.type)
          
          //app.data.type = Number(app.data.type)
          console.log()
          if (app.data.type ===' ' ){
            wx.navigateTo({ url: '/pages/login/login' })
            //return false
            return wx.showToast({ title: '您还未登录哦1~', icon: 'none' })
          } 
          if (app.data.type === '' && app.data.type != 0) {
            wx.navigateTo({ url: '/pages/login/login' })
            //return false
            return wx.showToast({ title: '您还未登录哦2~', icon: 'none' })
          } 
            if(!app.data.check  ) {
            //if (!app.data.check) {
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

    // 海报
    poster() {
        this.setData({actionSheetHidden: !this.data.actionSheetHidden})

        wx.showLoading({title: '海报生成中...'})

        wx.getImageInfo({   //  小程序获取图片信息API
            src: `${this.data.imgUrl + this.data.index_item.small_image}`,
            success: (res) => {
                this.setData({banner: res.path})
            },
        })

        new Promise(resolve => {
            app.api.api_new.getqrcode({
                id: this.data.index_item.id,
                path: 'packageA/commodity_info/commodity_info',
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
        ctx.fillText(this.data.index_item.name, 10, 180)
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

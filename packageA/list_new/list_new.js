const app = getApp()

Page({

    data: {
        nodes: '',
        imgUrl: app.imgUrl,
        page: 1,
        new_list: [],
        tabBar: 1,
        tabIndex: 1,
        
    },

    onLoad() {
      
      app.status()
      this.getNews()
      this.init()
      // wx.setTabBarBadge({
      //   index: 0,
      //   text: '1'
      // })
    },



  init() {
    app.data.tabBar = 1

    Promise.all([
      // this.goodsType(),
      // this.specialGoods(),
      this.new_list(),
    ]).then(() => {
      this.setData({
        load: true,
        check: app.data.check,
      })

    })
  },

    info(e) {
        app.data.new_info = e.currentTarget.dataset.item
        app.data.new_list_index = e.currentTarget.dataset.index
        wx.navigateTo({url: '/packageA/new_info/new_info'})
    },

    getNews(page = 1) {
        app.api.api_new.new_list({user_id: app.data.user_id, page}).then(res => {

            this.setData({
                new_list: this.data.new_list.concat(res.data),
            })
            app.data.new_list = this.data.new_list
        })
    },

    onReachBottom() {
        this.getNews(++this.data.page)
    },

})

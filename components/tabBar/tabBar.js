const app = getApp()

Component({
    properties: {
        setIndex: {
            type: Number,
            value: 0,
        },
        setTab: {
            type: Object,
            value: {
                color: '#8a8a8a',
              selectedColor: '#f64a48',
                list: [
                    {
                        pagePath: '/packageA/index_new/index',
                        text: '首页',
                        iconPath: '/image/order.png',
                        selectedIconPath: '/image/order1.png',
                    },
                    // {
                    //     pagePath: '/packageA/discount_zone_new/discount_zone',
                    //     text: '特价专区',
                    //     iconPath: '/image/tejia.png',
                    //     selectedIconPath: '/image/tejia2.png',
                    // },
                  {
                    pagePath: '/packageA/list_new/list_new',
                    text: '发现',
                    iconPath: '/image/fx.png',
                    selectedIconPath: '/image/fx2.png',
                  },
                    {
                        pagePath: '/packageA/cart/cart',
                        text: '购物车',
                        iconPath: '/image/cart.png',
                        selectedIconPath: '/image/cart1.png',
                    },
                  
                    
                    {
                        pagePath: '/packageA/my/my',
                        text: '个人中心',
                        iconPath: '/image/my.png',
                        selectedIconPath: '/image/my1.png',
                    }],
            },
        },
    },
    methods: {
        tab(e) {
            //判断跳转到页面是不是当前页面,当前页面直接结束
            if (app.data.tabBar !== e.currentTarget.dataset.index) {
                app.data.tabBar = e.currentTarget.dataset.index
                wx.redirectTo({url: e.currentTarget.dataset.path})
            }
        },
    },
})

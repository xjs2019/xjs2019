const app = getApp()

Page({

    data: {
        imgUrl: app.api.imgUrl,
    },

    onShow() {
        app.api.api_new.user_info({user_id: app.data.user_id}).then(res => {
            if (res.response === 'data') {
                this.setData({user_info: res.data})
            }
        })
    },

    view_image() {
        wx.previewImage({urls: [app.api.imgUrl + this.data.user_info.company_img]})
    },

    edit() {
        wx.navigateTo({url: '/packageA/my_info_add/my_info'})
    },

})

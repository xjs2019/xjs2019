Page({

    data: {
        name: '',
    },

    onLoad() {
        this.setData({
            name: wx.getStorageSync('name'),
        })
    },

})

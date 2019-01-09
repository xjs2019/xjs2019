const app = getApp()

Page({
    data: {
        modal: false,
    },

    onShow() {
        this.init()
    },

    init() {

        this.addressList()
    },

    // 选择地址
    selectAddress(e) {

        this.editDefaultAddr(e.currentTarget.dataset.id)
    },

    //删除
    del(e) {
        const id = e.currentTarget.dataset.id
        wx.showModal({
            content: '是否删除?',
            success: (res) => {
                if (res.confirm) {

                    app.api.apiA.delAddress({user_id: app.data.user_id, id: this.data.id || id}).then(res => {
                        if (res.response === 'data') {
                            this.addressList()
                        }
                    })
                } else if (res.cancel) {

                }
            },
        })

    },

    //长按地址
    press(e) {
        const id = e.currentTarget.dataset.id
        const item = e.currentTarget.dataset.item
        this.setData({
            item,
            id,
            modal: true,
        })
    },

    //关闭模态框
    modalClose() {
        this.setData({modal: false})
    },

    // 收获地址列表
    addressList() {
        app.api.apiA.addressList({user_id: app.data.user_id}).then(res => {
            this.setData(({
                addressList: res.data,
            }))

        })
    },

    // 修改默认地址
    editDefaultAddr(id) {
        app.api.apiA.editDefaultAddr({user_id: app.data.user_id, id}).then(res => {

            wx.navigateBack()
        })
    },

    edit(e) {
        app.data.edit_address = this.data.item || e.currentTarget.dataset.item
        wx.navigateTo({url: '/packageA/address_add/address_add?edit=true'})
    },
})

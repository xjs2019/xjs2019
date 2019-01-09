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

    // 选择开票信息
    selectBilling(e) {

        this.editDefaultBilling(e.currentTarget.dataset.id)
    },

    //删除
    del(e) {
        const id = e.currentTarget.dataset.id
        wx.showModal({
            content: '是否删除?',
            success: (res) => {
                if (res.confirm) {

                    app.api.apiA.delBilling({user_id: app.data.user_id, id: this.data.id || id}).then(res => {
                        if (res.response === 'data') {
                            this.addressList()
                        }
                    })
                }
            },
        })
    },

    //长按地址
    press(e) {
        const id = e.currentTarget.dataset.id
        const item = e.currentTarget.dataset.item
        this.setData({
            id,
            modal: true,
            item,
        })
    },

    //关闭模态框
    modalClose() {
        this.setData({modal: false})
    },

    addressList() {
        app.api.apiA.invoiceList({user_id: app.data.user_id}).then(res => {
            this.setData(({
                invoiceList: res.data,
            }))

        })
    },

    // 修改默认地址
    editDefaultBilling(id) {
        app.api.apiA.editDefaultBilling({user_id: app.data.user_id, id}).then(res => {

            wx.navigateBack()
        })
    },

    edit(e) {
        app.data.edit_invoice = this.data.item || e.currentTarget.dataset.item
        wx.navigateTo({url: '/packageA/invoice_add/invoice_add?edit=true'})
    },

})

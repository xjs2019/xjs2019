const app = getApp()

Page({

    data: {},

    onLoad(e) {
        if (e.edit) {
            const invoice = app.data.edit_invoice
            this.setData({
                edit: e.edit,
                id: invoice.id,
                company: invoice.company,
                address: invoice.address,
                identify: invoice.identify,
                account: invoice.account,
                bank: invoice.bank,
                phone: invoice.phone,
                fax: invoice.fax,
                shou_name: invoice.shou_name,
                shou_phone: invoice.shou_phone,
                shou_area: invoice.shou_area,
            })
        }
    },

    // 表单数据绑定
    getInput(e) {
        app.common.getInput(this, e)
    },

    // 保存收票人
    save() {
        const {company, address, identify, account, bank, phone, fax, shou_name, shou_phone, shou_area} = this.data


        if (this.data.edit) {

            app.api.apiA.editInvoice({
                user_id: app.data.user_id,
                id: this.data.id,
                company,
                address,
                identify,
                account,
                bank,
                phone,
                fax,
                shou_name,
                shou_phone,
                shou_area,
            }).then(res => {
                if (res.response === 'data') {
                    wx.navigateBack({})
                    wx.showToast({title: '开票信息添加成功', icon: 'none'})
                } else {
                    wx.showToast({title: '请完善信息', icon: 'none'})
                }
            })

        } else {

            app.api.apiA.addInvoice({
                user_id: app.data.user_id,
                company,
                address,
                identify,
                account,
                bank,
                phone,
                fax,
                shou_name,
                shou_phone,
                shou_area,
            }).then(res => {
                if (res.response === 'data') {
                    wx.navigateBack({})
                    wx.showToast({title: '开票信息添加成功', icon: 'none'})
                } else {
                    wx.showToast({title: '请完善信息', icon: 'none'})
                }
            })

        }


    },

})

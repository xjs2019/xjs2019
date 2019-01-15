const app = getApp()

Page({

    data: {
        imgUrl: app.api.imgUrl,
        sex: 1,
    },

    onLoad() {
        app.api.api_new.user_info({user_id: app.data.user_id}).then(res => {
            if (res.response === 'data') {
                console.log(res)
                this.setData({
                   // company_img: res.data.company_img,
                    name: res.data.name,
                    sex: res.data.sex,
                    company: res.data.company,
                   // areas: res.data.areas,
                })
            }
        })
    },

    setImage() {
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: res => {
                const tempFilePaths = res.tempFilePaths

                wx.uploadFile({
                    url: app.uploadImg,
                    filePath: tempFilePaths[0],
                    name: 'image',
                    success: res => {
                        const company_img = JSON.parse(res.data).data
                        this.setData({company_img})
                    },
                })

            },
        })
    },

    sexChange(e) {
        this.setData({
            sex: Number(e.detail.value),
        })
    },

    add() {
        const name = this.data.name
        //const areas = this.data.areas
        const sex = this.data.sex
        //const company_img = this.data.company_img
        const company = this.data.company
        let reg = /^[a-z_\d]+$/
        if (!name) return wx.showToast({title: '请填写姓名', icon: 'none'})
        //if (!areas) return wx.showToast({title: '请填写微信号', icon: 'none'})
        //if (!reg.test(areas)) return wx.showToast({title: '微信号格式不正确', icon: 'none'})
        //if (!company_img) return wx.showToast({title: '请上传营业执照', icon: 'none'})
        if (!company) return wx.showToast({ title: '请填写公司名称', icon: 'none' })

        //app.api.api_new.edit_info({user_id: app.data.user_id, name, sex, areas, company_img}).then(res => {
      app.api.api_new.edit_info({ user_id: app.data.user_id, name, sex, company}).then(res => {
            if (res.response === 'data') {
                wx.showToast({title: '个人信息修改成功', icon: 'none'})
                //wx.navigateBack()
                //parent.location.reload()
                wx.reLaunch({url: '/pages/index_new/index'})
            }
        })
    },

    // 表单数据绑定
    getInput(e) {
        app.common.getInput(this, e)
    },

})

// 2019-1-7
wx.removeStorageSync("token");

wx.clearStorage();

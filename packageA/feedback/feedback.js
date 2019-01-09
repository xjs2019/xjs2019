const app = getApp()

Page({

    data: {},

    feedback() {

        if (!this.data.content) {
            return wx.showToast({title: '请输入内容!', icon: 'none'})
        }

        app.api.api_new.feedback({user_id: app.data.user_id, content: this.data.content}).then(res => {
            if (res.response === 'data') {
                wx.showToast({title: '提交成功!'})
                setTimeout(function () {
                    wx.navigateBack()
                }, 1000)
            }
        })
    },

    // 表单数据绑定
    getInput(e) {
        app.common.getInput(this, e)
    },

})

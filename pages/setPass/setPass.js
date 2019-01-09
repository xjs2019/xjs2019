const app = getApp()

Page({

    data: {
        password: '',
        re_password: '',
    },

    onLoad(e) {
        this.data.token = e.token
        this.data.user_id = e.user_id
    },

    getInput(e) {
        app.common.getInput(this, e)
    },

    post() {
        if (this.data.password !== this.data.re_password) {
            return wx.showToast({title: '两次密码输入不一致', icon: 'none'})
        }

        app.api.resetPassword({
            user_id: this.data.user_id,
            token: this.data.token,
            password: this.data.password,
        }).then(res => {
            if (res.response === 'data') {
                wx.showToast({title: '重置密码成功', icon: 'success'})
                setTimeout(function () {
                    wx.reLaunch({url: '/pages/login/login'})
                }, 1111)
            } else {
                wx.showToast({title: res.error.message, icon: 'none'})
            }
        })
    },

})

const app = getApp()

Page({

    data: {
        disabled: false,
        time: '获取验证码',
        currentTime: 60,
        button: 'button',
    },


    // 获取验证码
    getCode() {
        if (!app.common.regexp('phoneNumber', this.data.mobile)) {
            return wx.showToast({title: '请输入正确手机号码', icon: 'none'})
        }

        app.api.sms_code({
            type: 2,
            mobile: this.data.mobile,
        }).then(res => {
            if (res.response === 'data') {
                this.getVerificationCode()
                this.setData({disabled: true})
            } else {
                wx.showToast({title: '获取失败', icon: 'none'})
            }
        })
    },

    // 下一步
    post() {
        const {mobile, sms_code} = this.data
        app.api.retrievePassword({
            mobile,
            sms_code,
        }).then(res => {
            if (res.response === 'data') {
                wx.showToast({title: '验证成功', icon: 'success'})
                setTimeout(() => {
                    wx.navigateTo({url: `/pages/setPass/setPass?user_id=${res.data.user_id}&token=${res.data.token}`})
                }, 1111)
            } else {
                wx.showToast({title: res.error.message, icon: 'none'})
            }
        })
    },

    getInput: function (e) {
        app.common.getInput(this, e)
    },

    // 验证码倒计时
    getVerificationCode() {
        let currentTime = this.data.currentTime
        this.setData({button: 'nobutton', time: currentTime + '秒'})
        let interval = setInterval(() => {
            currentTime--
            this.setData({time: currentTime + '秒'})
            if (currentTime < 1) {
                clearInterval(interval)
                this.setData({
                    time: '重新发送',
                    currentTime: 60,
                    disabled: false,
                    button: 'button',
                })
            }
        }, 1000)
    },

})

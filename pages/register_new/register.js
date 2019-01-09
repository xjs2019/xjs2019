const app = getApp()

Page({

    data: {
        img: app.api.imgUrl,
        disabled: false,
        time: '获取验证码',
        currentTime: 60,
        button: 'button',
    },

    onLoad() {
        this.setData({invite: app.data.scene || ''})
    },

    // 获取验证码
    getCode() {
        if (!app.common.regexp('phoneNumber', this.data.mobile)) {
            return wx.showToast({title: '请输入正确手机号码', icon: 'none'})
        }

        app.api.sms_code({
            type: 1,
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

    // 表单数据绑定
    getInput(e) {
        app.common.getInput(this, e)
    },

    // 同意协议
    agree() {
        this.setData({
            agree_state: !this.data.agree_state,
        })
    },

    // 注册
    post() {
        if (!this.data.agree_state) {
            return wx.showToast({title: '请先同意注册协议', icon: 'none'})
        } else if (!this.data.mobile) {
            return wx.showToast({title: '手机号不能为空', icon: 'none'})
        } else if (!this.data.sms_code) {
            return wx.showToast({title: '验证码不能为空', icon: 'none'})
        } else if (!this.data.company) {
            return wx.showToast({title: '公司不能为空', icon: 'none'})
        } else if (this.data.re_password !== this.data.password) {
            return wx.showToast({title: '两次密码输入不一致', icon: 'none'})
        } else if (!this.data.re_password) {
            return wx.showToast({title: '密码不能为空', icon: 'none'})
        } else if (!this.data.password) {
            return wx.showToast({title: '密码不能为空', icon: 'none'})
        }

        const {
            mobile,
            invite,
            password,
            sms_code,
            company,
        } = this.data

        app.api.register({
            mobile,
            invite,
            password,
            sms_code,
            company,
        }).then(res => {
            if (res.response === 'data') {
                wx.showToast({title: '您的资料已提交,请耐心等待审核', icon: 'none', mask: true})
                setTimeout(function () {
                    wx.navigateBack()
                }, 1500)
            } else {
                wx.showToast({title: res.error.message, icon: 'none'})
            }
        })
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


    protocol() {
        wx.navigateTo({url: '/pages/protocol/protocol'})
    },
})

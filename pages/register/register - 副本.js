const app = getApp()

Page({

    data: {
        img: app.api.imgUrl,
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
            wx.showToast({title: '请先同意注册协议', icon: 'none'})
            return
        } else if (this.data.re_password !== this.data.password) {
            wx.showToast({title: '两次密码输入不一致', icon: 'none'})
            return
        }

        const {
            name,
            mobile,
            company,
            company_person,
            company_img,
            company_person_img,
            company_person_img2,
            password,
            sms_code,
            invite,
            id_card,
        } = this.data

        app.api.register({
            name,
            mobile,
            company,
            company_person,
            company_img,
            company_person_img,
            company_person_img2,
            password,
            sms_code,
            invite,
            id_card,
        }).then(res => {
            if (res.response === 'data') {
                app.data.user_id = res.data.user_id
                app.data.check = res.data.check
                wx.setStorageSync('name', res.data.mobile)
                wx.setStorageSync('token', res.data.token)
                wx.setStorageSync('user_id', res.data.user_id)
                wx.setStorageSync('type', res.data.type)
                wx.setStorageSync('check', res.data.check)
                wx.reLaunch({url: '/packageA/index_new/index'})

                /*wx.showToast({title: '您的资料已提交,请耐心等待审核', icon: 'none', mask: true})
                console.log(test1)

                
                setTimeout(function () {
                    wx.navigateBack()
                }, 1000)*/
            } else {
                wx.showToast({title: res.error.message, icon: 'none'})
            }
        })
    },

    // 上传图片
    upImg(e) {
        const name = e.currentTarget.dataset.name
        wx.chooseImage({
            count: 1,
            success: (res) => {
                app.common.uploadImg(app.uploadImg, res['tempFilePaths'][0]).then(res => {
                    res = JSON.parse(res.data)
                    if (res.response === 'data') {
                        if (name === 'company') {
                            this.setData({
                                company_img: res.data,
                            })
                        } else if (name === 'person') {
                            this.setData({
                                company_person_img: res.data,
                            })
                        } else if (name === 'person2') {
                            this.setData({
                                company_person_img2: res.data,
                            })
                        }
                    } else {
                        wx.showToast({title: '图片上传失败', icon: 'none'})
                    }
                })
            },
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

})

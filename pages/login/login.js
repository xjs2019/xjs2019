const app = getApp()

Page({

    data: {
        mobile: '',
        password: '',
    },

    onLoad(e) {
        app.data.scene = e.scene
        const type = wx.getStorageSync('type')
        if (typeof type === 'number') {
            this.isLogin(type)
        }
    },

    // 已经登录则直接跳转
    isLogin(type) {
        app.data.tabBar = 0
        // 会员类型；0会员；1业务员；3仓管；5 BOSS
        switch (type) {
            case 0:
                wx.reLaunch({url: '/packageA/index_new/index'})
                break
            case 3:
                wx.reLaunch({url: '/packageB/index/index'})
                break
            case 1:
                wx.reLaunch({url: '/packageC/index_new/index'})
                break
            case 5:
                wx.reLaunch({url: '/packageD/index/index'})
                break
        }
    },


    register() {
        wx.navigateTo({url: '/pages/register_new/register'})
    },

    // 登录
    login() {

        if (!this.data.mobile || !this.data.password) {
            return wx.showToast({title: '用户名或密码不能为空', icon: 'none'})
        }

        app.api.login({
            mobile: this.data.mobile,
            password: this.data.password,
        }).then(res => {
            if (res.response === 'data') {
                // 登录后存入缓存并存入全局变量
                app.data.user_id = res.data.user_id
                app.data.check = res.data.check
                wx.setStorageSync('name', this.data.mobile)
                wx.setStorageSync('token', res.data.token)
                wx.setStorageSync('user_id', res.data.user_id)
                wx.setStorageSync('type', res.data.type)
                wx.setStorageSync('check', res.data.check)

                wx.showToast({title: '登录成功'})
                setTimeout(() => {
                    this.isLogin(Number(res.data.type))
                }, 1000)
            } else {
                wx.showToast({title: res.error.message, icon: 'none'})
            }
        })
    },

    // 获取表单元素
    getInput(e) {
        app.common.getInput(this, e)
    },

})

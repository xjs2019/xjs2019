const app = getApp()

Page({

    data: {},

    onLoad() {

    },

    //获取表单数据
    getInput(e) {
        app.common.getInput(this, e)
    },

    //确认
    confirm() {

        const {pwd, repwd, repwd2} = this.data
        if (!pwd) return wx.showToast({title: '请输入原密码', icon: 'none'})
        if (!repwd) return wx.showToast({title: '请输入新密码', icon: 'none'})
        if (!repwd2) return wx.showToast({title: '请确认新密码', icon: 'none'})
        if (repwd !== repwd2) return wx.showToast({title: '两次密码输入不一致', icon: 'none'})

        let user = 'editPassword'

        if (app.data.type !== 0) {
            user = 'adminPassword'
        }

        app.api.apiA[user]({user_id: app.data.user_id, old_password: pwd, new_password: repwd}).then(res => {
            if (res.response === 'data') {
                wx.navigateBack({})
                wx.showToast({title: '密码修改成功', icon: 'none'})
            } else {
                wx.showToast({title: res.error.message, icon: 'none'})
            }
        })
    },

})

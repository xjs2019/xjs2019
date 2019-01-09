const app = getApp()

Page({

    data: {
        // 我的业务员
        salesman: {
            name: '张四',
            phone: '13888888888',
        },
    },

    onLoad(e) {
        this.init(e)
    },

    init(e) {
        const id = e.id
        this.data.id = id
        this.orderInfo(id)
        this.mySalesman(id)
    },

    // 初始化售后订单信息
    orderInfo(order_id) {
        app.api.apiA.orderInfo({user_id: app.data.user_id, order_id}).then(res => {
            if (res.response === 'data') {
                this.setData({
                    orderInfo: res.data,
                })
            }
        })
    },

    // 选中售后问题
    afterSaleChange(e) {
        const arr = e.detail.value

        let other = false
        let question = ''
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === 'other') {
                other = true
            } else {
                question += ',' + arr[i]
            }
        }
        if (!other) {
            this.data.otherQuestions = ''
        }
        this.setData({other, question})
    },

    // 提交售后问题
    submitAfterSale() {
        let question = ''
        if (this.data.question) {
            question += this.data.question
        }
        if (this.data.otherQuestions) {
            question += ',' + this.data.otherQuestions
        }
        if (!question) {
            return wx.showToast({title: '你还没有描述问题~', icon: 'none'})
        }
        app.api.apiA.question({
            user_id: app.data.user_id,
            order_id: this.data.id,
            question: question.substring(1),
        }).then(res => {
            if (res.response === 'data') {
                this.setData({
                    modal: true,
                })
            }
        })
    },

    // 我的业务员
    mySalesman() {
        app.api.apiA.mySalesman({user_id: app.data.user_id}).then(res => {
            this.setData({
                ...res.data,
            })
        })
    },

    contact() {
        wx.showActionSheet({
            itemList: ['拨打电话'],
            success: () => {
                wx.makePhoneCall({phoneNumber: this.data.contact})
            },
        })
    },

    // 模态框确确定
    modalBtn() {
        this.setData({modal: false})
        wx.navigateBack({})
    },

    getInput(e) {
        app.common.getInput(this, e)
    },
})

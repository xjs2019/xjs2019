const app = getApp()

Page({

    data: {},

    onLoad(e) {
        if (e.edit) {
            const address = app.data.edit_address
            console.log(address)
            this.setData({
                edit: e.edit,
                id: address.id,
                name: address.name,
                mobile: address.mobile,
                address: address.address,
                province: address.province,
                province_id: address.province_id,
                city: address.city,
                city_id: address.city_id,
                area: address.area,
                area_id: address.area_id,
            })
        }
        this.init()
    },

    init() {
        this.getProvince()
        this.getCitys()
        this.getAreas()
    },

    // 表单数据绑定
    getInput(e) {
        app.common.getInput(this, e)
    },

    // 保存地址
    save() {
        const {name, mobile, address, province, province_id, city, city_id, area, area_id} = this.data

        if (this.data.edit) {

            app.api.apiA.edieAddr({
                user_id: app.data.user_id,
                id: this.data.id,
                name,
                mobile,
                address,
                province,
                province_id,
                city,
                city_id,
                area,
                area_id,
            }).then(res => {
                if (res.response === 'data') {
                    wx.navigateBack({})
                    wx.showToast({title: '地址修改成功', icon: 'none'})
                } else {
                    wx.showToast({title: '请完善信息', icon: 'none'})
                }
            })

        } else {

            app.api.apiA.addAddress({
                user_id: app.data.user_id,
                name,
                mobile,
                address,
                province,
                province_id,
                city,
                city_id,
                area,
                area_id,
            }).then(res => {
                if (res.response === 'data') {
                    wx.navigateBack({})
                    wx.showToast({title: '地址添加成功', icon: 'none'})
                } else {
                    wx.showToast({title: '请完善信息', icon: 'none'})
                }
            })

        }


    },

    /********************省市区********************/

    // 地址确定
    cityChange(e) {
        const index = e.detail.value
        const province_id = this.data.citys[0][index[0]].area_id
        const city_id = this.data.citys[1][index[1]].area_id
        const area_id = this.data.citys[2][index[2]].area_id

        const province = this.data.citys[0][index[0]].area_name
        const city = this.data.citys[1][index[1]].area_name
        const area = this.data.citys[2][index[2]].area_name

        // console.log(province, city, area)
        // console.log(province_name, city_name, area_name)

        if (province_id && city_id && area_id) {
            this.setData({
                province,
                province_id,
                city_id,
                city,
                area_id,
                area,
                cityIndex: index,
            })
        } else {
            wx.showToast({title: '请选择完整地址', icon: 'none'})
            this.cityCancel()
        }

    },

    // 地址取消
    cityCancel() {
        this.setData({
            cityIndex: this.data.cityIndex,
        })
    },

    // 地址列改变
    cityColumnChange(e) {
        // 选中的列
        const {column, value} = e.detail
        const {area_id} = this.data.citys[column][value]
        if (column === 0) {
            // 获取市
            this.getCitys(area_id)
        } else if (column === 1) {
            // 获取区
            this.getAreas(area_id)
        }
    },

    // 省
    getProvince() {
        // 初始化省份
        app.api.apiA.getAddress({user_id: app.data.user_id, pid: 1}).then(res => {
            res.list.unshift({area_name: '请选择'})
            this.setData({
                cityIndex: [0, 0, 0],
                citys: [res.list, [{area_name: '请选择'}], [{area_name: '请选择'}]],
            })
        })
    },

    // 市
    getCitys(pid = 2) {
        app.api.apiA.getAddress({user_id: app.data.user_id, pid}).then(res => {
            res.list.unshift({area_name: '请选择'})
            this.setData({
                citys: [this.data.citys[0], res.list, [{area_name: '请选择'}]],
            })
        })
    },

    // 区
    getAreas(pid = 52) {
        app.api.apiA.getAddress({user_id: app.data.user_id, pid}).then(res => {
            res.list.unshift({area_name: '请选择'})
            this.setData({
                citys: [this.data.citys[0], this.data.citys[1], res.list],
            })
        })
    },

})

export default {

    /**
     * 表单数据绑定
     */
    getInput(that, e) {
        const name = e.target.dataset.name
        const val = e.detail.value

        that.setData({
            [name]: val,
        })
    },

    /**
     * 正则匹配
     * @param type 匹配类型
     * @param str 匹配字符串
     * @returns {boolean} 返回是否匹配
     */
    regexp(type, str) {
        let reg
        switch (type) {
            case 'chinese':     // 匹配中文字符
                reg = /[\u4e00-\u9fa5]/gm
                break
            case 'zipCode':     // 匹配邮政编码
                reg = /^[1-9]\d{5}(?!\d)$/
                break
            case 'email':       // 匹配email地址
                reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
                break
            case 'url':         // 匹配URL地址
                reg = /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i
                break
            case 'phoneNumber': // 匹配手机号码
                reg = /^(0|86|17951)?(13[0-9]|14[579]|15[012356789]|16[56]|17[1235678]|18[0-9]|19[89])\s?[0-9]{4}\s?[0-9]{4}$/
                break
            case 'idCard':      // 匹配身份证号
                reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/
                break
            default:
                throw new TypeError('找不到匹配的正则类型')
        }
        return reg.test(str)
    },

    // 小程序文件上传
    uploadImg(url, path) {
        return new Promise((resolve) => {
            wx.uploadFile({
                url,
                filePath: path,
                name: 'image',
                success: (res) => {
                    resolve(res)
                },
            })
        })
    },

}

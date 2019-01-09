Page({

    data: {
        phone: '0755-29808333',
    },

    dial() {
        wx.makePhoneCall({
            phoneNumber: this.data.phone,
        })
    },

})

function dateFormat(date, mask) {
    if (arguments.length === 1 && Object.prototype.toString.call(date) === '[object String]' && !/\d/.test(date)) {
        mask = date
        date = undefined
    }

    date = date || new Date()

    if (!(date instanceof Date)) {
        date = new Date(date)
    }

    if (isNaN(date)) {
        throw TypeError('Format Date Error')
    }

    mask = String(dateFormat.masks[mask] || mask || dateFormat.masks['default'])

    let arr = [{
        reg: /(Y+)/,
        replace: date.getFullYear(),
    }, {
        reg: /(M+)/,
        replace: date.getMonth() + 1,
    }, {
        reg: /(D+)/,
        replace: date.getDate(),
    }, {
        reg: /(H+)/,
        replace: date.getHours(),
    }, {
        reg: /(m+)/,
        replace: date.getMinutes(),
    }, {
        reg: /(s+)/,
        replace: date.getSeconds(),
    }, {
        reg: /(S+)/,
        replace: date.getMilliseconds(),
    }]

    let len = arr.length - 1
    let replace
    //处理年份
    if (arr[0].reg.test(mask)) {
        replace = arr[0].replace.toString()
        mask = mask.replace(RegExp.$1, replace.substring(4 - RegExp.$1.length))
    }
    //处理月日时分秒
    for (let i = 1; i < len; i++) {
        if (arr[i].reg.test(mask)) {
            replace = arr[i].replace.toString()
            if (RegExp.$1.length >= 2) {
                mask = mask.replace(RegExp.$1, ('00' + replace).substring(replace.length))
            } else {
                mask = mask.replace(RegExp.$1, replace)
            }
        }
    }
    //处理毫秒
    if (arr[len].reg.test(mask)) {
        replace = arr[len].replace.toString()
        mask = mask.replace(RegExp.$1, ('000' + replace).substring(replace.length).substring(3 - RegExp.$1.length))
    }
    return mask
}

dateFormat.masks = {
    'default': 'YYYY-MM-DD HH:mm:ss',
    'date': 'YYYY-MM-DD',
    'time': 'HH:mm:ss',
}

export default dateFormat

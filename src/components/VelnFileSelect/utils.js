// 格式化文件大小
export function calFileSize(value) {
    if (null === value || value === '') {
        return '0 Bytes';
    }
    var unitArr = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    var index = 0;
        var srcsize = parseFloat(value);
    index = Math.floor(Math.log(srcsize) / Math.log(1024));
    var size = srcsize / Math.pow(1024, index);
    //  保留的小数位数
    size = size.toFixed(2);
    return size + unitArr[index];
}

/**
 * 计算时间
 * @param {number | string} s
 */
export function calFileDuration(s) {
    if (!s || isNaN(s)) {
        return '00:00';
    }
    let m = Math.floor(s / 60);
    s = s - m * 60;
    m = m < 10 ? `0${m}` : m;
    s = s < 10 ? `0${s}` : s;
    return `${m}:${s}`;
}

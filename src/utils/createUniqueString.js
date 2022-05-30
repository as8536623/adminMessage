/**
 * Created by jiachenpan on 17/3/8.
 */
export default function createUniqueString() {
    const timestamp = +new Date() + '';
    const randomNum = parseInt((1 + Math.random()) * 65536) + '';
    return (+(randomNum + timestamp)).toString(32);
}

// 获取随机字符串
export function getRandomString(length, chars) {
    const len = length || 32;
    const charStr = chars || '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (var i = len; i > 0; --i) { result += charStr[Math.floor(Math.random() * charStr.length)]; }
    return result;
}

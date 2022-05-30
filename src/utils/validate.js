import i18n from '../lang';
/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
    return /^(http:|https?:|mailto:|tel:)/.test(path);
}

export function isvalidUsername(str) {
    const validMap = ['admin', 'editor'];
    return validMap.indexOf(str.trim()) >= 0;
}

/* 合法uri*/
export function validateURL(textval) {
    const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    return urlregex.test(textval);
}

/* 小写字母*/
export function validateLowerCase(str) {
    const reg = /^[a-z]+$/;
    return reg.test(str);
}

/* 大写字母*/
export function validateUpperCase(str) {
    const reg = /^[A-Z]+$/;
    return reg.test(str);
}

/* 大小写字母*/
export function validateAlphabets(str) {
    const reg = /^[A-Za-z]+$/;
    return reg.test(str);
}

/* 校验手机号*/
export function validateMobile(str) {
    const reg = /^1([0-9][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
    return reg.test(str);
}

/**
 * validate email
 * @param email
 * @returns {boolean}
 */
export function validateEmail(email) {
    const re = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    return re.test(email);
}

/**
 * validate integer
 * @param integer
 * @returns {boolean}
 */
export function validateIntegerO(integer) {
    const re = /^\d+$/;
    return re.test(integer);
}

/**
 * el-form校验整数
 * @param rule
 * @param value
 * @param callback
 */
export function validateInteger(rule, value, callback) {
    const reg = /^\d+$/;
    if (value === '' || value === undefined) {
        callback();
    } else if (!reg.test(value)) {
        callback(new Error('请输入整数'));
    } else {
        callback();
    }
}

/**
 * el-form校验英文字符串
 * @param rule
 * @param value
 * @param callback
 */
export function validateEnglish(rule, value, callback) {
    const reg = /^[A-Za-z]+$/;
    if (value === '' || value === undefined) {
        callback();
    } else if (!reg.test(value)) {
        callback(new Error('请输入英文字母'));
    } else {
        callback();
    }
}

/**
 * el-form校验正数
 * @param rule
 * @param value
 * @param callback
 */
export function validateUpNumber(rule, value, callback) {
    const reg = /^\d+(?=\.{0,1}\d+$|$)/;
    if (value === '' || value === undefined) {
        callback();
    } else if (!reg.test(value)) {
        callback(new Error('请输入正数'));
    } else {
        callback();
    }
}

/**
 * el-form校验邮箱
 * @param rule
 * @param value
 * @param callback
 */
export function validateFormEmail(rule, value, callback) {
    const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (!value) {
        callback();
    } else if (!reg.test(value)) {
        callback(new Error(i18n.t('邮箱格式不正确！')));
    } else {
        callback();
    }
}

/**
 * el-form校验身份证
 * @param rule
 * @param value
 * @param callback
 */
export function validateFormIdCard(rule, value, callback) {
    const reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/;
    if (!value) {
        callback();
    } else if (!reg.test(value)) {
        callback(new Error(i18n.t('身份证格式不正确！')));
    } else {
        callback();
    }
}

/**
 * el-form校验手机号
 * @param rule
 * @param value
 * @param callback
 */
export function validateFormMobile(rule, value, callback) {
    const reg = /^1[3456789]\d{9}$/;
    if (!value) {
        callback();
    } else if (!reg.test(value)) {
        callback(new Error(i18n.t('手机号码格式不正确！')));
    } else {
        callback();
    }
}

/**
 * el-form校验密码
 * @param rule
 * @param value
 * @param callback
 */
export function validateFormPassword(rule, value, callback) {
    if (!value) {
        callback();
    } else if (value.length < 7) {
        callback(new Error(i18n.t('密码需多于6位！')));
    } else {
        callback();
    }
}

/**
 * 是否是小写字母
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
    const reg = /^[a-z]+$/;
    return reg.test(str);
}

/**
 * 是否是大写字母
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
    const reg = /^[A-Z]+$/;
    return reg.test(str);
}

/**
 * 是否是字母（大小写）
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
    const reg = /^[A-Za-z]+$/;
    return reg.test(str);
}

/**
 * 校验手机号
 * @param {string} mobile
 * @returns {boolean}
 */
export function validMobile(mobile) {
    const reg = /^1(3|4|5|6|7|8|9)\d{9}$/;
    return reg.test(mobile);
}

/**
 * 固定电话校验
 * @param {string} telephone
 * @returns {boolean}
 */
export function validTelephone(telephone) {
    const reg = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;
    return reg.test(telephone);
}

/**
 * 手机号或固化
 * @param {string} phone
 * @returns {boolean}
 */
export function validPhone(phone) {
    return validMobile(phone) || validTelephone(phone);
}

/**
 * 身份证号验证 15或18位
 * @param IDCard
 * @returns {boolean}
 */
export function validIDCard(IDCard) {
    const reg = /(^\d{15}$)|(^\d{17}([0-9]|X)$)/;
    return reg.test(IDCard);
}

/**
 * 自然数校验
 * @param value
 * @returns {boolean}
 */
export function validNaturalNumber(value) {
    const reg = /^[+]{0,1}(\d+)$/;
    return reg.test(value);
}

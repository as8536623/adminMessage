import {validAlphabets, validLowerCase, validMobile, validTelephone, validUpperCase, validNaturalNumber, validateURL} from './validate';

export const rules = {
    required: {required: true, message: '此项为必填项', trigger: ['blur', 'change']},
    email: {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']},
    url: {type: 'url', message: '请输入正确的URL地址', trigger: ['blur', 'change']},
    number: {type: 'number', message: '请输入数字', trigger: ['blur', 'change']},
    integer: {type: 'integer', message: '请输入整数', trigger: ['blur', 'change']},
    upperCase: {
        validator: function(rule, value, callback) {
            if (!value) {
                callback();
            } else if (!validUpperCase(value)) {
                callback('含非法字符');
            } else {
                callback();
            }
        }, message: '请输入大写字母', trigger: ['blur', 'change']
    },
    loweCase: {
        validator: function(rule, value, callback) {
            if (!value) {
                callback();
            } else if (!validLowerCase(value)) {
                callback('含非法字符');
            } else {
                callback();
            }
        }, message: '请输入小写字母', trigger: ['blur', 'change']
    },
    alpha: {
        validator: function(rule, value, callback) {
            if (!value) {
                callback();
            } else if (!validAlphabets(value)) {
                callback('含非法字符');
            } else {
                callback();
            }
        }, message: '请输入字母', trigger: ['blur', 'change']
    },
    mobile: {
        validator: function(rule, value, callback) {
            if (!value) {
                callback();
            } else if (!validMobile(value)) {
                callback('手机号码格式不正确！');
            } else {
                callback();
            }
        }, message: '请输入正确的手机格式', trigger: ['blur', 'change']
    },
    telephone: {
        validator: function(rule, value, callback) {
            if (!value) {
                callback();
            } else if (!validTelephone(value)) {
                callback('固定电话号码格式不正确！');
            } else {
                callback();
            }
        }, message: '请输入正确的固话电话格式', trigger: ['blur', 'change']
    },
    natureNumber: {
        validator: function(rule, value, callback) {
            if (!value) {
                callback();
            } else if (!validNaturalNumber(value)) {
                callback('输入的数字格式不正确！');
            } else {
                callback();
            }
        }, message: '请输入自然数', trigger: ['blur', 'change']
    },
    nameAndUrl: {
        validator: function(rule, value, callback) {
            let msg = '请输入合法的访问地址信息';
            if (!value.name) {
                msg = '请输入链接名称';
                callback(new Error(msg));
            } else if (!value.url) {
                msg = '请输入链接地址';
                callback(new Error(msg));
            } else if (!validateURL(value.url)) {
                msg = '请输入正确的URL地址';
                callback(new Error(msg));
            } else {
                callback();
            }
        }, trigger: ['blur', 'change']
    }
};

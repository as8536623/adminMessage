/**
 * Created by xqq on 18/8/21.
 */

export function stringFormat() {
    if (arguments.length === 0) {
        return null;
    }

    let str = arguments[0];
    for (let i = 1; i < arguments.length; i++) {
        const re = new RegExp('\\{' + (i - 1) + '\\}', 'g');
        str = str.replace(re, arguments[i]);
    }

    return str;
}

// 时间格式化
export function formatDate(date, fmt) {
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
            RegExp.$1,
            (date.getFullYear() + '').substr(4 - RegExp.$1.length)
        );
    }
    const o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (const k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            const str = o[k] + '';
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length === 1 ? str : padLeftZero(str)
            );
        }
    }
    return fmt;
}

function padLeftZero(str) {
    return ('00' + str).substr(str.length);
}

export function parseTime(time, cFormat) {
    if (arguments.length === 0) {
        return null;
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
    let date;
    if (typeof time === 'object') {
        date = time;
    } else {
        if (('' + time).length === 10) { time = parseInt(time) * 1000; }
        date = new Date(time);
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    };
    return format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key];
        if (key === 'a') {
            return ['一', '二', '三', '四', '五', '六', '日'][value - 1];
        }
        if (result.length > 0 && value < 10) {
            value = '0' + value;
        }
        return value || 0;
    });
}

export function formatTime(time, option) {
    time = +time * 1000;
    const d = new Date(time);
    const now = Date.now();

    const diff = (now - d) / 1000;

    if (diff < 30) {
        return '刚刚';
    } else if (diff < 3600) {
        // less 1 hour
        return Math.ceil(diff / 60) + '分钟前';
    } else if (diff < 3600 * 24) {
        return Math.ceil(diff / 3600) + '小时前';
    } else if (diff < 3600 * 24 * 2) {
        return '1天前';
    }
    if (option) {
        return parseTime(time, option);
    } else {
        return (
            d.getMonth() +
            1 +
            '月' +
            d.getDate() +
            '日' +
            d.getHours() +
            '时' +
            d.getMinutes() +
            '分'
        );
    }
}

// 格式化时间
export function getQueryObject(url) {
    url = url == null ? window.location.href : url;
    const search = url.substring(url.lastIndexOf('?') + 1);
    const obj = {};
    const reg = /([^?&=]+)=([^?&=]*)/g;
    search.replace(reg, (rs, $1, $2) => {
        const name = decodeURIComponent($1);
        let val = decodeURIComponent($2);
        val = String(val);
        obj[name] = val;
        return rs;
    });
    return obj;
}

/**
 *get getByteLen
 * @param {Sting} val input value
 * @returns {number} output value
 */
export function getByteLen(val) {
    let len = 0;
    for (let i = 0; i < val.length; i++) {
        if (val[i].match(/[^\x00-\xff]/gi) != null) {
            len += 1;
        } else {
            len += 0.5;
        }
    }
    return Math.floor(len);
}

export function cleanArray(actual) {
    const newArray = [];
    for (let i = 0; i < actual.length; i++) {
        if (actual[i]) {
            newArray.push(actual[i]);
        }
    }
    return newArray;
}

export function param(json) {
    if (!json) { return ''; }
    return cleanArray(
        Object.keys(json).map(key => {
            if (json[key] === undefined) { return ''; }
            return (
                encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
            );
        })
    ).join('&');
}

export function param2Obj(url) {
    const search = url.split('?')[1];
    if (!search) {
        return {};
    }
    return JSON.parse(
        '{"' +
            decodeURIComponent(search)
            .replace(/"/g, '\\"')
            .replace(/&/g, '","')
            .replace(/=/g, '":"') +
        '"}'
    );
}

export function html2Text(val) {
    const div = document.createElement('div');
    div.innerHTML = val;
    return div.textContent || div.innerText;
}

export function objectMerge(target, source) {
    /* Merges two  objects,
     giving the last one precedence */

    if (typeof target !== 'object') {
        target = {};
    }
    if (Array.isArray(source)) {
        return source.slice();
    }
    Object.keys(source).forEach(property => {
        const sourceProperty = source[property];
        if (typeof sourceProperty === 'object') {
            target[property] = objectMerge(target[property], sourceProperty);
        } else {
            target[property] = sourceProperty;
        }
    });
    return target;
}

export function scrollTo(element, to, duration) {
    if (duration <= 0) { return; }
    const difference = to - element.scrollTop;
    const perTick = (difference / duration) * 10;
    setTimeout(() => {
        element.scrollTop = element.scrollTop + perTick;
        if (element.scrollTop === to) { return; }
        scrollTo(element, to, duration - 10);
    }, 10);
}

export const pickerOptionsOnlyToday = {
    shortcuts: [
        {
            text: '今天',
            onClick(picker) {
                picker.$emit('pick', new Date());
            }
        }
    ]
};

export const pickerOptions = {
    shortcuts: [
        {
            text: '今天',
            onClick(picker) {
                const end = new Date();
                const start = new Date(new Date().toDateString());
                end.setTime(start.getTime());
                picker.$emit('pick', [start, end]);
            }
        },
        {
            text: '最近一周',
            onClick(picker) {
                const end = new Date(new Date().toDateString());
                const start = new Date();
                start.setTime(end.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
            }
        },
        {
            text: '最近一个月',
            onClick(picker) {
                const end = new Date(new Date().toDateString());
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
            }
        },
        {
            text: '最近三个月',
            onClick(picker) {
                const end = new Date(new Date().toDateString());
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
            }
        }
    ]
};

export function getTime(type) {
    if (type === 'start') {
        return new Date().getTime() - 3600 * 1000 * 24 * 90;
    } else {
        return new Date(new Date().toDateString());
    }
}

export function debounce(func, wait, immediate) {
    let timeout, args, context, timestamp, result;

    const later = function() {
        // 据上一次触发时间间隔
        const last = +new Date() - timestamp;

        // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
        if (last < wait && last > 0) {
            timeout = setTimeout(later, wait - last);
        } else {
            timeout = null;
            // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
            if (!immediate) {
                result = func.apply(context, args);
                if (!timeout) { context = args = null; }
            }
        }
    };

    return function(...args) {
        context = this;
        timestamp = +new Date();
        const callNow = immediate && !timeout;
        // 如果延时不存在，重新设定延时
        if (!timeout) { timeout = setTimeout(later, wait); }
        if (callNow) {
            result = func.apply(context, args);
            context = args = null;
        }

        return result;
    };
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 */
export function deepClone(source) {
    if (!source && typeof source !== 'object') {
        throw new Error('error arguments', 'shallowClone');
    }
    const targetObj = source.constructor === Array ? [] : {};
    Object.keys(source).forEach(keys => {
        if (source[keys] && typeof source[keys] === 'object') {
            targetObj[keys] = deepClone(source[keys]);
        } else {
            targetObj[keys] = source[keys];
        }
    });
    return targetObj;
}

export function uniqueArr(arr) {
    return Array.from(new Set(arr));
}

export function getDataFromArrayById(arr, id) {
    const str = '';
        const save = [];
    if (!Array.isArray(arr) || !arr.length) {
        return str;
    }

    arr.map(item => {
        if (item[id]) {
            save.push(item[id]);
        }
    });

    return save.join(',');
}

export function getQueryString(name) {
    const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    const r = window.location.search.substr(1).match(reg);
    if (r != null) { return unescape(r[2]); }
    return null;
}

export function getQueryStringFromString(str, name) {
    const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    const s = str.split('?')[1];
    const r = s.match(reg);
    if (r != null) { return unescape(r[2]); }
    return null;
}

export function deepCloneByJSON(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// 将对象转换成String
export function formatObjToString(obj) {
    let str = '';
    for (const key in obj) {
        if (
            key &&
            obj[key] !== undefined &&
            obj[key] !== null &&
            key !== 'pageNum' &&
            key !== 'pageSize'
        ) {
            str = str + `${str.length ? '&' : ''}${key}=${obj[key]}`;
        }
    }
    return str;
}

// 将对象转换成String并转码
export function formatObjToEnCodeString(obj) {
    let str = '';
    for (const key in obj) {
        if (key && obj[key] !== undefined && obj[key] !== null && key !== 'pageNum' && key !== 'pageSize') {
            str = str + `${str.length ? '&' : ''}${key}=${encodeURI(obj[key])}`;
        }
    }
    return str;
}

/**
 * 将对象转换成key-value数组
 * @param obj 需要转换的对象
 * @param isFirstEmpty 是否需要在第一个添加空数据
 * @returns {Array}
 */
export function formatObjToArray(obj, isFirstEmpty) {
    const arr = [];
    if (isFirstEmpty) {
        arr.push({
            key: '',
            value: '全部'
        });
    }
    for (const key in obj) {
        if (key && obj[key]) {
            arr.push({
                key: key,
                value: obj[key]
            });
        }
    }
    return arr;
}

/**
 * 从对象数组中获取值
 * @param array
 * @param field
 * @returns {string}
 */
export function getValueFromArray(array, field, key, value) {
    let result = '';
    let index = 0;
    while (index < array.length) {
        const item = array[index];
        if (item.$attrs[field] === value) {
            result = item[key].split(':')[0];
            break;
        }
        ++index;
    }
    return result;
}

/**
 * 合并两个对象，将第二组对象合并到第一组，只保存第一组字段
 * @param target
 * @param origin
 * @returns {any}
 */
export function unionObject(target, origin) {
    for (const key in target) {
        if (!target[key] && origin[key]) {
            target[key] = origin[key];
        }
    }
    return JSON.parse(JSON.stringify(target));
}

/**
 * 合并字段（排除某些字段）
 * @param target
 * @param origin
 * @param fields
 */
export function copyObjectExceptFields(target, origin, fields) {
    for (const key in target) {
        if (origin[key] && fields.indexOf(key) === -1) {
            target[key] = origin[key];
        }
    }
    return JSON.parse(JSON.stringify(target));
}

const downloadpre = 'http://localhost:8101';

// 序列化get请求是数组参数
export function formatGetParams(params) {
    let result = '';
    for (const key in params) {
        const value = params[key];
        let str = '';
        if (Array.isArray(value) && value.length) {
            value.map((item, index) => {
                if (
                    ['number', 'boolean', 'string'].indexOf(typeof item) === -1
                ) {
                    return;
                }
                if (!index) {
                    str += `${key}=${item}`;
                } else {
                    str += `&${key}=${item}`;
                }
            });
        } else if (null === value) {
            str = '';
        } else if ('object' === typeof value) {
            for (const [k, v] of Object.entries(value)) {
                str += `&${key}.${k}=${v}`;
            }
        } else if (['symbol', 'function', 'undefined'].indexOf(typeof value) > -1) {
            str = `${key}=`;
        } else {
            str = `${key}=${value}`;
        }
        result += result.length ? `&${str}` : `?${str}`;
    }
    return result;
}

// 关闭当前标签页
export function closeCurrentTag(self) {
    self.$parent.$parent.$refs.tagsView.closeCurrentTag();
}

// 简单数组去重
export function uniqueArraySimple(array) {
    return [...new Set(array)];
}

/**
 * 删除对象的无意义字段
 * @param {*} obj
 */
export function filterObjForInanition(obj) {
    const copy = deepClone(obj);
    for (const key in copy) {
        if (
            (copy.hasOwnProperty(key) &&
                (copy[key] === null || copy[key] === undefined)) ||
            (Array.isArray(copy[key]) && !copy[key].length)
        ) {
            delete copy[key];
        }
        // 当ajax数据有filterEmptyString字段且为true时，过滤空字符串
        if (
            copy.hasOwnProperty('filterEmptyString') &&
            copy['filterEmptyString'] &&
            copy[key] === ''
        ) {
            delete copy[key];
        }
    }
    return copy;
}

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

// 后台传入的map数据转为数组
export function mapToArray(obj) {
    if (!obj || JSON.stringify(obj) === '{}') {
        return [];
    }

    const result = [];
    for (const key in obj) {
        const o = {
            key,
            value: obj[key]
        };
        result.push(o);
    }

    return result;
}

export {downloadpre};

export function dateFormat(d, fmt) {
    if (!d) {
        return;
    }
    if (typeof d !== 'object') {
        d = new Date(d.replace(/-/g, '/'));
    }
    if (d.toString() === 'Invalid Date') {
        return '';
    }
    var o = {
        'M+': d.getMonth() + 1, // 月份
        'd+': d.getDate(), // 日
        'h+': d.getHours(), // 小时
        'm+': d.getMinutes(), // 分
        's+': d.getSeconds(), // 秒
        'q+': Math.floor((d.getMonth() + 3) / 3), // 季度
        S: d.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
            RegExp.$1,
            (d.getFullYear() + '').substr(4 - RegExp.$1.length)
        );
    }
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length === 1
                    ? o[k]
                    : ('00' + o[k]).substr(('' + o[k]).length)
            );
        }
    }
    return fmt;
}

// 返回英文字母
export function getEnglishLetter(index) {
    const options = [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z'
    ];
    return options[index];
}

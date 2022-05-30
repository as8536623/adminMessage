var REG_NUMBER = /^([+-])?0*(\d+)(\.(\d+))?$/;
var REG_E = /^([+-])?0*(\d+)(\.(\d+))?e(([+-])?(\d+))$/i;

/**
 * 科学计数法转十进制
 *
 * @param {string} num 科学记数法字符串
 * @returns string
 */
const e2ten = num => {
    const result = REG_E.exec(num.toString());
    if (!result) {
        return num;
    }
    let zs = result[2];
    let xs = result[4] || '';
    let e = result[5] ? +result[5] : 0;
    if (e > 0) {
        let _zs = xs.substr(0, e);
        _zs = _zs.length < e ? _zs + new Array(e - _zs.length + 1).join('0') : _zs;
        xs = xs.substr(e);
        zs += _zs;
    } else {
        e = -e;
        let sStart = zs.length - e;
        sStart = sStart < 0 ? 0 : sStart;
        let _xs = zs.substr(sStart, e);
        _xs = _xs.length < e ? new Array(e - _xs.length + 1).join('0') + _xs : _xs;
        zs = zs.substring(0, sStart);
        xs = _xs + xs;
    }
    zs = zs === '' ? '0' : zs;
    return (result[1] === '-' ? '-' : '') + zs + (xs ? '.' + xs : '');
};

/**
 * 清理多余"零"
 *
 * @param {any} str
 * @param {any} zero "零"字符
 * @returns
 */
const clearZero = (str, zero, type) => {
    if (str == null) {
        return '';
    }
    const reg0 = ~'*.?+$^[](){}|\\/'.indexOf(zero) ? '\\' + zero : zero;
    const argS = new RegExp('^' + reg0 + '+');
    const argE = new RegExp(reg0 + '+$');
    const argD = new RegExp(reg0 + '{2}', 'g');
    str = str.toString();
    if (type === '^') {
        str = str.replace(argS, '');
    }
    if (!type || type === '$') {
        str = str.replace(argE, '');
    }
    if (!type || type === 'nto1') {
        str = str.replace(argD, zero);
    }
    return str;
};

/**
 * 分析数字字符串
 *
 * @param {string} num NumberString
 * @returns object
 */
const getNumbResult = num => {
    let result = REG_NUMBER.exec(num.toString());
    if (!result && REG_E.test(num.toString())) {
        result = REG_NUMBER.exec(e2ten(num.toString()));
    }
    if (result) {
        return {
            int: result[2],
            decimal: result[4],
            minus: result[1] === '-',
            num: result.slice(1, 3).join('')
        };
    }
};

/**
 * 阿拉伯数字转中文数字
 *
 * @param {String} num 阿拉伯数字/字符串 , 科学记数法字符串
 * @param {Object} opration 转换配置
 *                          {
 *                              ww: {万万化单位 | false}
 *                              tenMin: {十的口语化 | false}
 *                          }
 * @returns String
 */
export function transferNumberToChinese(num, options) {
    const ch = '零一二三四五六七八九';
    const chU = '个十百千万亿';
    const chF = '负';
    const chD = '点';
    const result = getNumbResult(num);
    if (!result) {
        return num;
    }
    options = options || {};
    const n0 = ch.charAt(0); // 零
    const _int = result.int; // 整数部分
    let _decimal = result.decimal; // 小数部分
    const _minus = result.minus; // 负数标识
    let int = '';
    let dicimal = '';
    const minus = _minus ? chF : ''; // 符号位
    const encodeInt = function encodeInt(_int, _m, _dg) {
        _int = getNumbResult(_int).int;
        let int = '';
        const tenm = arguments.length > 1 ? arguments[1] : options.tenMin;
        const _length = _int.length;
        // 一位整数
        if (_length === 1) {
            return ch.charAt(+_int);
        }
        if (_length <= 4) {
            // 四位及以下
            let i = 0;
            let n = _length;
            for (; n--;) {
                const _num = +_int.charAt(i);
                int += tenm && _length === 2 && i === 0 && _num === 1 ? '' : ch.charAt(_num);
                int += _num && n ? chU.charAt(n) : '';
                i++;
            }
        } else {
            // 大数递归
            let d = (_int.length / 4) >> 0;
            let y = _int.length % 4;
            // "兆","京"等单位处理
            while (y === 0 || !chU.charAt(3 + d)) {
                y += 4;
                d--;
            }
            const _maxLeft = _int.substr(0, y); // 最大单位前的数字
            const _other = _int.substr(y); // 剩余数字

            int =
                encodeInt(_maxLeft, tenm) +
                chU.charAt(3 + d) +
                (_other.charAt(0) === '0' ? n0 : '') + // 单位后有0则加零
                encodeInt(_other, tenm);
        }
        int = clearZero(int, n0); // 修整零
        return int;
    };

    // 转换小数部分
    if (_decimal) {
        _decimal = clearZero(_decimal, '0'); // 去除尾部0
        for (let x = 0; x < _decimal.length; x++) {
            dicimal += ch.charAt(+_decimal.charAt(x));
        }
        dicimal = dicimal ? chD + dicimal : '';
    }

    // 转换整数部分
    int = encodeInt(_int); // 转换整数

    // 超级大数的万万化
    if (options.ww && chU.length > 5) {
        const dwW = chU.charAt(4);
        const dwY = chU.charAt(5);
        const lasty = int.lastIndexOf(dwY);
        if (~lasty) {
            int = int.substring(0, lasty).replace(new RegExp(dwY, 'g'), dwW + dwW) + int.substring(lasty);
        }
    }
    return minus + int + dicimal;
}

// 处理考试成绩
export function examScoreFilter(num) {
    if (isNaN(num)) {
        return 0;
    }

    if (num === -1) {
        return '--';
    }

    return num.toString().includes('.') ? num.toFixed(1) : num;
}

export function NumberToChinese(num) {
    const chnNumChar = [
        '零',
        '一',
        '二',
        '三',
        '四',
        '五',
        '六',
        '七',
        '八',
        '九'
    ];
    const chnUnitChar = [
        '',
        '十',
        '百',
        '千',
        '万',
        '十',
        '百',
        '千',
        '亿',
        '十',
        '百',
        '千'
    ];
    let chnStr = '';
    let str = num.toString();
    while (str.length > 0) {
        const tmpNum = chnNumChar[parseInt(str.substr(0, 1))];
        const tmpChar = chnUnitChar[str.length - 1];
        chnStr +=
            chnStr.substr(-1, 1) === '零' && tmpNum === '零' ? '' : tmpNum;
        if (tmpNum !== '零') {
            chnStr += tmpChar;
        }
        if (chnStr === '一十') {
            chnStr = '十';
        }
        str = str.substr(1);
        if (parseInt(str) === 0) {
            if (str.length >= 8) {
                if (chnStr.substr(-1, 1) !== '亿') {
                    chnStr += '亿';
                }
            } else if (str.length >= 5) {
                if (chnStr.substr(-1, 1) !== '万') {
                    chnStr += '万';
                }
            }
            str = '';
        }
    }
    return chnStr;
}

// set function parseTime,formatTime to filter
export {
    parseTime,
    formatTime
}
from '@/utils';

function pluralize(time, label) {
    if (time === 1) {
        return time + label;
    }
    return time + label + 's';
}

export function timeAgo(time) {
    const between = Date.now() / 1000 - Number(time);
    if (between < 3600) {
        return pluralize(~~(between / 60), ' minute');
    } else if (between < 86400) {
        return pluralize(~~(between / 3600), ' hour');
    } else {
        return pluralize(~~(between / 86400), ' day');
    }
}

/* 数字 格式化*/
export function numberFormatter(num, digits) {
    const si = [{
            value: 1E18,
            symbol: 'E'
        },
        {
            value: 1E15,
            symbol: 'P'
        },
        {
            value: 1E12,
            symbol: 'T'
        },
        {
            value: 1E9,
            symbol: 'G'
        },
        {
            value: 1E6,
            symbol: 'M'
        },
        {
            value: 1E3,
            symbol: 'k'
        }
    ];
    for (let i = 0; i < si.length; i++) {
        if (num >= si[ i ].value) {
            return (num / si[ i ].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[ i ].symbol;
        }
    }
    return num.toString();
}

export function toThousandslsFilter(num) {
    return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','));
}

export function examScoreFilter(num) {
    // data.examResult.score.toFixed(1): data.examResult.score : 0
    if (isNaN(num)) {
        return 0;
    }

    if (num === -1) {
        return '--';
    }

    return num.toString().includes('.') ? num.toFixed(1) : num;
}

// 视频播放器 时间处理
export function videoTimeFilter(val) {
    if (!val || isNaN(val)) {
        return '00:00';
    }

    const num = Number(val);
    let h = Math.floor(num / 60);
    h = h < 10 ? `0${h}` : h;
    let m = num - h * 60;
    m = m < 10 ? `0${m}` : m;

    return `${h}:${m}`;
}

/**
 * 价格保留两位小数
 * @param val 值
 * @param empty 为空时展示什么
 * @returns {string|*|string}
 */
export function numFixed(val, empty) {
    if (parseInt(val) >= 0) {
        return parseFloat(val).toFixed(2);
    } else {
        return empty || '0.00';
    }
}

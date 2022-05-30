import request from '@/utils/request';

// 获取短链
export function getShortLink(data) {
    return request({
        url: `${location.protocol}//${location.host}/sl`,
        method: 'post',
        data
    });
}

// 获取短链 新版
export function getSL(data) {
    return request({
        url: `${location.protocol}//${location.host}/sl`,
        method: 'post',
        data
    });
}

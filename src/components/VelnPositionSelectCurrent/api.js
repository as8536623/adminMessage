import request from '@/utils/request';

// 获取数据
export function getData(url, params) {
    return request({
        url,
        method: 'get',
        params
    });
}

// 保存数据
export function postData(url, data) {
    return request({
        url,
        method: 'post',
        data
    });
}

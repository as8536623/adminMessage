import request from '@/utils/request';

// 通用post请求
export function commonPost(url, data) {
    return request({
        url,
        method: 'post',
        data
    });
}

export function getIndustryList() {
    return request({
        url: 'https://yapi.qgutech.com/mock/41/bgk/industry/list',
        method: 'get'
    });
}

export function getJobList() {
    return request({
        url: 'https://yapi.qgutech.com/mock/41/bgk/job/list',
        method: 'get'
    });
}

export function getSubjectList() {
    return request({
        url: 'https://yapi.qgutech.com/mock/41/bgk/subject/list',
        method: 'get'
    });
}

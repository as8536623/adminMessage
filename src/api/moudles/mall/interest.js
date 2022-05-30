import {CTX} from '@/api/config';
import request from '@/utils/request';

const PREFIX = CTX.MALL + `interest`;

/**
 *获取兴趣类型
 */
export function getInterestType() {
    return request({
        url: `${PREFIX}/getInterestType`,
        method: 'GET'
    });
}

/**
 *获取兴趣数据
 */
export function getInterestById(id) {
    return request({
        url: `${PREFIX}/${id}`,
        method: 'GET'
    });
}

/**
 *分页查询
 */
export function interestHowPage(params) {
    return request({
        url: `${PREFIX}/page`,
        method: 'GET',
        params
    });
}

/**
 *新增
 */
export function addInterest(data) {
    return request({
        url: `${PREFIX}/add`,
        method: 'POST',
        data
    });
}

/**
 *编辑
 */
export function editInterest(data) {
    return request({
        url: `${PREFIX}/edit`,
        method: 'POST',
        data
    });
}

/**
 *删除
 */
export function deleteInterest(param) {
    return request({
        url: `${PREFIX}/delete?id=${param}`,
        method: 'POST'
    });
}

/**
 *更改状态
 */
export function updateStatus(data) {
    return request({
        url: `${PREFIX}/updateStatus`,
        method: 'POST',
        data
    });
}

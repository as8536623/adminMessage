import {CTX} from '@/api/config';
import request from '@/utils/request';

const PREFIX = `${CTX.MARKET}/card/market`;

/**
 * 分页
 */
export function search(params) {
    return request({
        url: `${PREFIX}/customize/page`,
        method: 'get',
        params
    });
}

/**
 * 新增
 */
export function add(data) {
    return request({
        url: PREFIX,
        method: 'post',
        data
    });
}

/**
 * 编辑
 */
export function edit(path, data) {
    return request({
        url: `${PREFIX}/${path}`,
        method: 'put',
        data
    });
}

/**
 * 作废
 */
export function freeze(path) {
    return request({
        url: `${PREFIX}/freeze/${path}`,
        method: 'put'
    });
}

export function give(path, data) {
    return request({
        url: `${PREFIX}/gift/${path}`,
        method: 'post',
        data
    });
}

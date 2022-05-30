import {CTX} from '@/api/config';
import request from '@/utils/request';

const PREFIX = `${CTX.MARKET}/coupon/market`;

/**
 * 分页
 */
export function couponPage(params) {
    return request({
        url: `${PREFIX}/customize/page`,
        method: 'get',
        params
    });
}

/**
 * 删除
 */
export function simpleDelete(path) {
    return request({
        url: `${PREFIX}/${path}`,
        method: 'delete'
    });
}

/**
 * 新增
 */
export function couponAdd(data) {
    return request({
        url: PREFIX,
        method: 'post',
        data
    });
}

/**
 * 编辑用详情
 */
export function editInfo(path) {
    return request({
        url: `${PREFIX}/customize/edit/${path}`,
        method: 'get'
    });
}

/**
 * 编辑
 */
export function couponEdit(path, data) {
    return request({
        url: `${PREFIX}/${path}`,
        method: 'put',
        data
    });
}

/**
 * 详情
 */
export function detailInfo(path) {
    return request({
        url: `${PREFIX}/customize/detail/${path}`,
        method: 'get'
    });
}

/**
 * 简单信息
 */
export function getSimpleInfo(path) {
    return request({
        url: `${PREFIX}/customize/simple/${path}`,
        method: 'get'
    });
}

/**
 * 分页
 */
export function simpleSearch(params) {
    return request({
        url: `${PREFIX}/customize/simple/page`,
        method: 'get',
        params
    });
}

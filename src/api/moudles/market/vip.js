import {CTX} from '@/api/config';
import request from '@/utils/request';

const PREFIX = `${CTX.MARKET}/vip/market`;

/**
 * vip选项集
 */
export function getVipOption() {
    return request({
        url: `${PREFIX}/option`,
        method: 'get'
    });
}

/**
 * 分页
 */
export function search(params) {
    return request({
        url: `${PREFIX}/page`,
        method: 'get',
        params
    });
}

/**
 * 删除
 */
export function deleteVip(path) {
    return request({
        url: `${PREFIX}/${path}`,
        method: 'delete'
    });
}

/**
 * 停用
 */
export function freeze(path) {
    return request({
        url: `${PREFIX}/freeze/${path}`,
        method: 'put'
    });
}

/**
 * 激活
 */
export function active(path) {
    return request({
        url: `${PREFIX}/active/${path}`,
        method: 'put'
    });
}

/**
 * 保存
 */
export function save(data) {
    return request({
        url: `${PREFIX}`,
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
 * 编辑信息
 */
export function getForEdit(path) {
    return request({
        url: `${PREFIX}/edit/${path}`,
        method: 'get'
    });
}

/**
 * 详细信息
 */
export function getDetail(path) {
    return request({
        url: `${PREFIX}/customize/detail/${path}`,
        method: 'get'
    });
}

/**
 * 详细信息
 */
export function getIntroduce(path) {
    return request({
        url: `${PREFIX}/text/${path}`,
        method: 'get'
    });
}

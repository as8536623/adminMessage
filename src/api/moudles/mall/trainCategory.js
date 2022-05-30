import {CTX} from '@/api/config';
import request from '@/utils/request';

const PREFIX = CTX.MALL + `projectCategory`;
/**
 * 分页
 * @param params
 * @returns {AxiosPromise}
 */
export function categoryPage(params) {
    return request({
        url: PREFIX + `/page`,
        method: 'get',
        params
    });
}

/**
 * 获取所有启用数据
 * @param params
 * @returns {AxiosPromise}
 */
export function listAllEnabled(params) {
    return request({
        url: PREFIX + `/share/listAllEnabled`,
        method: 'get',
        params
    });
}

/**
 * 详情
 * @param params
 * @returns {AxiosPromise}
 */
export function category(params) {
    return request({
        url: PREFIX + `/info`,
        method: 'get',
        params
    });
}

/**
 * 新增
 * @returns {AxiosPromise}
 */
export function categoryAdd(data) {
    return request({
        url: PREFIX + `/add`,
        method: 'POST',
        data
    });
}

/**
 * 编辑
 * @returns {AxiosPromise}
 */
export function categoryEdit(data) {
    return request({
        url: PREFIX + `/edit`,
        method: 'POST',
        data
    });
}

/**
 * 删除
 * @returns {AxiosPromise}
 */
export function categoryDelete(params) {
    return request({
        url: PREFIX + `/delete`,
        method: 'delete',
        params
    });
}
/**
 * 启用 禁用
 * @param params
 * @returns {AxiosPromise}
 */
export function categoryStatus(params) {
    return request({
        url: PREFIX + `/manageCategoryStatus`,
        method: 'POST',
        params
    });
}


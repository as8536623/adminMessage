import {CTX} from '@/api/config';
import request from '@/utils/request';

const PREFIX = CTX.MALL + `projectArea`;
/**
 * 分页
 * @param params
 * @returns {AxiosPromise}
 */
export function trainAreaPage(params) {
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
// export function listAllEnabled(params) {
//     return request({
//         url: PREFIX + `/listAllEnabled`,
//         method: 'get',
//         params
//     });
// }

/**
 * 详情
 * @param param
 * @returns {AxiosPromise}
 */
export function projectArea(params) {
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
export function projectAreaAdd(data) {
    return request({
        url: PREFIX + `/add`,
        method: 'POST',
        data
    });
}

/**
 * 新增
 * @returns {AxiosPromise}
 */
export function projectAreaEdit(data) {
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
export function projectAreaDelete(params) {
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
export function projectAreaStatus(params) {
    return request({
        url: PREFIX + `/manageAreaStatus`,
        method: 'POST',
        params
    });
}


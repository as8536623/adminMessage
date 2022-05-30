import {CTX} from '@/api/config';
import request from '@/utils/request';

const PREFIX = CTX.MALL + `hotSearch`;

/**
 * 分页
 * @param params
 * @returns {AxiosPromise}
 */
export function hotSearchPage(params) {
    return request({
        url: PREFIX + `/admin/page`,
        method: 'get',
        params
    });
}

/**
 * 新增
 * @param data
 * @returns {AxiosPromise}
 */
export function hotSearchAdd(data) {
    return request({
        url: PREFIX + `/admin/add`,
        method: 'post',
        data
    });
}

/**
 * 编辑
 * @param data
 * @returns {AxiosPromise}
 */
export function hotSearchEdit(data) {
    return request({
        url: PREFIX + `/admin/edit`,
        method: 'put',
        data
    });
}

/**
 * 详情
 * @param id
 * @returns {AxiosPromise}
 */
export function hotSearch(id) {
    return request({
        url: PREFIX + `/` + id,
        method: 'get'
    });
}

/**
 * 批量删除
 * @param data eg：[1,2,3,4]
 * @returns {AxiosPromise}
 */
export function hotSearchBatchDelete(data) {
    return request({
        url: PREFIX + `/delete`,
        method: 'delete',
        data
    });
}

/**
 * 全部数据
 * @returns {AxiosPromise}
 */
export function hotSearchListAll() {
    return request({
        url: PREFIX + `/listAll`,
        method: 'get'
    });
}

/**
 * 根据id删除数据
 */
export function deleteById(id) {
    return request({
        url: PREFIX + `/admin/delete/` + id,
        method: 'delete'
    });
}

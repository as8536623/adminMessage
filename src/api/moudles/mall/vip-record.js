import {CTX} from '@/api/config';
import request from '@/utils/request';

const PREFIX = CTX.MALL + `vipRecord`;
/**
 * 分页
 * @param params
 * @returns {AxiosPromise}
 */
export function vipRecordPage(params) {
    return request({
        url: PREFIX + `/page`,
        method: 'get',
        params
    });
}

/**
 * 新增
 * @param data
 * @returns {AxiosPromise}
 */
export function vipRecordAdd(data) {
    return request({
        url: PREFIX + `/add`,
        method: 'post',
        data
    });
}

/**
 * 编辑
 * @param data
 * @returns {AxiosPromise}
 */
export function vipRecordEdit(data) {
    return request({
        url: PREFIX + `/edit`,
        method: 'put',
        data
    });
}

/**
 * 详情
 * @param id
 * @returns {AxiosPromise}
 */
export function vipRecord(id) {
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
export function vipRecordBatchDelete(data) {
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
export function vipRecordListAll() {
    return request({
        url: PREFIX + `/listAll`,
        method: 'get'
    });
}

import {CTX} from '@/api/config';
import request from '@/utils/request';

const PREFIX = CTX.MALL + `briefIntroduction`;
/**
 * 分页
 * @param params
 * @returns {AxiosPromise}
 */
export function briefIntroductionPage(params) {
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
export function briefIntroductionAdd(data) {
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
export function briefIntroductionEdit(data) {
    return request({
        url: PREFIX + `/edit`,
        method: 'put',
        data
    });
}

/**
 * 详情
 * @param code
 * @returns {AxiosPromise}
 */
export function briefIntroduction(code) {
    return request({
        url: PREFIX + `/getByCode/` + code,
        method: 'get'
    });
}

/**
 * 批量删除
 * @param data eg：[1,2,3,4]
 * @returns {AxiosPromise}
 */
export function briefIntroductionBatchDelete(data) {
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
export function briefIntroductionListAll() {
    return request({
        url: PREFIX + `/listAll`,
        method: 'get'
    });
}

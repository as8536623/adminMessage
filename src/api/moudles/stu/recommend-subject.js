import {CTX} from '@/api/config';
import request from '@/utils/request';
import {enable, disable, switchTop, modifyShowOrder, batchDelete, Operational} from './operational';

const PREFIX = CTX.STU + `recommendSubject`;

const enableRecommendSubject = id => enable(PREFIX, id);
const disableRecommendSubject = id => disable(PREFIX, id);
const switchTopRecommendSubject = id => switchTop(PREFIX, id);
const modifyShowOrderRecommendSubject = (id, showOrder) => modifyShowOrder(PREFIX, id, showOrder);
const batchDeleteRecommendSubject = data => batchDelete(PREFIX, data);
const RECOMMEND_SUBJECT = new Operational(enableRecommendSubject, disableRecommendSubject, switchTopRecommendSubject, modifyShowOrderRecommendSubject, batchDeleteRecommendSubject);
export {RECOMMEND_SUBJECT};

/**
 * 分页
 * @param params
 * @returns {AxiosPromise}
 */
export function recommendSubjectPage(params) {
    return request({
        url: PREFIX + `/listExistSubjectList`,
        method: 'get',
        params
    });
}

/**
 * 新增
 * @param data
 * @returns {AxiosPromise}
 */
export function recommendSubjectBatchAdd(data) {
    return request({
        url: PREFIX + `/batchAdd`,
        method: 'post',
        data
    });
}

/**
 * 编辑
 * @param data
 * @returns {AxiosPromise}
 */
export function recommendSubjectEdit(data) {
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
export function recommendSubject(id) {
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
export function recommendSubjectBatchDelete(data) {
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
export function recommendSubjectListAll() {
    return request({
        url: PREFIX + `/listAll`,
        method: 'get'
    });
}

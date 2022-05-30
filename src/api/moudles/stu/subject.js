import {CTX} from '@/api/config';
import request from '@/utils/request';
import {enable, disable, switchTop, modifyShowOrder, batchDelete, Operational} from './operational';

const PREFIX = CTX.STU + `subject`;

const enableSubject = id => enable(PREFIX, id);
const disableSubject = id => disable(PREFIX, id);
const switchTopSubject = id => switchTop(PREFIX, id);
const modifyShowOrderSubject = (id, showOrder) => modifyShowOrder(PREFIX, id, showOrder);
const batchDeleteSubject = data => batchDelete(PREFIX, data);
const SUBJECT_LIST = new Operational(enableSubject, disableSubject, switchTopSubject, modifyShowOrderSubject, batchDeleteSubject);
export {SUBJECT_LIST};

/**
 * 分页
 * @param params
 * @returns {AxiosPromise}
 */
export function subjectPage(params) {
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
export function subjectAdd(data) {
    return request({
        url: PREFIX + `/stepOneAdd`,
        method: 'post',
        data
    });
}

/**
 * 编辑保存第二部
 * @param data
 * @returns {AxiosPromise}
 */
export function stepTwoSave(id, data) {
    return request({
        url: PREFIX + `/stepTwoSave/${id}`,
        method: 'put',
        data
    });
}

export function generateCode() {
    return request({
        url: PREFIX + `/generateCode`,
        method: 'get'
    });
}

/**
 * 编辑
 * @param data
 * @returns {AxiosPromise}
 */
export function subjectEdit(data) {
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
export function subject(id) {
    return request({
        url: PREFIX + `/` + id,
        method: 'get'
    });
}

/**
 * 专题以及关联课程信息
 * @returns {AxiosPromise}
 */
export function listRefer(id) {
    return request({
        url: PREFIX + `/listReferForAdmin/${id}`,
        method: 'get'
    });
}

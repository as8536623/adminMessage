import request from '@/utils/request';
import {getCtx} from '@/utils/dev';
import {Operational} from '../stu/operational';

const PREFIX = getCtx() ? getCtx() + `${process.env.STU_API}/coursesOperation` : `${process.env.STU_API}/coursesOperation`;
const STU_PREFIX = getCtx() ? getCtx() + `${process.env.STU_API}/stuFeign` : `${process.env.STU_API}/stuFeign`;

/**
 * 分页
 * @param params
 * @returns {AxiosPromise}
 */
export function coursesNewPage(params) {
    return request({
        url: PREFIX + `/courseNewPage`,
        method: 'get',
        params
    });
}

export function coursesHowPage(params) {
    return request({
        url: PREFIX + `/courseHotPage`,
        method: 'get',
        params
    });
}

export function courseFreePage(params) {
    return request({
        url: PREFIX + `/courseFreePage`,
        method: 'get',
        params
    });
}

/**
 * 分类管理页面分页
 */
export function coursePage(params) {
    return request({
        url: PREFIX + `/coursePage`,
        method: 'get',
        params
    });
}

/**
 * 分类管理页面分页（新）
 */
export function recommendAndNewCourse(params) {
    return request({
        url: PREFIX + `/recommendAndNewCourse`,
        method: 'get',
        params
    });
}

/**
 * 销量管理
 */
export function courseSellPage(params) {
    return request({
        url: PREFIX + `/courseSellPage`,
        method: 'get',
        params
    });
}

/**
 * 新增
 * @param data
 * @returns {AxiosPromise}
 */
export function coursesOperationBatchAdd(funCode, funId, data) {
    return request({
        url: PREFIX + `/batchAdd?funCode=${funCode}&funId=${funId}`,
        method: 'post',
        data
    });
}

/**
 * 置顶开关
 */
export function switchTop(id) {
    return request({
        url: PREFIX + `/switchTop/${id}`,
        method: 'put'
    });
}

/**
 * 启用
 * @param id
 * @returns {AxiosPromise}
 */
export function enable(id) {
    return request({
        url: PREFIX + `/enable/${id}`,
        method: 'put'
    });
}

/**
 * 禁用
 * @param id
 * @returns {AxiosPromise}
 */
export function disable(id) {
    return request({
        url: PREFIX + `/disable/${id}`,
        method: 'put'
    });
}

/**
 * 置顶开关（更新/保存）
 */
export function switchTopWithSave(data) {
    return request({
        url: PREFIX + `/switchTopWithSave`,
        method: 'post',
        data
    });
}

/**
 * 启用（更新/保存）
 */
export function enableWithSave(data) {
    return request({
        url: PREFIX + `/enableWithSave`,
        method: 'post',
        data
    });
}

/**
 * 禁用（更新/保存）
 */
export function disableWithSave(data) {
    return request({
        url: PREFIX + `/disableWithSave`,
        method: 'post',
        data
    });
}

/**
 * 修改排序值（更新/保存）
 */
export function modifyShowOrderWithSave(data) {
    return request({
        url: PREFIX + `/modifyShowOrderWithSave`,
        method: 'post',
        data
    });
}

/**
 * 删除
 * @param id
 * @returns {AxiosPromise}
 */
export function courseOperationDelete(id) {
    return request({
        url: PREFIX + `/delete/${id}`,
        method: 'delete'
    });
}

/**
 * 批量删除
 */
export function batchCourseOperationDelete(data) {
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
export function coursesOperationListAll() {
    return request({
        url: PREFIX + `/listAll`,
        method: 'get'
    });
}

/**
 * 列出待选课程
 * @param data
 */
export function listWaitSelectCourses(data) {
    return request({
        url: STU_PREFIX + `/listWaitSelectCourses`,
        method: 'post',
        data
    });
}

/**
 * 修改排序值
 * @param operationId 营销资源ID
 * @param showOrder 新的排序值
 */
export function modifyShowOrder(operationId, showOrder) {
    return request({
        url: PREFIX + `/modifyShowOrder/${operationId}?showOrder=${showOrder}`,
        method: 'put'
    });
}

export const FREE_GOOD_COURSE = new Operational(enable, disable, switchTop, modifyShowOrder, batchCourseOperationDelete);

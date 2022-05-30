import {CTX} from '@/api/config';
import request from '@/utils/request';

const PREFIX = CTX.STU + `courseFamousTeacherRel`;
/**
 * 分页
 * @param params
 * @returns {AxiosPromise}
 */
export function courseFamousTeacherRelPage(params) {
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
export function courseFamousTeacherRelBatchAdd(teacherId, data) {
    return request({
        url: PREFIX + `/batchAdd?teacherId=${teacherId}`,
        method: 'post',
        data
    });
}

/**
 * 编辑
 * @param data
 * @returns {AxiosPromise}
 */
export function courseFamousTeacherRelEdit(data) {
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
export function courseFamousTeacherRel(id) {
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
export function courseFamousTeacherRelBatchDelete(data) {
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
export function courseFamousTeacherRelListAll() {
    return request({
        url: PREFIX + `/listAll`,
        method: 'get'
    });
}

/**
 * 修改排序值
 * @param id 个性化推荐ID
 * @param showOrder 新的排序值
 */
export function modifyShowOrder(id, showOrder) {
    return request({
        url: PREFIX + `/modifyShowOrder/${id}?showOrder=${showOrder}`,
        method: 'put'
    });
}

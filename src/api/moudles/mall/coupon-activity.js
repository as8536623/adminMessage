import {CTX} from '@/api/config';
import request from '@/utils/request';

const PREFIX = CTX.MALL + `coupon/activity`;

/**
 * 分页
 * @param params
 */
export function couponActivityPage(params) {
    return request({
        url: PREFIX + `/page`,
        method: 'get',
        params
    });
}

/**
 * 新增
 * @param data
 */
export function couponActivityAdd(data) {
    return request({
        url: PREFIX + `/add`,
        method: 'post',
        data
    });
}

/**
 * 编辑
 * @param data
 */
export function couponActivityEdit(data) {
    return request({
        url: PREFIX + `/edit`,
        method: 'put',
        data
    });
}

/**
 * 详情
 * @param id
 */
export function couponActivity(id) {
    return request({
        url: PREFIX + `/` + id,
        method: 'get'
    });
}

/**
 * 批量删除
 */
export function couponActivityBatchDelete(data) {
    return request({
        url: PREFIX + `/delete`,
        method: 'delete',
        data
    });
}

/**
 * 全部数据
 */
export function couponActivityListAll() {
    return request({
        url: PREFIX + `/listAll`,
        method: 'get'
    });
}

/**
 * 启用
 */
export function enabled(id) {
    return request({
        url: `${PREFIX}/enabled/${id}`,
        method: 'put'
    });
}

/**
 * 停用
 */
export function expired(id) {
    return request({
        url: `${PREFIX}/expired/${id}`,
        method: 'put'
    });
}

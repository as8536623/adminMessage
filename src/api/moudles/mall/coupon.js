import {CTX} from '@/api/config';
import request from '@/utils/request';

const PREFIX = CTX.MALL;

/**
 * 分页
 * @param params
 */
export function couponPage(params) {
    return request({
        url: PREFIX + `admin/coupon/page`,
        method: 'get',
        params
    });
}

/**
 * 新增
 * @param data
 */
export function couponAdd(data) {
    return request({
        url: PREFIX + `admin/coupon`,
        method: 'post',
        data
    });
}

/**
 * 编辑
 */
export function couponEdit(id, data) {
    return request({
        url: `${PREFIX}admin/coupon/${id}`,
        method: 'put',
        data
    });
}

/**
 * 详情
 * @param id
 */
export function coupon(id) {
    return request({
        url: PREFIX + `admin/coupon/` + id,
        method: 'get'
    });
}

/**
 * 废弃券
 */
export function invalid(id) {
    return request({
        url: PREFIX + `admin/coupon/void/` + id,
        method: 'put'
    });
}

/**
 * 批量删除
 * @param data eg：[1,2,3,4]
 */
export function velnBatchDelete(data) {
    return request({
        url: PREFIX + `/delete`,
        method: 'delete',
        data
    });
}

/**
 * 全部数据
 */
export function velnListAll() {
    return request({
        url: PREFIX + `/listAll`,
        method: 'get'
    });
}

import {CTX} from '@/api/config';
import request from '@/utils/request';

const PREFIX = CTX.MALL + `cert`;

/**
 * 分页
 * @param params
 */
export function certPage(params) {
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
export function certAdd(data) {
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
export function certEdit(data) {
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
export function cert(id) {
    return request({
        url: PREFIX + `/` + id,
        method: 'get'
    });
}

/**
 * 批量删除
 * @param data eg：[1,2,3,4]
 */
export function certBatchDelete(data) {
    return request({
        url: PREFIX + `/delete`,
        method: 'delete',
        data
    });
}

/**
 * 全部数据
 */
export function certListAll() {
    return request({
        url: PREFIX + `/listAll`,
        method: 'get'
    });
}

/**
 * 上移
 */
export function upCert(id) {
    return request({
        url: `${PREFIX}/up/${id}`,
        method: 'put'
    });
}

/**
 * 下移
 */
export function downCert(id) {
    return request({
        url: `${PREFIX}/down/${id}`,
        method: 'put'
    });
}

/**
 * 停用
 */
export function disabledCert(id) {
    return request({
        url: `${PREFIX}/disabled/${id}`,
        method: 'put'
    });
}

/**
 * 启用
 */
export function enabledCert(id) {
    return request({
        url: `${PREFIX}/enabled/${id}`,
        method: 'put'
    });
}

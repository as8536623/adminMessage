import {CTX} from '@/api/config';
import request from '@/utils/request';

const PREFIX = CTX.MALL + `rechargeCard`;

/**
 * 分页
 * @param params
 * @returns {AxiosPromise}
 */
export function rechargeCardPage(params) {
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
export function rechargeCardAdd(data) {
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
export function rechargeCardEdit(data) {
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
export function rechargeCard(id) {
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
export function rechargeCardBatchDelete(data) {
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
export function rechargeCardListAll() {
    return request({
        url: PREFIX + `/listAll`,
        method: 'get'
    });
}

/**
 * 给选定的人员赠送充值卡
 */
export function giveSelectedUsers(cardId, data) {
    return request({
        url: PREFIX + 'giveSelectedUsers/' + cardId,
        method: 'post',
        data
    });
}

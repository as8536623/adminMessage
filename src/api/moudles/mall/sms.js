import {CTX} from '@/api/config';
import request from '@/utils/request';

const PREFIX = CTX.MALL + `messageManage`;
/**
 * 分页
 * @param params
 * @returns {AxiosPromise}
 */
export function smsPage(params) {
    return request({
        url: PREFIX + `/system/page`,
        method: 'get',
        params
    });
}

/**
 * 新增、编辑
 * @param data
 * @returns {AxiosPromise}
 */
export function smsAddAndUpdate(data) {
    return request({
        url: PREFIX + `/system/messageAddOrUpdate`,
        method: 'post',
        data
    });
}

/**
 * 详情
 * @param id
 * @returns {AxiosPromise}
 */
export function sms(id) {
    return request({
        url: PREFIX + `/system/` + id,
        method: 'get'
    });
}

/**
 * 批量删除
 * @param data eg：[1,2,3,4]
 * @returns {AxiosPromise}
 */
export function smsBatchDelete(data) {
    return request({
        url: PREFIX + `/system/delete`,
        method: 'POST',
        data
    });
}
/**
 * 发送消息
 * @param id
 * @returns {AxiosPromise}
 */
export function smsSend(params) {
    return request({
        url: PREFIX + `/system/send`,
        method: 'POST',
        params
    });
}


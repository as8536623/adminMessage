import {CTX} from '@/api/config';
import request from '@/utils/request';

const PREFIX = CTX.MALL + `messageManage`;
/**
 * 分页
 * @param params
 * @returns {AxiosPromise}
 */
export function noticePage(params) {
    return request({
        url: PREFIX + `/notice/page`,
        method: 'get',
        params
    });
}

/**
 * 新增、编辑
 * @param data
 * @returns {AxiosPromise}
 */
export function noticeAddAndUpdate(data) {
    return request({
        url: PREFIX + `/notice/noticeAddOrUpdate`,
        method: 'post',
        data
    });
}

/**
 * 详情
 * @param id
 * @returns {AxiosPromise}
 */
export function notice(id) {
    return request({
        url: PREFIX + `/notice/` + id,
        method: 'get'
    });
}

/**
 * 删除
 * @returns {AxiosPromise}
 */
export function noticeDelete(params) {
    return request({
        url: PREFIX + `/notice/delete`,
        method: 'POST',
        params
    });
}
/**
 * 启用公告
 * @param id
 * @returns {AxiosPromise}
 */
export function noticeEnable(params) {
    return request({
        url: PREFIX + `/notice/enable`,
        method: 'POST',
        params
    });
}

/**
 * 停用公告
 * @param id
 * @returns {AxiosPromise}
 */
export function noticeDisable(params) {
    return request({
        url: PREFIX + `/notice/disable`,
        method: 'POST',
        params
    });
}

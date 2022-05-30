/**
 * UserRangeController
 * @author yuqiusuo
 */

import request from '@/utils/request';
import {getUcPrefix} from '@/utils/ajax';
const ctx = `${getUcPrefix()}/userRange`;

/**
 * 分页获取有管辖范围的管理员列表
 */
export function userRangePage(params) {
    return request({
        url: `${ctx}/page`,
        method: 'get',
        params
    });
}

/**
 * 根据用户删除管辖范围
 */
export function deleteByUser(params) {
    return request({
        url: `${ctx}/deleteByUser`,
        method: 'delete',
        params
    });
}

/**
 * 删除用户管辖范围
 */
export function deleteUserRangeById(data) {
    return request({
        url: `${ctx}/removeOrgs`,
        method: 'post',
        data
    });
}

/**
 * 获取管辖范围 信息
 */
export function getUserRangeById(id) {
    return request({
        url: `${ctx}/${id}`,
        method: 'get'
    });
}

/**
 * 根据查询条件分页获取已选组织
 */
export function searchSelectedOrg(data) {
    return request({
        url: `${ctx}/searchSelectedOrg`,
        method: 'post',
        data
    });
}

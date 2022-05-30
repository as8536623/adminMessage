/**
 * RoleController
 * @author yuqiusuo
 */

import request from '@/utils/request';
import {getUcPrefix} from '@/utils/ajax';
const ctx = `${getUcPrefix()}/role`;

// 获取角色数据
export function roleListAll(params) {
    return request({
        url: `${ctx}/listAll`,
        method: 'get',
        params
    });
}

// 新增角色数据
export function roleSave(params) {
    return request({
        url: `${ctx}/save`,
        method: 'post',
        params
    });
}

// 新增角色数据
export function roleUpdate(params) {
    return request({
        url: `${ctx}/update`,
        method: 'put',
        params
    });
}

// 新增角色数据
export function roleDelete(data) {
    return request({
        url: `${ctx}/delete`,
        method: 'post',
        data
    });
}

/**
 * 获取所有学员角色数据
 */
export function listAllUserRole() {
    return request({
        url: `${ctx}/listAllUserRole`,
        method: 'get'
    });
}

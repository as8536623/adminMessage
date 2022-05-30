/**
 * AuthController
 * @author yuqiusuo
 */

import request from '@/utils/request';
import {getUcPrefix} from '@/utils/ajax';
const ctx = `${getUcPrefix()}/auth`;

// 获取角色数据
export function getCanManageAuthTree(roleId) {
    return request({
        url: `${ctx}/getCanManageAuthTree/${roleId}`,
        method: 'get'
    });
}

// 获取角色权限数据
export function getAuthTree(userId) {
    return request({
        url: `${ctx}/getAuthTree/${userId}`,
        method: 'get'
    });
}

// 获取已选角色权限数据
export function getSelectedAuthIds(userId) {
    return request({
        url: `${ctx}/getSelectedAuthIds/${userId}`,
        method: 'get'
    });
}

/**
 * 是否是系统管理员
 */
export function isSuperAdmin() {
    return request({
        url: `${ctx}/isSuperAdmin`,
        method: 'get'
    });
}

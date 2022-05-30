/**
 * RoleController
 * @author yuqiusuo
 */

import request from '@/utils/request';
import {getUcPrefix} from '@/utils/ajax';
const ctx = `${getUcPrefix()}/userRoleRel`;

// 获取角色数据
export function userRoleRelPage(params) {
    return request({
        url: `${ctx}/page`,
        method: 'get',
        params
    });
}

// 删除接口,根据角色Id，人员Id列表，批量删除用户角色关联
export function delUserRoleRel(data) {
    return request({
        url: `${ctx}/delUserRoleRel`,
        method: 'post',
        data
    });
}

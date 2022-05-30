/**
 * RoleController
 * @author yuqiusuo
 */

import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.STU_API}/useScope` : `${process.env.STU_API}/useScope`;

// 分页查询人员开放范围，管理后台调用
export function searchUser(data) {
    return request({
        url: `${ctx}/searchUser`,
        method: 'post',
        data
    });
}
export function selectedUser(data) {
    return request({
        url: `${ctx}/selectedUser`,
        method: 'post',
        data
    });
}
// 新增
export function addUsers(data) {
    return request({
        url: `${ctx}/addUsers`,
        method: 'post',
        data
    });
}
// 删除
export function removeUsers(data) {
    return request({
        url: `${ctx}/removeUsers`,
        method: 'post',
        data
    });
}

// 管理员授权查询
export function selectedUserAdmin(data) {
    return request({
        url: `${ctx}/selectedUserAdmin`,
        method: 'post',
        data
    });
}

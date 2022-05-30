/**
 * UserComponentController
 * @author yuqiusuo
 */

import request from '@/utils/request';
import {getUcPrefix} from '@/utils/ajax';
const ctx = `${getUcPrefix()}/userComponent`;

/**
 * 获取选人组件待选人员
 */
export function searchUser(data) {
    console.info('searchUserUrl', ctx);
    return request({
        url: `${ctx}/searchUser`,
        method: 'post',
        data
    });
}

/**
 * 获取是否有部门、群组、岗位 操作权限
 */
export function listRangOrg() {
    return request({
        url: `${ctx}/listRangOrg`,
        method: 'POST'
    });
}

// 根据条件获取已开放的人员
export function getUserList(data) {
    return request({
        url: `${ctx}/searchSelectedUserPage`,
        method: 'POST',
        data
    });
}

// 已开放的人员删除
export function removeUsers(data) {
    return request({
        url: `${ctx}/removeUsers`,
        method: 'POST',
        data
    });
}

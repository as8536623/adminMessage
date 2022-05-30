/**
 * RoleAuthRelController
 * @author yuqiusuo
 */

import request from '@/utils/request';
import {getUcPrefix} from '@/utils/ajax';
const ctx = `${getUcPrefix()}/roleAuthRel`;

// 为角色批量添加权限
export function addRoleAuthRel(data) {
    return request({
        url: `${ctx}/addRoleAuthRel`,
        method: 'post',
        data
    });
}

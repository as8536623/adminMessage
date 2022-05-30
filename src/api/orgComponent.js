/**
 * OrgController
 * @author yuqiusuo
 */

import request from '@/utils/request';
import {getUcPrefix} from '@/utils/ajax';
const ctx = `${getUcPrefix()}/orgComponent`;

// 获取已选
export function searchSelectedOrg() {
    return request({
        url: `${ctx}/searchSelectedOrg`,
        method: 'get'
    });
}

// 根据条件获取已开放的组织
export function getOrgList(data) {
    return request({
        url: `${ctx}/searchSelectedOrgPage`,
        method: 'POST',
        data
    });
}

// 已开放的组织删除
export function removeOrgs(data) {
    return request({
        url: `${ctx}/removeOrgs`,
        method: 'POST',
        data
    });
}

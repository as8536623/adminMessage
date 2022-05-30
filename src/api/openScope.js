import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.STU_API}/openScope` : `${process.env.STU_API}/openScope`;

// 根据条件获取已开放的人员
export function getUserList(data) {
    return request({
        url: `${ctx}/searchUser`,
        method: 'POST',
        data
    });
}

// 根据条件获取已开放的组织
export function getOrgList(data) {
    return request({
        url: `${ctx}/searchOrg`,
        method: 'POST',
        data
    });
}

// 删除开放范围
export function delOpenScope(data) {
    return request({
        url: `${ctx}/delRel`,
        method: 'POST',
        data
    });
}

// 添加开放范围
export function addOpenScope(data) {
    return request({
        url: `${ctx}/saveRel`,
        method: 'POST',
        data
    });
}

// 查询授权范围
export function searchUser(data) {
    return request({
        url: `${ctx}/searchUser`,
        method: 'POST',
        data
    });
}


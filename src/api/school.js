/**
 * OrgController
 * @author yuqiusuo
 */

import request from '@/utils/request';
import {getUcPrefix} from '@/utils/ajax';
const ctx = `${getUcPrefix()}/org`;

// 获取公司部门树
export function getOrgTree() {
    return request({
        url: `${ctx}/getOrgTree`,
        method: 'get'
    });
}

// 获取学校
export function get(param) {
    return request({
        url: `${ctx}/` + param,
        method: 'get'
    });
}

// 获取公司部门树
export function search(params) {
    return request({
        url: `${ctx}/search`,
        method: 'get',
        params
    });
}

// 新增公司部门
export function insertOrg(data) {
    return request({
        url: `${ctx}/insert`,
        method: 'post',
        data
    });
}

// 编辑公司部门
export function updateOrg(data) {
    return request({
        url: `${ctx}/update`,
        method: 'put',
        data
    });
}

// 删除公司部门
export function deleteOrg(params) {
    return request({
        url: `${ctx}/delete`,
        method: 'delete',
        params
    });
}

// 移动公司部门
export function moveOrg(params) {
    return request({
        url: `${ctx}/move`,
        method: 'post',
        params
    });
}

// 移动公司部门
export function enable(params) {
    return request({
        url: `${ctx}/enable`,
        method: 'get',
        params
    });
}

// 移动公司部门
export function disable(params) {
    return request({
        url: `${ctx}/disable`,
        method: 'get',
        params
    });
}

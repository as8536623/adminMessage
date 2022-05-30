import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + '/veln-k12/group' : '/veln-k12/group';

// 获取List
export function getGroupTree(data) {
    return request({
        url: `${ctx}/getTree`,
        method: 'post',
        data
    });
}

// 获取数据
export function groupPage(params) {
    return request({
        url: `${ctx}/search`,
        method: 'post',
        data: params
    });
}

// 新增群组
export function insertGroup(params) {
    return request({
        url: `${ctx}/insert`,
        method: 'post',
        data: params
    });
}

// 修改群组
export function updateGroup(params) {
    return request({
        url: `${ctx}/update`,
        method: 'PUT',
        data: params
    });
}

// 删除群组
export function deleteGroup(params) {
    return request({
        url: `${ctx}/delete`,
        method: 'delete',
        data: params
    });
}

// 启用群组
export function enabledGroup(params) {
    return request({
        url: `${ctx}/enable`,
        method: 'put',
        data: params
    });
}

// 删除群组
export function disableGroup(params) {
    return request({
        url: `${ctx}/disable`,
        method: 'put',
        data: params
    });
}

// 获取群组详情
export function getGroupDetail(id) {
    return request({
        url: `${ctx}/${id}`,
        method: 'GET'
    });
}

/**
 * 新增动态人员
 */
export function editGroupMember(data) {
    return request({
        url: `${ctx}/addCondition`,
        method: 'put',
        data
    });
}

// 快速创建群组
export function quickAddGroup(data) {
    return request({
        url: `${ctx}/quickAddGroup`,
        method: 'post',
        data
    });
}

// 根据职位分类及群组树
export function getTree() {
    return request({
        url: `${ctx}/getTree`,
        method: 'post'
    });
}

import request from '@/utils/request';
import {getUcPrefix} from '@/utils/ajax';
const ctx = `${getUcPrefix()}/group`;

// 获取List
export function getGroupTree(data) {
    return request({
        url: `${ctx}/getTree`,
        method: 'post',
        data
    });
}

// 获取Code
export function getCode(data) {
    return request({
        url: `${ctx}/genCode`,
        method: 'get'
    });
}

// 获取校区下面的班级
export function getClassroomTree(params) {
    return request({
        url: `${ctx}/getClassroomTree`,
        method: 'get',
        params
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

// 群组 插入学员
export function insertStudent(data) {
    return request({
        url: `${ctx}/insertStudent`,
        method: 'post',
        data
    });
}

// 群组 插入学员
export function updateStudent(data) {
    return request({
        url: `${ctx}/updateStudent`,
        method: 'post',
        data
    });
}

// 群组 获取学员信息
export function getStudent(params) {
    return request({
        url: `${ctx}/getStudent`,
        method: 'get',
        params
    });
}

// 群组 查询学员
export function searchClassroomMember(params) {
    return request({
        url: `${ctx}/searchClassroomMember`,
        method: 'get',
        params
    });
}

/**
 * 批量移出班级
 */
export function deleteMember(data) {
    return request({
        url: `${ctx}/deleteMember`,
        method: 'post',
        data: data
    });
}

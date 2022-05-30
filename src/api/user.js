/**
 * UserController
 * @author yuqiusuo
 */

import request from '@/utils/request';
import {getUcPrefix} from '@/utils/ajax';
const ctx = () => {
    return `${getUcPrefix()}/user`;
};

/**
 * 获取个人信息
 */
export function userGetForAdmin(ucPrefix) {
    return request({
        url: `${process.env.UC_API}/user/getFrontUserForAdmin`,
        method: 'get'
    });
}

/**
 * 获取个人信息
 */
export function userGet(ucPrefix) {
    return request({
        url: `${process.env.UC_API}/user/getFrontUser`,
        method: 'get'
    });
}

/**
 * 获取人员分页
 */
export function userPage(params) {
    return request({
        url: `${ctx()}/page`,
        method: 'get',
        params
    });
}

/**
 * 根据用户Id，批量停用用户
 */
export function userDisabled(data) {
    return request({
        url: `${ctx()}/disabled`,
        method: 'put',
        data
    });
}

/**
 * 根据用户Id，批量启用用户
 */
export function userEnable(data) {
    return request({
        url: `${ctx()}/enable`,
        method: 'put',
        data
    });
}

/**
 * 根据用户Id，重置用户登录密码
 */
export function userResetPwd(data) {
    return request({
        url: `${ctx()}/resetPwd`,
        method: 'put',
        data
    });
}

/**
 * 新增用户
 */
export function userSave(data) {
    return request({
        url: `${ctx()}/save`,
        method: 'post',
        data
    });
}

/**
 * 编辑用户
 */
export function userUpdate(data) {
    return request({
        url: `${ctx()}/update`,
        method: 'put',
        data
    });
}

/**
 * 新增外部联系人
 */
export function saveOuterUser(data) {
    return request({
        url: `${ctx()}/saveOuterUser`,
        method: 'post',
        data
    });
}

/**
 * 编辑外部联系人
 */
export function updateOuterUser(data) {
    return request({
        url: `${ctx()}/updateOuterUser`,
        method: 'post',
        data
    });
}

/**
 * 获取用户信息
 */
export function getUserAllInfo(params) {
    return request({
        url: `${ctx()}/getUserAllInfo`,
        method: 'get',
        params
    });
}

/**
 * 导入人员
 */
export function importUser(fileId) {
    return request({
        url: `${ctx()}/importUser/${fileId}`,
        method: 'get'
    });
}

/**
 * 更新人员
 */
export function importUpdateUser(fileId) {
    return request({
        url: `${ctx()}/importUpdateUser/${fileId}`,
        method: 'get'
    });
}

/**
 * 获取管理员信息出错
 */
export function searchAllAdmin(data) {
    return request({
        url: `${ctx()}/searchAllAdmin`,
        method: 'post',
        data
    });
}

/**
 * 导出 excel
 */
export function userExport(params) {
    return request({
        url: `${ctx()}/export`,
        method: 'post',
        params
    });
}

/**
 * 新增 继续导入
 */
export function saveImport() {
    return request({
        url: `${ctx()}/saveImport`,
        method: 'get'
    });
}

/**
 * 添加 继续导入
 */
export function updateImport() {
    return request({
        url: `${ctx()}/updateImport`,
        method: 'get'
    });
}

// 修改密码
export function modifyPwd(data) {
    return request({
        url: `${ctx()}/app/modifyPwd`,
        method: 'post',
        data
    });
}

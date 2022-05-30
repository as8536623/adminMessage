import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.STU_API}/resourceCategory` : `${process.env.STU_API}/resourceCategory`;

/**
 * 获取类别
 */
export function getCategory() {
    return request({
        url: `${ctx}/getCanManageTree`,
        method: 'get'
    });
}

// 新增
export function insertNode(data) {
    return request({
        url: `${ctx}/insert`,
        method: 'post',
        data
    });
}

// 编辑
export function updateNode(data) {
    return request({
        url: `${ctx}/update`,
        method: 'POST',
        data
    });
}

// 删除
export function deleteNode(params) {
    return request({
        url: `${ctx}/delete`,
        method: 'delete',
        params
    });
}

// 移动
export function moveNode(params) {
    return request({
        url: `${ctx}/move`,
        method: 'post',
        params
    });
}

// 保存开放范围
export function updateScope(params) {
    return request({
        url: `${ctx}/updateScope`,
        method: 'post',
        params
    });
}

// 查询一级类别
export function listFirstLevelCategory() {
    return request({
        url: `${ctx}/listFirstLevelCategory`,
        method: 'get'
    });
}

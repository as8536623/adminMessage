import request from '@/utils/request';
import {getCtx} from '@/utils/dev';
import {formatGetParams} from '@/utils/index';

const ctx = getCtx() ? getCtx() + `${process.env.PE_API}/item` : `${process.env.PE_API}/item`;

/**
 * 获取类别树&题库树
 */
export function listBankTree() {
    return request({
        url: `${ctx}/listBankTree`,
        method: 'get'
    });
}

/**
 * 分页查询试题
 */
export function searchItem(params) {
    return request({
        url: `${ctx}/searchItem${formatGetParams(params)}`,
        method: 'get'
    });
}

/**
 * 保存为草稿
 * saveItem(Item item, String content)
 */
export function addItem(data) {
    return request({
        url: `${ctx}/addItem`,
        method: 'post',
        data
    });
}

/**
 * 保存并启用
 * saveEnableItem(Item item, String content)
 */
export function addEnableItem(data) {
    return request({
        url: `${ctx}/addEnableItem`,
        method: 'post',
        data
    });
}

/**
 * 删除试题
 */
export function delItem(data) {
    return request({
        url: `${ctx}/delItem`,
        method: 'post',
        data
    });
}

// 试题详情
export function getItem(itemId) {
    return request({
        url: `${ctx}/getItem?itemId=${itemId}`,
        method: 'get'
    });
}

/**
 * 试题启用
 */
export function enable(data) {
    return request({
        url: `${ctx}/enable`,
        method: 'post',
        data
    });
}

/**
 * 试题停用
 */
export function disable(data) {
    return request({
        url: `${ctx}/disable`,
        method: 'post',
        data
    });
}

/**
 * 生成试题编号
 */
export function genItemCode() {
    return request({
        url: `${ctx}/genItemCode`,
        method: 'get'
    });
}

/**
 * 导入试题
 */
export function importItem(fileId) {
    return request({
        url: `${ctx}/importItem/${fileId}`,
        method: 'get'
    });
}

/**
 * 导出 excel
 */
export function exportItem(params) {
    return request({
        url: `${ctx}/exportItem${formatGetParams(params)}`,
        method: 'get'
    });
}

/**
 * 课程 导入 试题
 */
export function importBankItem(params) {
    return request({
        url: `${ctx}/importBankItem${formatGetParams(params)}`,
        method: 'get'
    });
}

/**
 * 课程 试题 分页
 */
export function searchCourseItem(params) {
    return request({
        url: `${ctx}/searchCourseItem`,
        method: 'get',
        params
    });
}

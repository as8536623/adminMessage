import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.PE_API}/itemBank` : `${process.env.PE_API}/itemBank`;

/**
 * 获取分页数据
 */
export function searchItemBank(params) {
    return request({
        url: `${ctx}/searchBank`,
        method: 'get',
        params
    });
}

/**
 * 题库新增
 */
export function saveBank(params) {
    return request({
        url: `${ctx}/addBank`,
        method: 'post',
        data: params
    });
}

/**
 * 题库编辑
 */
export function updateBank(params) {
    return request({
        url: `${ctx}/updBank`,
        method: 'post',
        data: params
    });
}

/**
 * 删除题库
 */
export function delBank(params) {
    return request({
        url: `${ctx}/delBank`,
        method: 'get',
        params
    });
}

/**
 * 选择题库组件-获取题库
 * @param data
 */
export function search(data) {
    return request({
        url: `${ctx}/page`,
        method: 'post',
        data
    });
}

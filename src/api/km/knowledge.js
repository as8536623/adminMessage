import request from '@/utils/request';
import {getCtx} from '@/utils/dev';
import {formatGetParams} from '@/utils/index';

const ctx = getCtx() ? getCtx() + `${process.env.KM_API}/knowledge` : `${process.env.KM_API}/knowledge`;

/**
 * 获取类别
 */
export function pageKnowledge(params) {
    return request({
        url: `${ctx}/search${formatGetParams(params)}`,
        method: 'get'
    });
}

// 资料-根据ID获取
export function getKnowledge(params) {
    return request({
        url: `${ctx}/getKnowledgeDetail`,
        method: 'get',
        params
    });
}

// 资料-新增
export function knowledgeInsert(data) {
    return request({
        url: `${ctx}/insert`,
        method: 'post',
        data
    });
}

// 资料-启用
export function enableByIdList(data) {
    return request({
        url: `${ctx}/enable`,
        method: 'put',
        data
    });
}

// 资料-停用
export function disableByIdList(data) {
    return request({
        url: `${ctx}/disable`,
        method: 'put',
        data
    });
}

// 资料-审核
export function auditKnowledge(data) {
    const {ids, type, reason} = data;
    return request({
        url: `${ctx}/approve`,
        method: 'put',
        data: ids,
        params: {type, reason}
    });
}

// 资料-更新
export function knowledgeUpdate(data) {
    return request({
        url: `${ctx}/update`,
        method: 'put',
        data
    });
}

// 讲师类别-删除
export function knowledgeDelete(data) {
    return request({
        url: `${ctx}/delete`,
        method: 'delete',
        data
    });
}

// 讲师类别-删除
export function knowledgeEnable(data, params) {
    return request({
        url: `${ctx}/enableKnowledgeByIdList`,
        method: 'put',
        data,
        params
    });
}

/**
 * 获取资料编号
 */
export function getCode() {
    return request({
        url: `${ctx}/getCode`,
        method: 'get'
    });
}

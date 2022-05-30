import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.PE_API}/knowledge` : `${process.env.PE_API}/knowledge`;

/**
 * 知识点列表
 * @param data
 */
export function getList(data) {
    return request({
        url: `${ctx}/page`,
        method: 'post',
        data
    });
}

/**
 * 知识点保存
 * @param data
 */
export function save(data) {
    return request({
        url: `${ctx}/save`,
        method: 'post',
        data
    });
}

/**
 * 知识点删除
 * @param params
 */
export function del(params) {
    return request({
        url: `${ctx}/delete/${params}`,
        method: 'get'
    });
}

/**
 * 知识点详情
 */
export function get(params) {
    return request({
        url: `${ctx}/get/${params}`,
        method: 'get'
    });
}

export function listKnowledgeTree() {
    return request({
        url: `${ctx}/listKnowledgeTree`,
        method: 'get'
    });
}

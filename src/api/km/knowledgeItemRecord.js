import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.KM_API}/knowledgeItemRecord` : `${process.env.KM_API}/knowledgeItemRecord`;

/**
 * 保存录音信息
 */
export function insertKnowledgeItemRecord(data) {
    return request({
        url: `${ctx}/insert`,
        method: 'post',
        data
    });
}

/**
 * 保存录音信息
 */
export function listByItemId(params) {
    return request({
        url: `${ctx}/share/listByItemId`,
        method: 'get',
        params
    });
}

/**
 * 删除录音信息
 */
export function deleteRecord(params) {
    return request({
        url: `${ctx}/delete`,
        method: 'delete',
        params
    });
}

import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.KM_API}/knowledgeItem` : `${process.env.KM_API}/knowledgeItem`;

/**
 * 保存图片信息
 */
export function batchInsertKnowledgeItem(data) {
    return request({
        url: `${ctx}/batchInsert`,
        method: 'post',
        data
    });
}

/**
 * 获取图片信息
 */
export function listByKnowledgeId(params) {
    return request({
        url: `${ctx}/listByKnowledgeId`,
        method: 'get',
        params
    });
}

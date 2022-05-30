import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.PE_API}/item` : `${process.env.PE_API}/item`;

/**
 * 获取类别树&题库树
 */
export function listTree() {
    return request({
        url: `${ctx}/listTree`,
        method: 'get'
    });
}

import request from '@/utils/request';
import {getCtx} from '@/utils/dev';
// import { formatGetParams } from '@/utils/index';

const ctx = getCtx() ? getCtx() + `${process.env.KM_API}/statisticsUserRel` : `${process.env.KM_API}/statisticsUserRel`;

/**
 * 获取相关人员信息
 */
export function searchUsers(params) {
    return request({
        url: `${ctx}/page`,
        method: 'get',
        params
    });
}

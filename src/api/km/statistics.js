import request from '@/utils/request';
import {getCtx} from '@/utils/dev';
// import { formatGetParams } from '@/utils/index';

const ctx = getCtx() ? getCtx() + `${process.env.KM_API}/statistics` : `${process.env.KM_API}/statistics`;

/**
 * 获取相关人员数量信息
 */
export function getStatisticsUser(params) {
    return request({
        url: `${ctx}/get`,
        method: 'get',
        params
    });
}

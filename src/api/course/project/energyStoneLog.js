import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.MP_API}/energyStoneLog` : `${process.env.MP_API}/energyStoneLog`;

// 能量石明细分页
export function userStoneDetail(params) {
    return request({
        url: `${ctx}/page`,
        method: 'get',
        params
    });
}

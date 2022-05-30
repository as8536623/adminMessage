import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.SCORE_API}/admin/account` : `${process.env.SCORE_API}/admin/account`;

// 获取人员积分列表
export function getScoreList(params) {
    return request({
        url: `${ctx}/page`,
        method: 'get',
        params
    });
}

// 批量加减分
export function batchChangeScore(d) {
    const {score, userIds, type} = d;
    const data = userIds;
    const params = {score, type};
    return request({
        url: `${ctx}/batchAdd`,
        method: 'post',
        data,
        params
    });
}

// 批量清零
export function batchClearScore(data) {
    return request({
        url: `${ctx}/batchClear`,
        method: 'post',
        data
    });
}

import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.STU_API}/courseJudge` : `${process.env.STU_API}/courseJudge`;

// 审核评论
export function approve(data) {
    return request({
        url: `${ctx}/approve`,
        method: 'POST',
        data
    });
}

// 评论列表
export function searchJudge(params) {
    return request({
        url: `${ctx}/search`,
        method: 'get',
        params
    });
}

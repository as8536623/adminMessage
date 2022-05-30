import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.SCORE_API}/user/record` : `${process.env.SCORE_API}/user/record`;

// 获取人员积分列表
export function getRecordList(data) {
    const {pageNum, pageSize} = data;
    const params = {pageNum, pageSize};
    return request({
        url: `${ctx}/basePage`,
        method: 'post',
        params,
        data
    });
}

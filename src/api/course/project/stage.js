import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.MP_API}/stage` : `${process.env.MP_API}/stage`;

// 新增任务管理
export function insertAllStageTask(data) {
    return request({
        url: `${ctx}/insertAllStageTask`,
        method: 'post',
        data
    });
}

// 获取任务管理数据
export function getTaskManageInfo(params) {
    return request({
        url: `${ctx}/getTaskManageInfo`,
        method: 'get',
        params
    });
}

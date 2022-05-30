import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.SCORE_API}/rule` : `${process.env.SCORE_API}/rule`;

// 获取全部积分规则
export function getAllRule() {
    return request({
        url: `${ctx}/listAll`,
        method: 'get'
    });
}

// 获取全部规则类型
export function getListModules() {
    return request({
        url: `${ctx}/listModules`,
        method: 'get'
    });
}

// 修改全部积分规则
export function editRule(data) {
    return request({
        url: `${ctx}/edit/${data.id}`,
        method: 'post',
        data
    });
}

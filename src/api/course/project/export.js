import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.MP_API}/export` : `${process.env.MP_API}/export`;

// 项目监控能量石列表导出
export function monitorStone(params) {
    return request({
        url: `${ctx}/monitorStone`,
        method: 'get',
        params
    });
}

// 能量石明细导出
export function energyStoneInfo(params) {
    return request({
        url: `${ctx}/energyStoneInfo`,
        method: 'get',
        params
    });
}

// 项目汇总列表导出
export function monitorSummary(params) {
    return request({
        url: `${ctx}/monitorSummary`,
        method: 'get',
        params
    });
}

// 学员管理列表导出
export function proUser(params) {
    return request({
        url: `${ctx}/proUser`,
        method: 'get',
        params
    });
}

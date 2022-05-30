import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.MP_API}/monitor` : `${process.env.MP_API}/monitor`;

// 获取全部学员List
export function getList(params) {
    return request({
        url: `${ctx}/all/page`,
        method: 'get',
        params
    });
}

// 获取阶段List
export function getStageList(params) {
    return request({
        url: `${ctx}/stage/page`,
        method: 'get',
        params
    });
}

// 获取项目汇总统计信息
export function getStatisticMap(params) {
    return request({
        url: `${ctx}/statisticMap/${params}`,
        method: 'get'
    });
}

// 获取阶段信息
export function getStage(params) {
    return request({
        url: `${process.env.MP_API}/stage/${params}`,
        method: 'get'
    });
}

// 各任务类型
export function getTask(params) {
    const {proId, type} = params;
    return request({
        url: `${ctx}/task/${proId}/${type}`,
        method: 'get'
    });
}

// 在线课详情分页
export function getOnlineList(params) {
    return request({
        url: `${ctx}/online/page`,
        method: 'get',
        params
    });
}

// 能量石监控分页（能量石排行
export function getStoneList(params) {
    return request({
        url: `${ctx}/stone/page`,
        method: 'get',
        params
    });
}

// 监控-项目汇总-学员阶段详情
export function userStageDetail(params) {
    return request({
        url: `${ctx}/userStageDetail/${params.proId}/${params.userId}`,
        method: 'get'
    });
}


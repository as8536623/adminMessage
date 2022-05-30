import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.FACE_API}/activity` : `${process.env.FACE_API}/activity`;

// 现场互动--查询
export function listAll(params) {
    return request({
        url: `${ctx}/listAll`,
        method: 'get',
        params
    });
}

export function activityDelete(params) {
    return request({
        url: `${ctx}/delete`,
        method: 'delete',
        params
    });
}
// 现场互动--是否存在未完成数据
export function unFinish(params) {
    return request({
        url: `${ctx}/unFinish`,
        method: 'get',
        params
    });
}

// 现场互动--是否存在未完成数据
export function activitySave(data) {
    return request({
        url: `${ctx}/save`,
        method: 'post',
        data
    });
}

// 现场互动--类型查询
export function listByType(params) {
    return request({
        url: `${ctx}/listByType`,
        method: 'get',
        params
    });
}

// 考核管理--考核数据汇总
export function activityStatistics(params) {
    return request({
        url: `${ctx}/activityStatistics`,
        method: 'get',
        params
    });
}

// 考核管理--学员互动参与率
export function interactionRate(params) {
    return request({
        url: `${ctx}/interactionRate`,
        method: 'get',
        params
    });
}

// 考核管理--互动形式
export function interactionShape(params) {
    return request({
        url: `${ctx}/interactionShape`,
        method: 'get',
        params
    });
}
// 考核管理 -- 互动参与情况
export function interact(params) {
    return request({
        url: `${ctx}/interact`,
        method: 'get',
        params
    });
}

// 考核管理--培训人数
export function train(params) {
    return request({
        url: `${ctx}/train`,
        method: 'get',
        params
    });
}

// 考核管理--互动排行
export function interactRange(params) {
    return request({
        url: `${ctx}/interactRange`,
        method: 'get',
        params
    });
}

// 回顾
export function retrospect(params) {
    return request({
        url: `${ctx}/admin/retrospect`,
        method: 'get',
        params
    });
}

// 获取面授下签到，报名，考试，作业
export function getType(params) {
    return request({
        url: `${ctx}/getType?faceId=${params}`,
        method: 'get'
    });
}

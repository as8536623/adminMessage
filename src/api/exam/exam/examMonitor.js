import request from '@/utils/request';
import {getCtx} from '@/utils/dev';
const ctx = getCtx() ? getCtx() + `${process.env.PE_API}/examMonitor` : `${process.env.PE_API}/examMonitor`;

export function searchPage(data) {
    return request({
        url: `${ctx}/page`,
        method: 'post',
        data
    });
}

// 学员信息
export function userDetail(params) {
    return request({
        url: `${ctx}/userDetail?userId=${params.id}`,
        method: 'get'
    });
}

// 移除学员
export function removeExamUser(params) {
    return request({
        url: `${ctx}/removeExamUser`,
        method: 'get',
        params: params
    });
}

// 强制交卷
export function forceSubmitExam(params) {
    return request({
        url: `${ctx}/forceSubmitExam`,
        method: 'get',
        params: params
    });
}

// 保存违纪记录
export function saveIllegalRecord(data) {
    return request({
        url: `${ctx}/saveIllegalRecord`,
        method: 'post',
        data
    });
}

// 删除答卷
export function deleteUserPaper(params) {
    return request({
        url: `${ctx}/deleteUserPaper`,
        method: 'get',
        params: params
    });
}

export function exportExamMonitor(data) {
    return request({
        url: `${ctx}/exportExamMonitor`,
        method: 'post',
        data
    });
}

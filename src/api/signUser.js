import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + '/veln-sign/signUser' : '/veln-sign/signUser';

// 学员列表
export function getList(params) {
    return request({
        url: `${ctx}/page`,
        method: 'get',
        params
    });
}

// 出勤
export function attendance(data) {
    return request({
        url: `${ctx}/attendance`,
        method: 'post',
        data
    });
}
// 缺勤
export function absence(data) {
    return request({
        url: `${ctx}/absence`,
        method: 'post',
        data
    });
}
// 失效
export function invalid(data) {
    return request({
        url: `${ctx}/invalid`,
        method: 'post',
        data
    });
}

// 备注
export function remark(data) {
    return request({
        url: `${ctx}/remark`,
        method: 'post',
        data
    });
}

// 详情
export function detail(params) {
    return request({
        url: `${ctx}/get/${params.id}`,
        method: 'get'
    });
}
// 根据签到id获取学员状态数量
export function getUserCount(params) {
    return request({
        url: `${ctx}/getUserCount/${params.id}`,
        method: 'get'
    });
}

// 学员信息
export function getSignUserDetail(params) {
    return request({
        url: `${ctx}/getSignUserDetail?userId=${params.userId}&signId=${params.signId}`,
        method: 'get'
    });
}

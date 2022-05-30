import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + '/veln-enroll/enrollUser' : '/veln-enroll/enrollUser';

// 获取报名名单List
export function getList(params) {
    return request({
        url: `${ctx}/page`,
        method: 'get',
        params
    });
}

// 审核
export function approve(data) {
    return request({
        url: `${ctx}/approve`,
        method: 'post',
        data
    });
}

// 报名名单统计人数
export function statistics(data) {
    return request({
        url: `${ctx}/statistics`,
        method: 'post',
        data
    });
}

// 删除
export function userDelete(data) {
    return request({
        url: `${ctx}/delete`,
        method: 'delete',
        data
    });
}

// 详情
export function detail(params) {
    return request({
        url: `${ctx}/detail`,
        method: 'get',
        params
    });
}

// 学员详情
export function userDetail(params) {
    return request({
        url: `${ctx}/userDetail`,
        method: 'get',
        params
    });
}

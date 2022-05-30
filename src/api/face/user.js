import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.FACE_API}/user` : `${process.env.FACE_API}/user`;

// 考核管理 -- 考核汇总
export function getList(data) {
    return request({
        url: `${ctx}/page`,
        method: 'post',
        data
    });
}

// 设置通过
export function pass(data) {
    return request({
        url: `${ctx}/pass`,
        method: 'post',
        data
    });
}

// 设置拒绝
export function refused(data) {
    return request({
        url: `${ctx}/refused`,
        method: 'post',
        data
    });
}

// 设置优秀学员
export function excellent(data) {
    return request({
        url: `${ctx}/excellent`,
        method: 'post',
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

// 学员管理
export function getEnrollList(data) {
    return request({
        url: `${ctx}/enroll/page`,
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

// 报名名单统计人数
export function remove(data) {
    return request({
        url: `${ctx}/remove`,
        method: 'post',
        data
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

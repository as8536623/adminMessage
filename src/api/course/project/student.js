import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.MP_API}/proUserRel` : `${process.env.MP_API}/proUserRel`;

// 获取List
export function getList(params) {
    return request({
        url: `${ctx}/page`,
        method: 'get',
        params
    });
}

// 详情
export function detail(params) {
    return request({
        url: `${ctx}/detail/${params}`,
        method: 'get'
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

// 移除
export function remove(params) {
    return request({
        url: `${ctx}/delete`,
        method: 'DELETE',
        data: params
    });
}

// 学员信息
export function userDetail(params) {
    return request({
        url: `${ctx}/userDetail/${params}`,
        method: 'get'
    });
}

// 保存学习项目报名
export function saveMpEnroll(data) {
    return request({
        url: `${ctx}/saveMpEnroll`,
        method: 'post',
        data
    });
}

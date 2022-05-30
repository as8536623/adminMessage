import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.MP_API}/project` : `${process.env.MP_API}/project`;

// 获取code值
export function getCode() {
    return request({
        url: `${ctx}/getCode`,
        method: 'get'
    });
}

// 获取List
export function getList(params) {
    return request({
        url: `${ctx}/page`,
        method: 'get',
        params
    });
}

// 启用
export function enable(id) {
    return request({
        url: `${ctx}/status/enable/${id}`,
        method: 'get'
    });
}

// 停用
export function disable(id) {
    return request({
        url: `${ctx}/status/disable/${id}`,
        method: 'get'
    });
}

// 删除
export function del(data) {
    return request({
        url: `${ctx}/delete`,
        method: 'post',
        data
    });
}

// 保存、更新
export function saveBase(data) {
    return request({
        url: `${ctx}/saveBase`,
        method: 'post',
        data
    });
}

// 保存、更新
export function info(id) {
    return request({
        url: `${ctx}/info/${id}`,
        method: 'get'
    });
}

// 删除报名
export function delEnroll(params) {
    const {proId, relId} = params;
    return request({
        url: `${ctx}/deleteEnroll/${proId}/${relId}`,
        method: 'post'
    });
}

// 更新报名的指定人员部分
export function updateEnroll(params) {
    const {proId, enrollId, approve} = params;
    return request({
        url: `${ctx}/update/${proId}/${enrollId}/${approve}`,
        method: 'get'
    });
}

// 获取项目报名部分信息
export function getEnroll(params) {
    return request({
        url: `${ctx}/enroll/${params}`,
        method: 'get'
    });
}

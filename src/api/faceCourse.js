import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.FACE_API}/course` : `${process.env.FACE_API}/course`;

// 获取编号
export function getCode() {
    return request({
        url: `${ctx}/getCode`,
        method: 'get'
    });
}

// 基础信息
export function base(data) {
    return request({
        url: `${ctx}/base`,
        method: 'post',
        data
    });
}

// 面授安排
export function content(data) {
    return request({
        url: `${ctx}/content`,
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

// 获取List
export function getList(data) {
    return request({
        url: `${ctx}/page`,
        method: 'post',
        data
    });
}

// 报名删除
export function deleteHandel(data) {
    return request({
        url: `${ctx}/delete`,
        method: 'delete',
        data
    });
}

// 启用
export function enable(data) {
    return request({
        url: `${ctx}/enable`,
        method: 'post',
        data
    });
}

// 停用
export function disable(data) {
    return request({
        url: `${ctx}/disable`,
        method: 'post',
        data
    });
}

export function listAll() {
    return request({
        url: `${ctx}/listAll`,
        method: 'get'
    });
}

// 获取自定义字段
export function getBaseForm(params) {
    return request({
        url: `${ctx}/getBaseForm?appCode=${params.appCode}`,
        method: 'get'
    });
}

// 自定义字段保存
export function saveBaseForm(data) {
    return request({
        url: `${ctx}/saveBaseForm`,
        method: 'post',
        data
    });
}

// 获取面授开始结束时间
export function getInfoTime(params) {
    return request({
        url: `${ctx}/info`,
        method: 'get',
        params
    });
}

/**
 * 是否是系统管理员
 */
export function isSuperAdmin() {
    return request({
        url: `${ctx}/isSuperAdmin`,
        method: 'get'
    });
}

// 助教删除
export function delEnroll(params) {
    return request({
        url: `${ctx}/delEnroll?courseId=${params.courseId}&enrollId=${params.enrollId}`,
        method: 'post'
    });
}

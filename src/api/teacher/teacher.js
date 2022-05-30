import request from '@/utils/request';
import {getCtx} from '@/utils/dev';
import {formatGetParams} from '@/utils/index';

const ctx = getCtx() ? getCtx() + `${process.env.STU_API}/teacher` : `${process.env.STU_API}/teacher`;

// 讲师管理-分页查询
export function teacherPage(params) {
    return request({
        url: `${ctx}/search${formatGetParams(params)}`,
        method: 'post'
    });
}

export function openApproveSearch(params) {
    return request({
        url: `${ctx}/openApproveSearch${formatGetParams(params)}`,
        method: 'post'
    });
}

// 讲师管理-停用
export function teacherDisable(data) {
    return request({
        url: `${ctx}/disable`,
        method: 'post',
        data
    });
}

// 讲师管理-启用
export function teacherEnable(data) {
    return request({
        url: `${ctx}/enable`,
        method: 'post',
        data
    });
}

// 讲师管理-删除
export function teacherDelete(data) {
    return request({
        url: `${ctx}/delete`,
        method: 'post',
        data
    });
}

// 讲师管理-保存
export function saveAppTeacher(data) {
    return request({
        url: `${ctx}/saveAppTeacher`,
        method: 'post',
        data
    });
}

// 讲师管理-保存
export function save(data) {
    return request({
        url: `${ctx}/save`,
        method: 'post',
        data
    });
}

// 讲师管理-编辑
export function approveTeacher(params) {
    return request({
        url: `${ctx}/approveTeacher`,
        method: 'get',
        params: params
    });
}

// 讲师管理-获取编号
export function getCode() {
    return request({
        url: `${ctx}/getCode`,
        method: 'get'
    });
}

// 讲师管理--获取对应讲师
export function detail(params) {
    return request({
        url: `${ctx}/get/${params.id}`,
        method: 'get'
    });
}


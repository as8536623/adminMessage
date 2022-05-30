import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.STU_API}/course` : `${process.env.STU_API}/course`;
const joinCtx = getCtx() ? getCtx() + `${process.env.STU_API}/` : `${process.env.STU_API}/`;

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

// 获取需要审核课程列表
export function getNeedApproveList(params) {
    return request({
        url: `${ctx}/openApproveSearch`,
        method: 'get',
        params
    });
}

// 审核课程
export function approveCourse(data) {
    return request({
        url: `${ctx}/approveCourse`,
        method: 'post',
        data
    });
}

// 获取最新的审核记录
export function getRejectReason(params) {
    return request({
        url: `${ctx}/getRejectReason`,
        method: 'get',
        params
    });
}

// 新增--第一步
export function insertCourse(data) {
    return request({
        url: `${ctx}/insert`,
        method: 'POST',
        data
    });
}

// 新增--第二步
export function courseContent(params) {
    return request({
        url: `${ctx}/courseContent`,
        method: 'POST',
        data: params
    });
}

// 新增--第三步
export function openScope(params) {
    return request({
        url: `${ctx}/openScope`,
        method: 'POST',
        data: params
    });
}

// 编辑
export function updateCourse(data) {
    return request({
        url: `${ctx}/update`,
        method: 'POST',
        data
    });
}

// 删除
export function deleteCourse(params) {
    return request({
        url: `${ctx}/delete`,
        method: 'delete',
        data: params
    });
}

// 启用
export function enableCourse(params) {
    return request({
        url: `${ctx}/enable`,
        method: 'put',
        data: params
    });
}

// 停用
export function disableCourse(params) {
    return request({
        url: `${ctx}/disable`,
        method: 'put',
        data: params
    });
}

// 发布
export function publishCourse(params) {
    return request({
        url: `${ctx}/enable`,
        method: 'put',
        data: params
    });
}

// 下架
export function offCourse(params) {
    return request({
        url: `${ctx}/disable`,
        method: 'put',
        data: params
    });
}

// 显示
export function displayCourse(params) {
    return request({
        url: `${ctx}/display`,
        method: 'put',
        data: params
    });
}

// 不显示
export function unDisplayCourse(params) {
    return request({
        url: `${ctx}/unDisplay`,
        method: 'put',
        data: params
    });
}

// 停用
export function getCourse(id) {
    return request({
        url: `${ctx}/detail/` + id,
        method: 'get'
    });
}

// 复制
export function copyCourse(id) {
    return request({
        url: `${ctx}/copy`,
        method: 'post',
        params: {id: id}
    });
}

// 复制
export function insertJoinCourse(params) {
    return request({
        url: `${joinCtx}/joinCourse/insert`,
        method: 'post',
        data: params
    });
}
// 复制
export function updateJoinCourse(params) {
    return request({
        url: `${joinCtx}/joinCourse/update`,
        method: 'post',
        data: params
    });
}
// 复制
export function enableJoinCourse(id) {
    return request({
        url: `${joinCtx}/joinCourse/enable`,
        method: 'post',
        params: {id: id}
    });
}
// 复制
export function disableJoinCourse(id) {
    return request({
        url: `${joinCtx}/joinCourse/disable`,
        method: 'post',
        params: {id: id}
    });
}
// 复制
export function batchInsertRel(params) {
    return request({
        url: `${joinCtx}/joinCourse/batchInsertRel`,
        method: 'post',
        data: params
    });
}
// 复制
export function pageJoinCourse(params) {
    return request({
        url: `${joinCtx}/joinCourse/pageJoinCourse`,
        method: 'get',
        params
    });
}// 复制
export function pageJoinCourseRel(params) {
    return request({
        url: `${joinCtx}/joinCourse/pageJoinCourseRel`,
        method: 'get',
        params
    });
}

export function getJoinCourse(params) {
    return request({
        url: `${joinCtx}/joinCourse/getJoinCourse`,
        method: 'get',
        params
    });
}
export function listAllEnable() {
    return request({
        url: `${joinCtx}/joinCourse/listAllEnable`,
        method: 'post'
    });
}

export function batchChangeCategory(params) {
    return request({
        url: `${joinCtx}/course/changeCategory`,
        method: 'post',
        data:params
    });
}

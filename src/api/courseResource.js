import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.STU_API}/courseResource` : `${process.env.STU_API}/courseResource`;
const _courseQuestionRel = getCtx() ? getCtx() + `${process.env.STU_API}/courseQuestionRel` : `${process.env.STU_API}/courseQuestionRel`;

// 获取分页
export function getList(data, pageNum, pageSize) {
    return request({
        url: `${ctx}/page?pageNum=${pageNum}&pageSize=${pageSize}`,
        method: 'post',
        data
    });
}

// 获取详情
export function getInfo(id) {
    return request({
        url: `${ctx}/getDetail/${id}`,
        method: 'get'
    });
}

// 新增
export function add(data) {
    return request({
        url: `${ctx}/add`,
        method: 'post',
        data
    });
}

// 编辑
export function edit(data) {
    return request({
        url: `${ctx}/editBaseInfo`,
        method: 'put',
        data
    });
}

// 删除
export function batchDelete(data) {
    return request({
        url: `${ctx}/delete`,
        method: 'delete',
        data
    });
}

// 删除资源试题
export function courseQuestionRel(params) {
    return request({
        url: `${_courseQuestionRel}/removeItems`,
        method: 'POST',
        data: params
    });
}

// 同步至课程
export function syncToCourse(id,categoryId) {
    return request({
        url: `${ctx}/syncToCourse?id=${id}&categoryId=${categoryId}`,
        method: 'post'
    });
}

// 批量同步至课程
export function batchSyncToCourse(data) {
    return request({
        url: `${ctx}/batchSyncToCourse`,
        method: 'post',
        data
    });
}

export function batchChangeCategory(params) {
    return request({
        url: `${ctx}/changeCategory`,
        method: 'post',
        data:params
    });
}

import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.STU_API}/teacherCategory` : `${process.env.STU_API}/teacherCategory`;

// 讲师类别
export function teacherCategory() {
    return request({
        url: `${ctx}/teacher`,
        method: 'get'
    });
}

// 讲师类别-新增
export function teacherCategoryInsert(data) {
    return request({
        url: `${ctx}/insert`,
        method: 'post',
        data
    });
}

// 讲师类别-更新
export function teacherCategoryUpdate(data) {
    return request({
        url: `${ctx}/update`,
        method: 'post',
        data
    });
}

// 讲师类别-移动
export function teacherCategoryMove(params) {
    return request({
        url: `${ctx}/move`,
        method: 'post',
        params
    });
}

// 讲师类别-删除
export function teacherCategoryDelete(params) {
    return request({
        url: `${ctx}/delete`,
        method: 'delete',
        params
    });
}


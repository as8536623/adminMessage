import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.STU_API}/teacherLevel` : `${process.env.STU_API}/teacherLevel`;

// 讲师等级
export function teacherLevel() {
    return request({
        url: `${ctx}/teacher`,
        method: 'get'
    });
}

// 讲师等级-新增
export function teacherLevelInsert(data) {
    return request({
        url: `${ctx}/insert`,
        method: 'post',
        data
    });
}

// 讲师等级-更新
export function teacherLevelUpdate(data) {
    return request({
        url: `${ctx}/update`,
        method: 'post',
        data
    });
}

// 讲师等级-移动
export function teacherLevelMove(params) {
    return request({
        url: `${ctx}/move`,
        method: 'post',
        params
    });
}

// 讲师等级-删除
export function teacherLevelDelete(params) {
    return request({
        url: `${ctx}/delete`,
        method: 'delete',
        params
    });
}


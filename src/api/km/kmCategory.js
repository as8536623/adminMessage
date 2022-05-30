import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.KM_API}/category` : `${process.env.KM_API}/category`;

/**
 * 获取类别
 */
export function getCategory() {
    return request({
        url: `${ctx}/getCanManageTree`,
        method: 'get'
    });
}

// 讲师类别-新增
export function categoryInsert(data) {
    return request({
        url: `${ctx}/insert`,
        method: 'post',
        data
    });
}

// 讲师类别-更新
export function categoryUpdate(data) {
    return request({
        url: `${ctx}/update`,
        method: 'post',
        data
    });
}

// 讲师类别-移动
export function categoryMove(params) {
    return request({
        url: `${ctx}/move`,
        method: 'post',
        params
    });
}

// 讲师类别-删除
export function categoryDelete(params) {
    return request({
        url: `${ctx}/delete`,
        method: 'delete',
        params
    });
}

// 保存开放范围
export function updateScope(params) {
    return request({
        url: `${ctx}/updateScope`,
        method: 'post',
        params
    });
}


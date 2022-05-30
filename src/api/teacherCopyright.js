import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.STU_API}/teacherCopyright` : `${process.env.STU_API}/teacherCopyright`;

// 获取List
export function search(data) {
    return request({
        url: `${ctx}/search`,
        method: 'post',
        data
    });
}

export function insert(data) {
    return request({
        url: `${ctx}/insert`,
        method: 'post',
        data
    });
}

export function update(data) {
    return request({
        url: `${ctx}/update`,
        method: 'post',
        data
    });
}

export function enable(data) {
    return request({
        url: `${ctx}/enable`,
        method: 'post',
        data
    });
}

export function disable(data) {
    return request({
        url: `${ctx}/disable`,
        method: 'post',
        data
    });
}

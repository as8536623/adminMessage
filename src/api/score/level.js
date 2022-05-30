import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.SCORE_API}/level` : `${process.env.SCORE_API}/level`;

// 获取全部积分等级
export function getAllLevel() {
    return request({
        url: `${ctx}/listAll`,
        method: 'get'
    });
}

// 新增
export function addLevel(data) {
    return request({
        url: `${ctx}/add`,
        method: 'post',
        data
    });
}

// 批量新增
export function batchAdd(data) {
    return request({
        url: `${ctx}/batchAdd`,
        method: 'post',
        data
    });
}

// 编辑
export function editLevel(data) {
    return request({
        url: `${ctx}/edit/${data.id}`,
        method: 'post',
        data
    });
}

// 编辑
export function delLevel(id) {
    return request({
        url: `${ctx}/delete/${id}`,
        method: 'delete'
    });
}

import request from '@/utils/request';
import {getUcPrefix} from '@/utils/ajax';
const ctx = `${getUcPrefix()}/position`;

// 获取List
export function getPositionTree(data) {
    return request({
        url: `${ctx}/getTree`,
        method: 'post',
        data
    });
}

// 获取数据
export function positionPage(params) {
    return request({
        url: `${ctx}/search`,
        method: 'post',
        data: params
    });
}

// 新增岗位
export function insertPosition(params) {
    return request({
        url: `${ctx}/insert`,
        method: 'post',
        params: params
    });
}

// 修改岗位
export function updatePosition(params) {
    return request({
        url: `${ctx}/update`,
        method: 'PUT',
        params: params
    });
}

// 删除岗位
export function deletePosition(params) {
    return request({
        url: `${ctx}/delete`,
        method: 'DELETE',
        data: params
    });
}

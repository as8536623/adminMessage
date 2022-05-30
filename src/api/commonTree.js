import request from '@/utils/request';
import {getUcCode} from '@/utils/ajax';
const ctx = `${process.env.BASE_API}`;

// 获取树数据
export function getNodeTree(funCode, appCode = getUcCode()) {
    return request({
        url: `${ctx}/${appCode}/category/${funCode}`,
        method: 'get'
    });
}

// 新增节点
export function insertNode(data, appCode = getUcCode()) {
    return request({
        url: `${ctx}/${appCode}/category/insert`,
        method: 'post',
        data
    });
}

// 编辑节点
export function updateNode(data, appCode = getUcCode()) {
    return request({
        url: `${ctx}/${appCode}/category/update`,
        method: 'POST',
        data
    });
}

// 删除节点
export function deleteNode(params, appCode = getUcCode()) {
    return request({
        url: `${ctx}/${appCode}/category/delete`,
        method: 'delete',
        params
    });
}

// 移动节点
export function moveNode(params, appCode = getUcCode()) {
    return request({
        url: `${ctx}/${appCode}/category/move`,
        method: 'post',
        params
    });
}

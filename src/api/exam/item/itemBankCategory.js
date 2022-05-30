import request from '@/utils/request';
import {getCtx} from '@/utils/dev';
// import {formatGetParams} from '@/utils/index';

const ctx = getCtx() ? getCtx() + `${process.env.PE_API}/category` : `${process.env.PE_API}/category`;

// 获取树数据
export function getNodeTree(funCode) {
    return request({
        url: `${ctx}/${funCode}`,
        method: 'get'
    });
}

// 新增节点
export function insertNode(data) {
    return request({
        url: `${ctx}/insert`,
        method: 'post',
        data
    });
}

// 编辑节点
export function updateNode(data) {
    return request({
        url: `${ctx}/update`,
        method: 'POST',
        data
    });
}

// 删除节点
export function deleteNode(params) {
    return request({
        url: `${ctx}/delete`,
        method: 'delete',
        params
    });
}

// 移动节点
export function moveNode(params) {
    return request({
        url: `${ctx}/move`,
        method: 'post',
        params
    });
}

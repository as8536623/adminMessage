/**
 * @author yuqiusuo
 */

import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.CERT_API}/certCategory` : `${process.env.CERT_API}/certCategory`;

// 根据funCode获取对应树
export function getCertCategoryTree(funcode) {
    return request({
        url: `${ctx}/${funcode}`,
        method: 'get'
    });
}

// 新增接口
export function insertCertCategory(data) {
    return request({
        url: `${ctx}/insert`,
        method: 'post',
        data
    });
}

// 数节点上移下移操作
export function moveCertCategory(params) {
    return request({
        url: `${ctx}/move`,
        method: 'post',
        params
    });
}

// 更新接口
export function updateCertCategory(data) {
    return request({
        url: `${ctx}/update`,
        method: 'post',
        data
    });
}

// 更新接口
export function deleteCertCategory(params) {
    return request({
        url: `${ctx}/delete`,
        method: 'delete',
        params
    });
}

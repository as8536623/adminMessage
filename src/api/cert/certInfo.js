/**
 * @author yuqiusuo
 */

import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.CERT_API}/certInfo` : `${process.env.CERT_API}/certInfo`;

// 按证书获取分页列表
export function certPage(params) {
    return request({
        url: `${ctx}/search`,
        method: 'post',
        params
    });
}

// 按证书获取分页列表
export function certSearchByUser(params) {
    return request({
        url: `${ctx}/searchByUser`,
        method: 'post',
        params
    });
}

// 复制证书
export function certCopy(id) {
    return request({
        url: `${ctx}/copy/${id}`,
        method: 'get'
    });
}

// 停用证书
export function certDisable(id) {
    return request({
        url: `${ctx}/disable/${id}`,
        method: 'get'
    });
}

// 启用证书
export function certEnable(id) {
    return request({
        url: `${ctx}/enable/${id}`,
        method: 'get'
    });
}

// 删除证书
export function certDelete(data) {
    return request({
        url: `${ctx}/delete`,
        method: 'delete',
        data
    });
}

// 保存证书
export function certSave(data) {
    return request({
        url: `${ctx}/save`,
        method: 'post',
        data
    });
}

// 获取code
export function getCertCode() {
    return request({
        url: `${ctx}/getCode`,
        method: 'get'
    });
}

// 获取证书信息
export function getCertDetail(id) {
    return request({
        url: `${ctx}/get/${id}`,
        method: 'get'
    });
}

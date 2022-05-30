/**
 * @author yuqiusuo
 */

import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.CERT_API}/certUserRel` : `${process.env.CERT_API}/certUserRel`;

// 按证书获取分页列表
export function certUserRelPage(params) {
    return request({
        url: `${ctx}/searchByCert`,
        method: 'post',
        params
    });
}

// 按人员ID获取分页列表
export function searchByUser(params) {
    return request({
        url: `${ctx}/searchByUser`,
        method: 'post',
        params
    });
}

// 作废
export function certUserRelDelete(data) {
    return request({
        url: `${ctx}/delete`,
        method: 'delete',
        data
    });
}

// 续期
export function certUserRelRenewal(data) {
    return request({
        url: `${ctx}/renewal`,
        method: 'post',
        data
    });
}

// 刷新证书图片
export function certUserRelRefresh(data) {
    return request({
        url: `${ctx}/refresh`,
        method: 'post',
        data
    });
}

// 获取证书图片地址
export function certUserRelGetImg(data) {
    return request({
        url: `${ctx}/getImg`,
        method: 'post',
        data
    });
}

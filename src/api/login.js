import request from '@/utils/request';

// 指定url完善路径，避免"开发模式重写ajax请求前缀时被改变
// let ctx = process.env.BASE_API;
const ctx = '';

export function loginByUsername(data) {
    return request({
        url: `${process.env.AUTH_API}/server/auth/login`,
        method: 'post',
        data
    });
}

export function logout() {
    return request({
        url: `${process.env.AUTH_API}/server/auth/logout`,
        method: 'post'
    });
}

export function getCode(params) {
    return request({
        url: `${process.env.SAAS_API}/ph-saas-uc/user/securityImg`,
        method: 'get',
        params
    });
}

export function getUserInfo(token) {
    return request({
        url: `${ctx}/user/info`,
        method: 'get'
    });
}

import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.CS_API}/loginPage` : `${process.env.CS_API}/loginPage`;

// 获取当前公司登录页面设置(需要登录)
export function loginPage() {
    return request({
        url: `${ctx}`,
        method: 'get'
    });
}

// 编辑
export function editLoginPage(data) {
    return request({
        url: `${ctx}`,
        method: 'PUT',
        data
    });
}

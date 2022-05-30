import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.CS_API}/personalized` : `${process.env.CS_API}/personalized`;

// 新增、编辑
export function insert(data) {
    return request({
        url: `${ctx}/insert`,
        method: 'post',
        data
    });
}

// 个性化登录回显
export function getPersonalizedSetting() {
    return request({
        url: `${ctx}/get`,
        method: 'get'
    });
}

// 个性化登录回显
export function shareGet() {
    return request({
        url: `${ctx}/share/get`,
        method: 'get'
    });
}

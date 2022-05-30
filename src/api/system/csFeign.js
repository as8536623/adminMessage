import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.CS_API}/csFeign` : `${process.env.CS_API}/csFeign`;

// 获取公司应用
export function getAppCodes() {
    return request({
        url: `${ctx}/getAppCodes`,
        method: 'get'
    });
}

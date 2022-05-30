import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.LOG_API}/exportTask` : `${process.env.LOG_API}/exportTask`;

// 校验是否可以下载 excel
export function getFinalExport(params) {
    return request({
        url: `${ctx}/getFinalExport`,
        method: 'get',
        params
    });
}

// 关闭下载提示
export function closeExport(id) {
    return request({
        url: `${ctx}/closeExport/${id}`,
        method: 'delete'
    });
}

import request from '@/utils/request';
import {getUcPrefix} from '@/utils/ajax';
const ctx = `${getUcPrefix()}/exportTask`;

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

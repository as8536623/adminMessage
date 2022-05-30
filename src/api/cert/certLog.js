/**
 * @author yuqiusuo
 */

import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.CERT_API}/certLog` : `${process.env.CERT_API}/certLog`;

// 证书操作日志
export function certLogAll(id) {
    return request({
        url: `${ctx}/listAll/${id}`,
        method: 'get'
    });
}

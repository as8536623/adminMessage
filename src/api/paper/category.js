import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.PE_API}/category` : `${process.env.PE_API}/category`;

// 试卷类别
export function getTree(params) {
    return request({
        url: `${ctx}/getTree`,
        method: 'get',
        params
    });
}

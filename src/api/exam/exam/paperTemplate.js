import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.PE_API}/paperTemplate` : `${process.env.PE_API}/paperTemplate`;

export function search(data) {
    return request({
        url: `${ctx}/searchPage`,
        method: 'post',
        data
    });
}

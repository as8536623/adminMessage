import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.FACE_API}/courseItems` : `${process.env.FACE_API}/courseItems`;

// 详情
export function courseItemsDetail(params) {
    return request({
        url: `${ctx}/detail`,
        method: 'get',
        params
    });
}

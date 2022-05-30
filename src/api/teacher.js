import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.STU_API}/teacher` : `${process.env.STU_API}/teacher`;

// 获取List
export function getTeacherPage(params) {
    return request({
        url: `${ctx}/search`,
        method: 'post',
        params
    });
}

export function listAll() {
    return request({
        url: `${ctx}/listAll`,
        method: 'get'
    });
}

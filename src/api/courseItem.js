import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctx = getCtx() ? getCtx() + `${process.env.STU_API}/courseItem` : `${process.env.STU_API}/courseItem`;

// 获取课程的内容
export function findByCourseId(params) {
    return request({
        url: `${ctx}/findByCourseId`,
        method: 'get',
        params
    });
}

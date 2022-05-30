import request from '@/utils/request';
import {getCtx} from '@/utils/dev';

const ctxLog = getCtx() ? getCtx() + `${process.env.LOG_API}/export` : `${process.env.LOG_API}/export`;
const ctxStu = getCtx() ? getCtx() + `${process.env.STU_API}/export` : `${process.env.STU_API}/export`;

// 导出前一天的登录人员列表
export function exportLoginUserPage(params) {
    return request({
        url: `${ctxLog}/exportLoginUserPage`,
        method: 'get',
        params
    });
}

// 导出课程统计数据
export function exportCourseStatisticData(params) {
    return request({
        url: `${ctxStu}/exportCourseStatisticData`,
        method: 'get',
        params
    });
}

// 导出专题统计数据
export function exportSubjectStatisticData(params) {
    return request({
        url: `${ctxStu}/exportSubjectStatisticData`,
        method: 'get',
        params
    });
}

// 导出销量排行
export function exportCourseSellData(params) {
    return request({
        url: `${ctxStu}/exportCourseSellData`,
        method: 'get',
        params
    });
}


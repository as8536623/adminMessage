import {CTX} from '@/api/config';
import request from '@/utils/request';

const LOG_PREFIX = CTX.LOG;
const STU_PREFIX = CTX.STU;

/**
 * 登录人数分页
 * @param params
 * @returns {AxiosPromise}
 */
export function pageLoginUserInfoLastDay(params) {
    return request({
        url: LOG_PREFIX + `loginLog/pageLoginUserInfoLastDay`,
        method: 'get',
        params
    });
}

export function statisticLoginUser() {
    return request({
        url: LOG_PREFIX + `loginLog/statisticLoginUserCntLastDayByMonth`,
        method: 'get'
    });
}

/**
 * 课程数据统计分页
 * @param params
 */
export function pageCourseStatisticData(params) {
    return request({
        url: STU_PREFIX + `courseStatistics/pageCourseStatisticData`,
        method: 'get',
        params
    });
}

/**
 * 专题数据统计分页
 * @param params
 */
export function pageSubjectStatisticData(params) {
    return request({
        url: STU_PREFIX + `subjectStatistics/pageSubjectStatisticData`,
        method: 'get',
        params
    });
}

/**
 * 讲师数据统计分页
 * @param params
 */
export function pageTeacherStatisticData(params) {
    return request({
        url: STU_PREFIX + `teacher/statistic`,
        method: 'get',
        params
    });
}

/**
 * 讲师数据导出
 * @param params
 */
export function statisticCourse(params) {
    return request({
        url: STU_PREFIX + `teacher/statisticCourse/${params.id}`,
        method: 'get',
        params
    });
}

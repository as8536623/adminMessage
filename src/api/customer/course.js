import request from '@/utils/request';

const ctx = `${process.env.UC_API}/customerCourse`;

/**
 * 授权课程
 */
export function batchInsert(data) {
    return request({
        url: `${ctx}/batchInsert`,
        method: 'post',
        data
    });
}

/**
 * 获取授权课程信息
 */
export function getCoursePage(params) {
    return request({
        url: `${ctx}/page`,
        method: 'get',
        params
    });
}

/**
 * 获取授权课程
 */
export function pageCourseInfo(params) {
    return request({
        url: `${ctx}/pageCourseInfo`,
        method: 'get',
        params
    });
}

/**
 * 根据courseId和customerName查询课程的统计情况
 * @param params
 */
export function getCourseStatistics(params) {
    return request({
        url: `${ctx}/courseStatistics`,
        method: 'get',
        params: params
    });
}

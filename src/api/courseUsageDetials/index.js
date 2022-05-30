import request from '@/utils/request';

const ctx = `${process.env.UC_API}/courseStatistics`;

/**
 * 课程使用统计列表
 */
export function getCourseUsageDetialsList(data) {
    return request({
        url: `${ctx}/querySelectedCustomerCourseListByPage`,
        method: 'post',
        data
    });
}
/**
 * 用户列表
 */
export function getCourseStudentList(data) {
    return request({
        url: `${ctx}/querySelectedCustomerCourseUserListByPage`,
        method: 'post',
        data
    });
}
/**
 * 课程使用统计头部
 */
export function getCouserUsageDetailsStatistics(data) {
    return request({
        url: `${ctx}/queryHeadCourseDetailStatistics`,
        method: 'post',
        data
    });
}
/**
 * 用户列表统计头部
 */
export function getCouseStudentStatistics(data) {
    return request({
        url: `${ctx}/queryHeadUserStatistics`,
        method: 'post',
        data
    });
}

